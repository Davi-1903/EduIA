import enum
from typing import TYPE_CHECKING, Any
from datetime import datetime
from sqlalchemy import JSON, DateTime, Enum, ForeignKey, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.ext.mutable import MutableDict
from database import Base


if TYPE_CHECKING:
    from models.user import Usuario


class MaterialType(enum.Enum):
    DESAFIO = 'desafio'
    EXERCICIO_GUIADO = 'exercicio guiado'
    EXPLICACAO = 'explicacao'
    FLASHCARD = 'flashcards'
    FORMULARIO = 'formulario'
    PLANO_DE_AULA = 'plano de aula'
    QUESTOES = 'questoes'
    QUIZ = 'quiz'
    RESUMO = 'resumo'
    ROTEIRO = 'roteiro'


class Difficulty(enum.Enum):
    MUITO_FACIL = 'Muito fácil'
    FACIL = 'Fácil'
    MEDIO = 'Médio'
    DIFICIL = 'Difícil'
    MUITO_DIFICIL = 'Muito difícil'


class Material(Base):
    __tablename__ = 'materiais'

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(ForeignKey('usuarios.id'), nullable=False)
    discipline: Mapped[str] = mapped_column(String(100), nullable=False)
    subject: Mapped[str] = mapped_column(String(150), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    content: Mapped[dict[str, Any]] = mapped_column(MutableDict.as_mutable(JSON), nullable=False)
    type: Mapped[MaterialType] = mapped_column(Enum(MaterialType), nullable=False)

    user: Mapped['Usuario'] = relationship(back_populates='materials')

    __mapper_args__ = {'polymorphic_identity': None, 'polymorphic_on': 'type'}
