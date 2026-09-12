from pydantic import ValidationError

from errors.ai import AiInvalidData, AiInvalidRequest
from schemas.questoes import Questoes

from ..gateways import generate_questions as generate_questions_gateway


def generate_questions(data: dict):
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
        content = generate_questions_gateway(payload)
        Questoes.model_validate(content)
        return content
    except ValidationError as error:
        raise AiInvalidData('A IA retornou dados inválidos') from error
    except AiInvalidRequest as error:
        raise AiInvalidData(str(error)) from error
