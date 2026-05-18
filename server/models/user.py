import enum
from flask_login import UserMixin
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, ForeignKey, Enum
from database import Base


class UserType(enum.Enum):
    PROFESSOR = 'professor'
    ALUNO = 'aluno'


class Usuario(Base, UserMixin):
    __tablename__ = 'usuarios'

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(30), nullable=False)
    email: Mapped[str] = mapped_column(String(150), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(String(255), nullable=False)
    type: Mapped[UserType] = mapped_column(Enum(UserType), nullable=False)

    __mapper_args__ = {
        'polymorphic_identity': 'usuario',
        'polymorphic_on': type
    }


class Professor(Usuario):
    __tablename__ = 'professores'

    id: Mapped[int] = mapped_column(ForeignKey('usuarios.id'), primary_key=True)

    # Por enquanto, os campos abaixo vão poder aceitar valores nulos pois ainda não temos páginas para o usuário indicar esses dados
    materia: Mapped[str] = mapped_column(String(100), nullable=True)
    turma: Mapped[str] = mapped_column(String(20), nullable=True)

    __mapper_args__ = {
        'polymorphic_identity': UserType.PROFESSOR
    }


class Aluno(Usuario):
    __tablename__ = 'alunos'

    id: Mapped[int] = mapped_column(ForeignKey('usuarios.id'), primary_key=True)

    # Por enquanto, o campo abaixo vai poder aceitar valores nulos pois ainda não temos páginas para o usuário indicar esses dados
    turma: Mapped[str] = mapped_column(String(20), nullable=True)

    __mapper_args__ = {
        'polymorphic_identity': UserType.ALUNO
    }
