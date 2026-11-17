from pydantic import BaseModel


class ResumosJSON(BaseModel):
    id: int
    content: str

