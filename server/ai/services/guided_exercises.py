from langchain_core.exceptions import OutputParserException
from pydantic import ValidationError

from errors.ai import AiInvalidData, AiInvalidRequest
from schemas.exercicios_guiados import ExerciciosGuiados

from ..gateways.guided_exercises import generate_guided_exercises as generate_guided_exercises_gateway


TIPOS_VALIDOS = {'multiple_choice', 'true_or_false', 'discursive'}


def generate_guided_exercises(data: dict):
    try:
        payload = {
            'disciplina': data['discipline'],
            'quantidade': data['amount'],
            'tipo': data['type'],
            'dificuldade': data['difficulty'],
            'assunto': data['subject'],
            'observacoes': data.get('note') or 'Não há observações',
        }
    except (KeyError, TypeError) as error:
        raise AiInvalidData('Dados inválidos para geração de exercícios guiados') from error

    if payload['tipo'] not in TIPOS_VALIDOS:
        raise AiInvalidData('Tipo de exercício guiado inválido')

    for _ in range(3):
        try:
            content = generate_guided_exercises_gateway(payload)
            content['type'] = payload['tipo']
            ExerciciosGuiados.model_validate(content)
            return content
        except (ValidationError, OutputParserException):
            continue
        except AiInvalidRequest as error:
            raise AiInvalidData(str(error)) from error
    raise AiInvalidData('A IA retornou dados inválidos')
