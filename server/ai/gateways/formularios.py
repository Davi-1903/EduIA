from pathlib import Path

from langchain_core.exceptions import OutputParserException
from loguru import logger

from ai.prompts import formularios
from errors.ai import AiInvalidRequest, AiInvalidResponse, AiProviderUnavailable, AiServiceError, AiTimeout
from utils import setup_logger
from utils.ai import search_documentation
from utils.extensions import get_llm_ext, get_vector_store_ext


setup_logger(__name__, Path(__file__).resolve().parents[2] / 'logs' / 'ai-generation.log')


def generate_formularios(payload: dict):
    logger.info('Iniciando geração de formulários')
    try:
        llm = get_llm_ext()
        vector_store = get_vector_store_ext()
        documentation = search_documentation(vector_store, payload['assunto'], payload['disciplina'])
    except Exception as error:
        logger.error('Falha ao preparar geração de formulários ({})', type(error).__name__)
        raise

    try:
        chain = formularios.generate_prompt_template | llm | formularios.generate_parser
        content = chain.invoke({**payload, 'documentacao': documentation})
        logger.info('Geração de formulários concluída')
        return content

    except AiServiceError:
        logger.warning('Geração de formulários interrompida por erro do serviço de IA')
        raise
    except OutputParserException as error:
        logger.warning('Geração de formulários retornou resposta inválida')
        raise AiInvalidResponse('A IA retornou uma resposta inválida') from error
    except (KeyError, TypeError, ValueError) as error:
        logger.warning('Geração de formulários recebeu dados inválidos')
        raise AiInvalidRequest('Dados inválidos para geração de formularios') from error
    except TimeoutError as error:
        logger.warning('Geração de formulários excedeu o tempo limite')
        raise AiTimeout('O serviço de IA demorou para responder') from error
    except (ConnectionError, OSError) as error:
        logger.warning('Provedor indisponível durante geração de formulários')
        raise AiProviderUnavailable('O serviço de IA está indisponível') from error
    except Exception as error:
        logger.error('Falha inesperada durante geração de formulários')
        raise AiProviderUnavailable('Não foi possível acessar o serviço de IA') from error


def evaluate_answers(payload: dict):
    logger.info('Iniciando a análise das respostas')
    llm = get_llm_ext()

    try:
        chain = formularios.correction_prompt_template | llm | formularios.correction_parser
        content = chain.invoke(payload)
        return content

    except OutputParserException as error:
        logger.warning('Análise das respostas do usuário retornou um resposta inválida')
        raise AiInvalidResponse('A IA retornou uma resposta inválida') from error
    except (KeyError, TypeError, ValueError) as error:
        logger.warning('Análise das respostas do formulário recebeu dados inválidos')
        raise AiInvalidRequest('Dados inválidos para geração de formularios') from error
    except TimeoutError as error:
        logger.warning('Análise das respostas do formulário excedeu o tempo limite')
        raise AiTimeout('O serviço de IA demorou para responder') from error
    except (ConnectionError, OSError) as error:
        logger.warning('Provedor indisponível durante análise das respostas do formulário')
        raise AiProviderUnavailable('O serviço de IA está indisponível') from error
    except Exception as error:
        logger.error('Falha inesperada durante a análise das respostas do formulário')
        raise AiProviderUnavailable('Não foi possível acessar o serviço de IA') from error
