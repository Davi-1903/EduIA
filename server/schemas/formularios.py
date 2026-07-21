from typing import Any
from pydantic import BaseModel, ValidationError


class Answer(BaseModel):
    id: int
    text: str


class FormularioJSON(BaseModel):
    id: int
    question: str
    answers: list[Answer]
    correctAnswerId: int

    @classmethod
    def check(cls, questions: list[dict[str, Any]]) -> bool:
        try:
            for question in questions:
                cls(**question)
            return True

        except ValidationError:
            return False
