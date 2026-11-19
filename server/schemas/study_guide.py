from pydantic import BaseModel, Field


class StudyGuide(BaseModel):
    content: str = Field(min_length=1, description='Roteiro de estudo completo em Markdown')