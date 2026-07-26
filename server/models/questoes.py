from sqlalchemy import CheckConstraint, Enum, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column
from models.material import Difficulty, Material, MaterialType


class Questoes(Material):
    __tablename__ = 'questoes'

    id: Mapped[int] = mapped_column(ForeignKey('materiais.id'), primary_key=True)
    difficulty: Mapped[Difficulty] = mapped_column(Enum(Difficulty), nullable=False)
    amount: Mapped[int] = mapped_column(nullable=False)
    note: Mapped[str] = mapped_column(Text, nullable=False)

    __mapper_args__ = {'polymorphic_identity': MaterialType.QUESTOES}
    __table_args__ = (CheckConstraint('amount >= 5 AND amount <= 50', name='check_amount_range'),)
