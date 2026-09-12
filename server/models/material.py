import enum
from datetime import datetime
from typing import TYPE_CHECKING, Any

from sqlalchemy import JSON, DateTime, Enum, ForeignKey, Index, String, func
from sqlalchemy.ext.mutable import MutableDict
from sqlalchemy.orm import Mapped, mapped_column, relationship

from database import Base


if TYPE_CHECKING:
    from models.historico import Historico
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
    deleted_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    user: Mapped['Usuario'] = relationship(back_populates='materials')

    # Não foi definido ainda se o histórico será apagado junto com o material ou será mantido, então por enquanto
    # terá um cascade delete para manter a integridade referencial, mas isso pode ser alterado no futuro.
    historico: Mapped['Historico'] = relationship(
        back_populates='material', uselist=False, cascade='all, delete-orphan'
    )

    __mapper_args__ = {'polymorphic_identity': None, 'polymorphic_on': 'type'}
    __table_args__ = (Index('ix_materials_fulltext', 'discipline', 'subject', mysql_prefix='FULLTEXT'),)
