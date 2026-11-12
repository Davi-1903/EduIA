from langchain_core.exceptions import OutputParserException
from pydantic import ValidationError

from errors.ai import AiInvalidData, AiInvalidRequest
from schemas.explicacoes import ExplicacoesJSON

from ..gateways import generate_explicacoes as generate_explicacoes_gateway

def generate_explicacoes(data: dict):
    try:
        payload = {
            'disciplina': data['discipline'],
            'assunto': data['subject'],
            'duvidas': data.get('questions') or 'Nenhuma dúvida específica informada.',
        }
    except (KeyError, TypeError) as error:
        raise AiInvalidData(
            'Dados inválidos para geração de explicações'
        ) from error

    try:
        content = generate_explicacoes_gateway(payload)
        ExplicacoesJSON.model_validate(content)
        return content

    except (ValidationError, OutputParserException) as error:
        raise AiInvalidData(
            'A IA retornou dados inválidos'
        ) from error

    except AiInvalidRequest as error:
        raise AiInvalidData(str(error)) from error