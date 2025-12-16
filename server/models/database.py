from flask_login import UserMixin
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, ForeignKey

from . import Base
from .connection import engine

class User(Base, UserMixin):
    __tablename__ = 'users'

    id:Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    user_name:Mapped[str] = mapped_column(String(30), unique=True, nullable=False)
    full_name:Mapped[str] = mapped_column(nullable=False)
    email:Mapped[str] = mapped_column(unique=True, nullable=False)
    password:Mapped[str] = mapped_column(nullable=False)

    type:Mapped[str] = mapped_column(String(50))
    __mapper_args__ = {
        'polymorphic_identity':'user',
        'polymorphic_on':type
    }

    def get_id(self):
        return str(self.id)

class Professor(User):
    __tablename__ = 'professores'

    id:Mapped[int] = mapped_column(ForeignKey("users.id"),primary_key=True)
    materia:Mapped[str] = mapped_column(nullable=False)
    turma:Mapped[str] = mapped_column(nullable=False)

    __mapper_args__ = {
        "polymorphic_identity": "professor"
    }

class Aluno(User):
    __tablename__ = 'alunos'

    id:Mapped[int] = mapped_column(ForeignKey("users.id"),primary_key=True)
    turma:Mapped[str] = mapped_column(nullable=False)

    __mapper_args__ = {
        "polymorphic_identity": "aluno"
    }

Base.metadata.create_all(engine)