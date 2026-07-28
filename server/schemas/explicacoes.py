from typing import Any
from pydantic import BaseModel


class ExplicacoesJSON(BaseModel):
    content: dict[str, Any]
