from urllib.parse import parse_qsl, urlencode, urlsplit, urlunsplit

import requests
from flask import current_app
from loguru import logger
from pwdlib import PasswordHash
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError

from database import SessionLocal
from errors.auth import SuapAuthenticationError
from models.aluno import Aluno
from models.professor import Professor
from models.user import UserType, Usuario


password_hasher = PasswordHash.recommended()


def build_suap_authorization_url(state: str) -> str:
    config = current_app.config
    authorization_url = config['SUAP_AUTHORIZATION_URL']
    if not config['SUAP_CLIENT_ID'] or not config['SUAP_REDIRECT_URI']:
        raise SuapAuthenticationError('Configuração OAuth do SUAP incompleta', 'unavailable')

    parsed_url = urlsplit(authorization_url)
    query = dict(parse_qsl(parsed_url.query))
    query.update(
        {
            'response_type': 'code',
            'client_id': config['SUAP_CLIENT_ID'],
            'redirect_uri': config['SUAP_REDIRECT_URI'],
            'state': state,
        }
    )
    return urlunsplit(parsed_url._replace(query=urlencode(query)))


def authenticate_suap_code(code: str) -> Usuario:
    config = current_app.config
    required_settings = ('SUAP_CLIENT_ID', 'SUAP_CLIENT_SECRET', 'SUAP_REDIRECT_URI', 'SUAP_TOKEN_URL')
    if any(not config.get(setting) for setting in required_settings):
        raise SuapAuthenticationError('Configuração OAuth do SUAP incompleta', 'unavailable')

    try:
        token_response = requests.post(
            config['SUAP_TOKEN_URL'],
            data={
                'grant_type': 'authorization_code',
                'code': code,
                'client_id': config['SUAP_CLIENT_ID'],
                'client_secret': config['SUAP_CLIENT_SECRET'],
                'redirect_uri': config['SUAP_REDIRECT_URI'],
            },
            timeout=10,
        )
    except requests.RequestException as error:
        raise SuapAuthenticationError('Não foi possível conectar ao SUAP', 'unavailable') from error

    if not token_response.ok:
        logger.warning('SUAP recusou a troca do código OAuth: HTTP {}', token_response.status_code)
        raise SuapAuthenticationError('Falha ao obter token do SUAP')

    try:
        access_token = token_response.json().get('access_token')
    except (ValueError, AttributeError) as error:
        raise SuapAuthenticationError('Resposta inválida do SUAP') from error

    if not isinstance(access_token, str) or not access_token:
        raise SuapAuthenticationError('Token de acesso não retornado pelo SUAP')

    profile = fetch_suap_profile(access_token)
    return find_or_create_user(profile)


def fetch_suap_profile(access_token: str) -> dict:
    profile_urls = dict.fromkeys(
        (current_app.config['SUAP_PROFILE_URL'], current_app.config['SUAP_PROFILE_FALLBACK_URL'])
    )
    last_status = None
    connection_error = None

    for profile_url in profile_urls:
        for scheme in ('Bearer', 'JWT'):
            try:
                response = requests.get(
                    profile_url,
                    headers={'Authorization': f'{scheme} {access_token}'},
                    timeout=10,
                )
            except requests.RequestException as error:
                connection_error = error
                continue

            if response.ok:
                try:
                    profile = response.json()
                except ValueError as error:
                    raise SuapAuthenticationError('Resposta de perfil inválida do SUAP') from error
                if isinstance(profile, dict):
                    return profile
                raise SuapAuthenticationError('Formato de perfil inválido do SUAP')

            last_status = response.status_code

    if connection_error and last_status is None:
        raise SuapAuthenticationError(
            'Não foi possível consultar o perfil no SUAP', 'unavailable'
        ) from connection_error

    logger.warning('SUAP não autorizou a consulta do perfil: HTTP {}', last_status)
    raise SuapAuthenticationError('Falha ao consultar o perfil no SUAP')


def find_or_create_user(profile: dict) -> Usuario:
    relationship = profile.get('vinculo')
    relationship = relationship if isinstance(relationship, dict) else {}
    registration = profile.get('matricula') or relationship.get('matricula') or profile.get('identificacao')
    if registration is None or not str(registration).strip():
        raise SuapAuthenticationError('Matrícula não encontrada no perfil do SUAP')
    registration = str(registration).strip()
    if len(registration) > 30:
        raise SuapAuthenticationError('Matrícula SUAP inválida')

    relationship_type = str(profile.get('tipo_vinculo') or profile.get('tipo_usuario') or '').strip().lower()
    if 'aluno' in relationship_type:
        user_type = UserType.ALUNO
        user_class = Aluno
    elif any(term in relationship_type for term in ('professor', 'servidor', 'docente')):
        user_type = UserType.PROFESSOR
        user_class = Professor
    else:
        raise SuapAuthenticationError('Tipo de vínculo SUAP não suportado', 'unsupported_user')

    name = relationship.get('nome') or profile.get('nome_registro') or profile.get('nome_usual') or profile.get('nome')
    if not isinstance(name, str) or not name.strip():
        raise SuapAuthenticationError('Nome não encontrado no perfil do SUAP')
    name = name.strip()[:30]

    email = next(
        (
            value.strip().lower()
            for value in (
                profile.get('email_academico'),
                profile.get('email_institucional'),
                profile.get('email_preferencial'),
                profile.get('email'),
            )
            if isinstance(value, str) and '@' in value.strip()
        ),
        f'{registration}@escolar.ifrn.edu.br',
    )
    if len(email) > 150:
        raise SuapAuthenticationError('E-mail do perfil SUAP inválido')

    with SessionLocal() as session:
        user = session.scalar(select(Usuario).where(Usuario.suap_matricula == registration))
        if user:
            if user.type != user_type:
                raise SuapAuthenticationError('Tipo de vínculo SUAP incompatível com a conta', 'account_conflict')
            return user

        email_owner = session.scalar(select(Usuario).where(Usuario.email == email))
        if email_owner:
            raise SuapAuthenticationError(
                'Este e-mail já pertence a uma conta. Entre com ela ou solicite a vinculação ao administrador.',
                'account_conflict',
            )

        try:
            user = user_class(
                name=name,
                email=email,
                password=password_hasher.hash('1234'),
                suap_matricula=registration,
            )
            session.add(user)
            session.commit()

        except IntegrityError as error:
            session.rollback()
            raise SuapAuthenticationError('Não foi possível criar a conta SUAP', 'account_conflict') from error

        session.refresh(user)
        return user
