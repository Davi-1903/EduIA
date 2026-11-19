from langchain_core.exceptions import OutputParserException
from pydantic import ValidationError

from errors.ai import AiInvalidData, AiInvalidRequest
from schemas.plano_de_aula import PlanoDeAula

from ..gateways import generate_plano_de_aula as generate_plano_de_aula_gateway


def generate_plano_de_aula(data: dict):
    try:
        recursos = [
            nome
            for chave, nome in (
                ('chalkboard', 'lousa'),
                ('projector', 'projetor'),
                ('printed', 'material impresso'),
                ('digital', 'recursos digitais'),
            )
            if data.get(chave)
        ]

        payload = {
            'disciplina': data['discipline'],
            'serie': data['grade'],
            'assunto': data['subject'],
            'objetivo': data['objective'],
            'duracao': data['duration'],
            'recursos': ', '.join(recursos) or 'Nenhum recurso informado',
            'observacoes': data.get('note') or 'Não há observações',
        }
    except (KeyError, TypeError) as error:
        raise AiInvalidData('Dados inválidos para geração do plano de aula') from error

    try:
        content = generate_plano_de_aula_gateway(payload)
        PlanoDeAula.model_validate(content)
        return content
    except (ValidationError, OutputParserException) as error:
        raise AiInvalidData('A IA retornou dados inválidos') from error
    except AiInvalidRequest as error:
        raise AiInvalidData(str(error)) from error