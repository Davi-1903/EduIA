import enum
from typing import TYPE_CHECKING
from flask_login import UserMixin
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Enum
from database import Base


if TYPE_CHECKING:
    from models.material import Material


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

    materials: Mapped[list['Material']] = relationship(back_populates='user')

    __mapper_args__ = {'polymorphic_identity': 'usuario', 'polymorphic_on': 'type'}
