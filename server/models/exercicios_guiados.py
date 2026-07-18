from sqlalchemy import Enum, Text
from sqlalchemy.orm import Mapped, mapped_column
from models.material import Difficulty, Material
from database import Base


class ExercicioGuiado(Material, Base):
    __tablename__ = 'exercicios_guiados'

    difficulty: Mapped[Difficulty] = mapped_column(Enum(Difficulty), nullable=False)
    amount: Mapped[int] = mapped_column(nullable=False)
    resolution: Mapped[bool] = mapped_column(nullable=False)
    theory: Mapped[bool] = mapped_column(nullable=False)
    multiple_choice: Mapped[bool] = mapped_column(nullable=False)
    true_or_false: Mapped[bool] = mapped_column(nullable=False)
    discursive: Mapped[bool] = mapped_column(nullable=False)
    interpretation: Mapped[bool] = mapped_column(nullable=False)
    code: Mapped[bool] = mapped_column(nullable=False)
    note: Mapped[str] = mapped_column(Text, nullable=False)
