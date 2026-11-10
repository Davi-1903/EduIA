from pathlib import Path

from loguru import logger
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError

from database import SessionLocal
from errors.user import UserAlreadyExistsError, UserCredentialsError, UserServiceError, UserTypeError
from models.aluno import Aluno
from models.material import Material, MaterialType
from models.professor import Professor
from models.user import UserType, Usuario
from utils import setup_logger


setup_logger(__name__, Path(__file__).resolve().parents[1] / 'logs' / 'users.log')


def create_user_service(data: dict):
    with SessionLocal() as session:
        try:
            if data['type'] == UserType.ALUNO.value:
                new_user = Aluno(name=data['nome'], email=data['email'], matricula=data['matricula'])
            elif data['type'] == UserType.PROFESSOR.value:
                new_user = Professor(name=data['nome'], email=data['email'], matricula=data['matricula'])
            else:
                raise UserTypeError('Tipo inválido')

            session.add(new_user)
            session.commit()
            session.refresh(new_user)
            logger.info('Cadastro de usuário concluído')

            return new_user

        except IntegrityError:
            session.rollback()
            logger.warning('Cadastro de usuário recusado por conflito de integridade')
            raise UserAlreadyExistsError('Credenciais inválidas')

        except Exception as exc:
            session.rollback()
            logger.error('Falha ao cadastrar usuário')
            raise UserServiceError('Ocorreu um erro ao criar um novo usuário') from exc


def get_user_by_matricula_service(matricula: str):
    with SessionLocal() as session:
        user = session.scalar(select(Usuario).where(Usuario.matricula == matricula))
        if user is None:
            raise UserCredentialsError('Credenciais inválidas')
        return user


def get_user_by_email_service(email: str):
    with SessionLocal() as session:
        user = session.scalar(select(Usuario).where(Usuario.email == email))
        if user is None:
            raise UserCredentialsError('Credenciais inválidas')
        return user


def get_progress_service(id_: int, type_: UserType):
    MATERIALS_STUDENT = {MaterialType.FLASHCARD, MaterialType.ROTEIRO}
    MATERIALS_TEACHER = {MaterialType.FORMULARIO, MaterialType.PLANO_DE_AULA}

    materials_user = set(MaterialType) - (MATERIALS_STUDENT if type_ == UserType.PROFESSOR else MATERIALS_TEACHER)

    with SessionLocal() as session:
        try:
            materials_db = session.scalars(
                select(Material.type).where(Material.user_id == id_).where(Material.deleted_at.is_(None)).distinct()
            ).all()
            return {material.value.lower(): material in materials_db for material in materials_user}

        except Exception as exc:
            raise UserServiceError('Ocorreu um erro ao buscar o progresso do usuário') from exc
