from pydantic import ValidationError

from errors.ai import AiInvalidData, AiInvalidRequest
from schemas.quizzes import Quiz

from ..gateways import generate_quizzes as generate_quizzes_gateway


def generate_quiz(data: dict):
    try:
        payload = {
            'disciplina': data['discipline'],
            'quantidade': data['amount'],
            'dificuldade': data['difficulty'],
            'assunto': data['subject'],
            'observacoes': data.get('note') or 'Não há observações',
        }
    except (KeyError, TypeError) as error:
        raise AiInvalidData('Dados inválidos para geração de questões') from error

    try:
        content = generate_quizzes_gateway(payload)
        Quiz.model_validate(content)
        return content
    except ValidationError as error:
        raise AiInvalidData('A IA retornou dados inválidos') from error
    except AiInvalidRequest as error:
        raise AiInvalidData(str(error)) from error
