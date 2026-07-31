from sqlalchemy import CheckConstraint, Enum, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column
from models.material import Difficulty, Material, MaterialType


class ExercicioGuiado(Material):
    __tablename__ = 'exercicios_guiados'

    id: Mapped[int] = mapped_column(ForeignKey('materiais.id'), primary_key=True)
    difficulty: Mapped[Difficulty] = mapped_column(Enum(Difficulty), nullable=False)
    amount: Mapped[int] = mapped_column(nullable=False)
    resolution: Mapped[bool] = mapped_column(nullable=False)
    theory: Mapped[bool] = mapped_column(nullable=False)
    multiple_choice: Mapped[bool] = mapped_column(nullable=False)
    true_or_false: Mapped[bool] = mapped_column(nullable=False)
    discursive: Mapped[bool] = mapped_column(nullable=False)
    interpretation: Mapped[bool] = mapped_column(nullable=False)
    code: Mapped[bool] = mapped_column(nullable=False)
    note: Mapped[str] = mapped_column(Text, nullable=True)

    __mapper_args__ = {'polymorphic_identity': MaterialType.EXERCICIO_GUIADO}
    __table_args__ = (CheckConstraint('amount >= 5 AND amount <= 50', name='check_exercicio_guiado_amount_range'),)
