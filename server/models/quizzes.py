from sqlalchemy import Enum, Text
from sqlalchemy.orm import Mapped, mapped_column
from models.material import Difficulty, Material
from database import Base


class Quiz(Material, Base):
    __tablename__ = 'quizzes'

    difficulty: Mapped[Difficulty] = mapped_column(Enum(Difficulty), nullable=False)
    time_per_question: Mapped[int] = mapped_column(nullable=False)  # Tempo em segundos
    amount: Mapped[int] = mapped_column(nullable=False)
    note: Mapped[str] = mapped_column(Text, nullable=False)
