from pwdlib import PasswordHash
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError

from database import SessionLocal
from errors.user import UserAlreadyExistsError, UserCredentialsError, UserServiceError, UserTypeError
from models.aluno import Aluno
from models.professor import Professor
from models.user import UserType, Usuario


ph = PasswordHash.recommended()


def create_user_service(data: dict):
    with SessionLocal() as session:
        try:
            if data['type'] == UserType.ALUNO.value:
                new_user = Aluno(name=data['nome'], email=data['email'], password=ph.hash(data['password']))
            elif data['type'] == UserType.PROFESSOR.value:
                new_user = Professor(name=data['nome'], email=data['email'], password=ph.hash(data['password']))
            else:
                raise UserTypeError('Tipo inválido')

            session.add(new_user)
            session.commit()
            session.refresh(new_user)

            return new_user

        except IntegrityError:
            session.rollback()
            raise UserAlreadyExistsError('Credenciais inválidas')

        except Exception as exc:
            session.rollback()
            raise UserServiceError('Ocorreu um erro ao criar um novo usuário') from exc


def get_user_service(email: str, password: str):
    with SessionLocal() as session:
        try:
            user = session.scalar(select(Usuario).where(Usuario.email == email))
            if user is None or not ph.verify(password, user.password):
                raise UserCredentialsError('Credenciais inválidas')

            return user

        except Exception as exc:
            raise UserServiceError('Ocorreu um erro interno') from exc
