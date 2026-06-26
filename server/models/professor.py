from sqlalchemy import String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from models.user import UserType, Usuario


class Professor(Usuario):
    __tablename__ = 'professores'

    id: Mapped[int] = mapped_column(ForeignKey('usuarios.id'), primary_key=True)

    # Por enquanto, os campos abaixo vão poder aceitar valores nulos pois ainda não temos páginas para o usuário indicar esses dados
    materia: Mapped[str] = mapped_column(String(100), nullable=True)
    turma: Mapped[str] = mapped_column(String(20), nullable=True)

    __mapper_args__ = {
        'polymorphic_identity': UserType.PROFESSOR
    }
