from typing import Any
from pydantic import BaseModel


class DesafioJSON(BaseModel):
    content: dict[str, Any]
