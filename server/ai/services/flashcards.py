from langchain_core.exceptions import OutputParserException
from pydantic import ValidationError

from errors.ai import AiInvalidData, AiInvalidRequest
from schemas.flashcards import Flashcards

from ..gateways.flashcards import generate_flashcards as generate_flashcards_gateway


def generate_flashcards(data: dict):
    try:
        payload = {
            'disciplina': data['discipline'],
            'quantidade': data['amount'],
            'dificuldade': data['difficulty'],
            'assunto': data['subject'],
        }
    except (KeyError, TypeError) as error:
        raise AiInvalidData('Dados inválidos para geração de flashcards') from error

    for _ in range(3):
        try:
            content = generate_flashcards_gateway(payload)
            Flashcards.model_validate(content)
            return content
        except (ValidationError, OutputParserException):
            continue
        except AiInvalidRequest as error:
            raise AiInvalidData(str(error)) from error
    raise AiInvalidData('A IA retornou dados inválidos')
