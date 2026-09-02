from pydantic import BaseModel


class ResumosJSON(BaseModel):
    content: str  # Armazenado em markdown
