from typing import Any
from pydantic import BaseModel, ValidationError


class Answer(BaseModel):
    id: int
    text: str


class QuizJSON(BaseModel):
    id: int
    question: str
    answers: list[Answer]
    correctAnswerId: int

    @classmethod
    def check(cls, quiz: list[dict[str, Any]]) -> bool:
        try:
            for question in quiz:
                cls(**question)
            return True

        except ValidationError:
            return False
