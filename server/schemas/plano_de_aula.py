from pydantic import BaseModel, Field


class PlanoDeAula(BaseModel):
    content: str = Field(min_length=1, description='Plano de aula completo em Markdown')