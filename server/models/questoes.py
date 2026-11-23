from typing import Any

from sqlalchemy import JSON, CheckConstraint, Enum, ForeignKey, Text
from sqlalchemy.ext.mutable import MutableDict
from sqlalchemy.orm import Mapped, mapped_column

from models.material import Difficulty, Material, MaterialType


class Questoes(Material):
    __tablename__ = 'questoes'

    id: Mapped[int] = mapped_column(ForeignKey('materiais.id'), primary_key=True)
    difficulty: Mapped[Difficulty] = mapped_column(Enum(Difficulty), nullable=False)
    amount: Mapped[int] = mapped_column(nullable=False)
    note: Mapped[str] = mapped_column(Text, nullable=True)
    answers: Mapped[dict[str, Any] | None] = mapped_column(MutableDict.as_mutable(JSON), nullable=True)
    time_used: Mapped[int | None] = mapped_column(nullable=True)

    __mapper_args__ = {'polymorphic_identity': MaterialType.QUESTOES}
    __table_args__ = (CheckConstraint('amount >= 5 AND amount <= 50', name='check_questoes_amount_range'),)
