from typing import Any

from sqlalchemy import JSON, CheckConstraint, Enum, ForeignKey, Text
from sqlalchemy.ext.mutable import MutableDict
from sqlalchemy.orm import Mapped, mapped_column

from models.material import Difficulty, Material, MaterialType


class Quiz(Material):
    __tablename__ = 'quizzes'

    id: Mapped[int] = mapped_column(ForeignKey('materiais.id'), primary_key=True)
    difficulty: Mapped[Difficulty] = mapped_column(Enum(Difficulty), nullable=False)
    time_per_question: Mapped[int] = mapped_column(nullable=False)  # Tempo em segundos
    amount: Mapped[int] = mapped_column(nullable=False)
    note: Mapped[str] = mapped_column(Text, nullable=True)
    answers: Mapped[dict[str, Any] | None] = mapped_column(MutableDict.as_mutable(JSON), nullable=True)

    __mapper_args__ = {'polymorphic_identity': MaterialType.QUIZ}
    __table_args__ = (
        CheckConstraint('amount >= 5 AND amount <= 50', name='check_quiz_amount_range'),
        CheckConstraint(
            'time_per_question >= 10 AND time_per_question <= 60', name='check_quiz_time_per_question_range'
        ),
    )
