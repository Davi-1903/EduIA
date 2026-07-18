from typing import Any
from pydantic import BaseModel
from wtforms import ValidationError


class FlashCardsJSON(BaseModel):
    id: int
    question: str
    answer: str

    @classmethod
    def check(cls, flashcards: list[dict[str, Any]]) -> bool:
        try:
            for flashcard in flashcards:
                cls(**flashcard)
            return True

        except ValidationError:
            return False
