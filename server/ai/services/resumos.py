from langchain_core.exceptions import OutputParserException
from pydantic import ValidationError

from errors.ai import AiInvalidData, AiInvalidRequest
from schemas.resumos import Resumos

from ..gateways import generate_resumos as generate_resumos_gateway


def generate_resumos(data: dict):
    try:
        payload = {
            'disciplina': data['discipline'],
            'assunto': data['subject'],
            'observacoes': data.get('note') or 'Não há observações',
        }
    except (KeyError, TypeError) as error:
        raise AiInvalidData('Dados inválidos para geração de questões') from error

    try:
        content = generate_resumos_gateway(payload)
        Resumos.model_validate(content)
        return content
    except (ValidationError, OutputParserException) as error:
        raise AiInvalidData('A IA retornou dados inválidos') from error
    except AiInvalidRequest as error:
        raise AiInvalidData(str(error)) from error
