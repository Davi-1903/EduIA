from typing import Any
from pydantic import BaseModel, ValidationError


class ResumosJSON(BaseModel):
    content: dict[str, Any]

    @classmethod
    def check(cls, data: dict[str, Any]) -> bool:
        try:
            cls(**data)
            return True

        except ValidationError:
            return False
