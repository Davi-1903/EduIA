import enum
from typing import TYPE_CHECKING, Any
from datetime import datetime
from sqlalchemy import JSON, DateTime, ForeignKey, String, func
from sqlalchemy.orm import Mapped, declared_attr, mapped_column, relationship
from sqlalchemy.ext.mutable import MutableDict

if TYPE_CHECKING:
    from models.user import Usuario


class Difficulty(enum.Enum):
    MUITO_FACIL = 'Muito fácil'
    FACIL = 'Fácil'
    MEDIO = 'Médio'
    DIFICIL = 'Difícil'
    MUITO_DIFICIL = 'Muito difícil'


class Material:
    __abstract__ = True

    @declared_attr
    def id(cls) -> Mapped[int]:
        return mapped_column(primary_key=True, autoincrement=True)

    @declared_attr
    def user_id(cls) -> Mapped[int]:
        return mapped_column(ForeignKey('usuarios.id'), nullable=False)

    @declared_attr
    def discipline(cls) -> Mapped[str]:
        return mapped_column(String(100), nullable=False)

    @declared_attr
    def subject(cls) -> Mapped[str]:
        return mapped_column(String(150), nullable=False)

    @declared_attr
    def created_at(cls) -> Mapped[datetime]:
        return mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    @declared_attr
    def content(cls) -> Mapped[dict[str, Any]]:
        return mapped_column(MutableDict.as_mutable(JSON), nullable=False)

    @declared_attr
    def user(cls) -> Mapped['Usuario']:
        return relationship(back_populates='materials')
