from urllib.parse import parse_qsl, urlencode, urlsplit, urlunsplit

import requests
from flask import current_app
from loguru import logger

from errors.auth import SuapAuthenticationError
from errors.user import UserAlreadyExistsError, UserCredentialsError
from models.user import UserType, Usuario
from services.user import create_user_service, get_user_by_email_service, get_user_by_matricula_service


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
    last_status = None
    connection_error = None

    for profile_url in (current_app.config['SUAP_PROFILE_URL'], current_app.config['SUAP_PROFILE_FALLBACK_URL']):
        for scheme in ('Bearer', 'JWT'):
            try:
                response = requests.get(
                    profile_url,
                    headers={'Authorization': f'{scheme} {access_token}'},
                    timeout=10,
                )
            except requests.RequestException as err:
                connection_error = err
                continue

            if response.ok:
                try:
                    profile = response.json()
                except requests.exceptions.JSONDecodeError as err:
                    raise SuapAuthenticationError('Resposta de perfil inválida do SUAP') from err
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
    registration = profile.get('identificacao')
    if registration is None or not str(registration).strip():
        raise SuapAuthenticationError('Matrícula não encontrada no perfil do SUAP')

    relationship_type = (profile.get('tipo_usuario') or '').strip().lower()
    if 'aluno' in relationship_type:
        user_type = UserType.ALUNO
    elif any(term in relationship_type for term in ('professor', 'servidor', 'docente')):
        user_type = UserType.PROFESSOR
    else:
        raise SuapAuthenticationError('Tipo de vínculo SUAP não suportado', 'unsupported_user')

    name = profile.get('nome_registro')
    if not isinstance(name, str) or not name.strip():
        raise SuapAuthenticationError('Nome não encontrado no perfil do SUAP')
    name = name.strip()[:50]

    email = next(
        value.strip().lower()
        for value in (
            profile.get('email_google_classroom'),
            profile.get('email_academico'),
            profile.get('email_preferencial'),
        )
        if isinstance(value, str) and '@' in value.strip()
    )

    try:
        user = get_user_by_matricula_service(registration)
        if user.type != user_type:
            raise SuapAuthenticationError('Tipo de vínculo SUAP incompatível com a conta', 'account_conflict')
        return user
    except UserCredentialsError:
        pass

    # Testando se já há um usuário cadastrado com esse email
    try:
        _ = get_user_by_email_service(email)
        raise SuapAuthenticationError(
            'Este e-mail já pertence a uma conta. Entre com ela ou solicite a vinculação ao administrador.',
            'account_conflict',
        )
    except UserCredentialsError:
        pass

    # Criando novo usuário
    try:
        new_user = create_user_service(
            {
                'nome': profile['nome_registro'],
                'email': email,
                'matricula': registration,
                'foto': profile['foto'],
                'type': user_type.value,
            }
        )
        return new_user
    except UserAlreadyExistsError as err:
        raise SuapAuthenticationError('Não foi possível criar a conta SUAP', 'account_conflict') from err
