from typing import Any
from pydantic import BaseModel


class ExercicioGuiadoJSON(BaseModel):
    content: dict[str, Any]
