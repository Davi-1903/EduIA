from langchain_core.exceptions import OutputParserException
from pydantic import ValidationError

from errors.ai import AiInvalidData, AiInvalidRequest
from schemas.desafios import Desafio

from ..gateways.desafio import generate_desafio as generate_desafio_gateway


def generate_desafios(data: dict):
    try:
        payload = {
            'disciplina': data['discipline'],
            'assunto': data['subject'],
            'observacoes': data.get('note') or 'Não há observações',
        }
    except (KeyError, TypeError) as error:
        raise AiInvalidData('Dados inválidos para geração de desafios') from error

    try:
        content = generate_desafio_gateway(payload)
        Desafio.model_validate(content)
        return content
    except (ValidationError, OutputParserException) as error:
        raise AiInvalidData('A IA retornou dados inválidos') from error
    except AiInvalidRequest as error:
        raise AiInvalidData(str(error)) from error
