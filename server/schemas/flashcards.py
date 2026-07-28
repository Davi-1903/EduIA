from pydantic import BaseModel


class FlashCardsJSON(BaseModel):
    id: int
    question: str
    answer: str
