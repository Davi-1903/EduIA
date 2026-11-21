from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column

from models.user import UserType, Usuario


class Aluno(Usuario):
    __tablename__ = 'alunos'

    id: Mapped[int] = mapped_column(ForeignKey('usuarios.id'), primary_key=True)

    __mapper_args__ = {'polymorphic_identity': UserType.ALUNO}
