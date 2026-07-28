from typing import Any
from pydantic import BaseModel


class ResumosJSON(BaseModel):
    content: dict[str, Any]
