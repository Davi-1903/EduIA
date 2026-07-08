from sqlalchemy import String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from models.user import Usuario, UserType


class Aluno(Usuario):
    __tablename__ = 'alunos'

    id: Mapped[int] = mapped_column(ForeignKey('usuarios.id'), primary_key=True)

    # Por enquanto, o campo abaixo vai poder aceitar valores nulos pois ainda não temos páginas para o usuário indicar esses dados
    turma: Mapped[str] = mapped_column(String(20), nullable=True)

    __mapper_args__ = {'polymorphic_identity': UserType.ALUNO}
