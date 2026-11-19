from langchain_core.exceptions import OutputParserException
from pydantic import ValidationError

from errors.ai import AiInvalidData, AiInvalidRequest
from schemas.study_guide import StudyGuide

from ..gateways import generate_study_guide as generate_study_guide_gateway


def generate_study_guide(data: dict):
    try:
        payload = {
            'disciplina': data['discipline'],
            'assunto': data['subject'],
            'observacoes': data.get('note') or 'Não há observações',
        }
    except (KeyError, TypeError) as error:
        raise AiInvalidData('Dados inválidos para geração do roteiro de estudo') from error

    try:
        content = generate_study_guide_gateway(payload)
        StudyGuide.model_validate(content)
        if '## Dicas de estudo' not in content['content']:
            raise AiInvalidData('A IA retornou um roteiro incompleto')
        return content
    except (ValidationError, OutputParserException) as error:
        raise AiInvalidData('A IA retornou dados inválidos') from error
    except AiInvalidRequest as error:
        raise AiInvalidData(str(error)) from error