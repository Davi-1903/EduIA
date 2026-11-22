from pydantic import BaseModel, Field


class FormularioJSON(BaseModel):
    id: int
    question: str
    expectedAnswer: str


class Formularios(BaseModel):
    content: list[FormularioJSON]


class Answer(BaseModel):
    id: int
    result: int = Field(ge=0, le=10, description='Número inteiro de 0 a 10')


class Answers(BaseModel):
    answers: list[Answer]
