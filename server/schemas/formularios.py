from pydantic import BaseModel


class FormularioJSON(BaseModel):
    id: int
    question: str
    expectedAnswer: str


class Formularios(BaseModel):
    content: list[FormularioJSON]


class Answer(BaseModel):
    id: int
    answer: str
    exptectedAnswer: str


class Answers(BaseModel):
    answers: list[Answer]
