from pydantic import BaseModel


class ExercicioGuiadoJSON(BaseModel):
    content: str  # Armazenado em markdown
