from pydantic import BaseModel


class PlanoDeAulaJSON(BaseModel):
    content: str  # Armazenado em markdown
