from pydantic import BaseModel


class RoteiroJSON(BaseModel):
    content: str  # Armazenado em markdown
