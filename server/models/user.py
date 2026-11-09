import enum
from typing import TYPE_CHECKING

from flask_login import UserMixin
from sqlalchemy import Enum, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from database import Base


if TYPE_CHECKING:
    from models.material import Material


class UserType(enum.Enum):
    PROFESSOR = 'professor'
    ALUNO = 'aluno'


class Usuario(Base, UserMixin):
    __tablename__ = 'usuarios'
    __table_args__ = (UniqueConstraint('suap_matricula', name='uq_usuarios_suap_matricula'),)

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(30), nullable=False)
    email: Mapped[str] = mapped_column(String(150), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(String(255), nullable=False)
    suap_matricula: Mapped[str | None] = mapped_column(String(30), nullable=True)
    type: Mapped[UserType] = mapped_column(Enum(UserType), nullable=False)

    materials: Mapped[list['Material']] = relationship(back_populates='user')

    __mapper_args__ = {'polymorphic_identity': None, 'polymorphic_on': 'type'}
