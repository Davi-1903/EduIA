from typing import Literal

from pydantic import BaseModel, model_validator

from schemas.questoes import Answer


class ExercicioGuiadoJSON(BaseModel):
    id: int
    question: str
    answers: list[Answer] | None = None  
    correctAnswerId: int | None = None  
    correctAnswer: bool | None = None  
    expectedAnswer: str | None = None  
    hint: str
    explanation: str


class ExerciciosGuiados(BaseModel):
    type: Literal['multiple_choice', 'true_or_false', 'discursive']
    content: list[ExercicioGuiadoJSON]

    @model_validator(mode='after')
    def validar_campos_por_tipo(self):
        for questao in self.content:
            if self.type == 'multiple_choice':
                if not questao.answers or len(questao.answers) != 4 or questao.correctAnswerId is None:
                    raise ValueError('Questão objetiva exige 4 alternativas e correctAnswerId')
            elif self.type == 'true_or_false':
                if questao.correctAnswer is None:
                    raise ValueError('Questão verdadeiro/falso exige correctAnswer')
            elif not questao.expectedAnswer:
                raise ValueError('Questão discursiva exige expectedAnswer')
        return self