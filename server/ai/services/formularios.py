import json

from langchain_core.exceptions import OutputParserException
from pydantic import ValidationError

from errors.ai import AiInvalidData, AiInvalidRequest
from schemas.formularios import Answers, Formularios

from ..gateways.formularios import evaluate_answers as evaluate_answers_gateway
from ..gateways.formularios import generate_formularios as generate_formularios_gateway

def generate_formularios(data: dict):
    try:
        payload = {
            'disciplina': data['discipline'],
            'quantidade': data['amount'],
            'dificuldade': data['difficulty'],
            'assunto': data['subject'],
            'observacoes': data.get('note') or 'Não há observações',
        }
    except (KeyError, TypeError) as error:
        raise AiInvalidData('Dados inválidos para geração de formulários') from error

    try:
        content = generate_formularios_gateway(payload)
        Formularios.model_validate(content)
        return content
    except (ValidationError, OutputParserException) as error:
        raise AiInvalidData('A IA retornou dados inválidos') from error
    except AiInvalidRequest as error:
        raise AiInvalidData(str(error)) from error


def correct_formularios(data: dict):
    try:
        respostas_usuario = {}
        for item in data['answers']:
            id_pergunta = item['id']
            resposta = item.get('answer')

            if resposta is None:
                resposta = ''

            respostas_usuario[id_pergunta] = resposta

        respostas = []
        for question in data['content']['content']:
            id_pergunta = question['id']

            if id_pergunta in respostas_usuario:
                resposta_dada = respostas_usuario[id_pergunta]
            else:
                resposta_dada = ''

            respostas.append(
                {
                    'id': id_pergunta,
                    'question': question['question'],
                    'expectedAnswer': question['expectedAnswer'],
                    'answer': resposta_dada,
                }
            )

        payload = {
            'disciplina': data['discipline'],
            'respostas': json.dumps(respostas, ensure_ascii=False),
        }
    except (KeyError, TypeError) as error:
        raise AiInvalidData('Dados inválidos para correção de formulários') from error

    try:
        content = evaluate_answers_gateway(payload)
        Answers.model_validate(content)
        return content
    except (ValidationError, OutputParserException) as error:
        raise AiInvalidData('A IA retornou dados inválidos') from error
    except AiInvalidRequest as error:
        raise AiInvalidData(str(error)) from error