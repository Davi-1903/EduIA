from pydantic import BaseModel


class FormularioJSON(BaseModel):
    id: int
    question: str
    expectedAnswer: str


class Formularios(BaseModel):
    content: list[FormularioJSON]
