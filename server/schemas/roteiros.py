from typing import Any
from pydantic import BaseModel


class RoteiroJSON(BaseModel):
    content: dict[str, Any]
