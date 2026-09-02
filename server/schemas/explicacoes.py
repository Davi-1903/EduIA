from pydantic import BaseModel


class ExplicacoesJSON(BaseModel):
    content: str  # Armazenado em markdown
