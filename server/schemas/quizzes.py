from pydantic import BaseModel


class Answer(BaseModel):
    id: int
    text: str


class QuizJSON(BaseModel):
    id: int
    question: str
    answers: list[Answer]
    correctAnswerId: int


class Quiz(BaseModel):
    content: list[QuizJSON]


class SubmittedAnswer(BaseModel):
    questionId: int
    answerId: int | None = None


class QuizSubmission(BaseModel):
    answers: list[SubmittedAnswer]