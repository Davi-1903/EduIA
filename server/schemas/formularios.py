from pydantic import BaseModel


class Answer(BaseModel):
    id: int
    text: str


class FormularioJSON(BaseModel):
    id: int
    question: str
    answers: list[Answer]
    correctAnswerId: int
