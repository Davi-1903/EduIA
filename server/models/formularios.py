from typing import Any

from sqlalchemy import JSON, CheckConstraint, Enum, ForeignKey, Text
from sqlalchemy.ext.mutable import MutableDict
from sqlalchemy.orm import Mapped, mapped_column

from models.material import Difficulty, Material, MaterialType


class Formulario(Material):
    __tablename__ = 'formularios'

    id: Mapped[int] = mapped_column(ForeignKey('materiais.id'), primary_key=True)
    difficulty: Mapped[Difficulty] = mapped_column(Enum(Difficulty), nullable=False)
    amount: Mapped[int] = mapped_column(nullable=False)
    note: Mapped[str] = mapped_column(Text, nullable=True)
    answers: Mapped[dict[str, Any] | None] = mapped_column(MutableDict.as_mutable(JSON), nullable=True)

    __mapper_args__ = {'polymorphic_identity': MaterialType.FORMULARIO}
    __table_args__ = (CheckConstraint('amount >= 5 AND amount <= 50', name='check_formulario_amount_range'),)
