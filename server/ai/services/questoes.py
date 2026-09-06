from ..gateways.huggingface import generate_questions as generate_questions_with_huggingface
from errors.ai import AiInvalidData, AiInvalidRequest


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
        return generate_questions_with_huggingface(payload)
    except AiInvalidRequest as error:
        raise AiInvalidData(str(error)) from error
