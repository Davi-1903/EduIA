from pydantic import BaseModel


class DesafioJSON(BaseModel):
    id: int
    question: str
    answer: str


class Desafio(BaseModel):
    content: list[DesafioJSON]
