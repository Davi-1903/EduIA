from pydantic import BaseModel, Field


class FormularioJSON(BaseModel):
    id: int
    question: str
    expectedAnswer: str


class Formularios(BaseModel):
    content: list[FormularioJSON]


class Answer(BaseModel):
    id: int
    result: int = Field(ge=1, le=10, description='Número inteiro de 1 à 10')


class Answers(BaseModel):
    answers: list[Answer]
