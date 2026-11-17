from pydantic import BaseModel


class ResumosJSON(BaseModel):
    id: int
    title: str
    text: str

class Resumos(BaseModel):
    content: list[ResumosJSON]