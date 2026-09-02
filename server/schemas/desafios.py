from pydantic import BaseModel


class DesafioJSON(BaseModel):
    content: str  # Armazenado em markdown
