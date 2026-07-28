from typing import Any
from pydantic import BaseModel


class PlanoDeAulaJSON(BaseModel):
    content: dict[str, Any]
