from pathlib import Path

from langchain_core.exceptions import OutputParserException
from loguru import logger

from ai.prompts import study_guide
from errors.ai import AiInvalidRequest, AiInvalidResponse, AiProviderUnavailable, AiServiceError, AiTimeout
from utils import setup_logger
from utils.ai import search_documentation
from utils.extensions import get_llm_ext, get_vector_store_ext


setup_logger(__name__, Path(__file__).resolve().parents[2] / 'logs' / 'ai-generation.log')


def generate_study_guide(payload: dict):
    logger.info('Iniciando geração do roteiro de estudo')
    try:
        llm = get_llm_ext()
        vector_store = get_vector_store_ext()
        documentation = search_documentation(vector_store, payload['assunto'], payload['disciplina'])
    except Exception as error:
        logger.error('Falha ao preparar geração do roteiro de estudo ({})', type(error).__name__)
        raise

    try:
        chain = study_guide.prompt_template | llm | study_guide.parser
        content = chain.invoke({**payload, 'documentacao': documentation})
        logger.info('Geração de roteiro de estudo concluída')
        return content

    except AiServiceError:
        logger.warning('Geração do roteiro de estudo interrompida por erro do serviço de IA')
        raise
    except OutputParserException as error:
        logger.warning('Geração do roteiro de estudo retornou resposta inválida')
        raise AiInvalidResponse('A IA retornou uma resposta inválida') from error
    except (KeyError, TypeError, ValueError) as error:
        logger.warning('Geração do roteiro de estudo recebeu dados inválidos')
        raise AiInvalidRequest('Dados inválidos para geração do roteiro de estudo') from error
    except TimeoutError as error:
        logger.warning('Geração do roteiro de estudo excedeu o tempo limite')
        raise AiTimeout('O serviço de IA demorou para responder') from error
    except (ConnectionError, OSError) as error:
        logger.warning('Provedor indisponível durante geração do roteiro de estudo')
        raise AiProviderUnavailable('O serviço de IA está indisponível') from error
    except Exception as error:
        logger.error('Falha inesperada durante geração do roteiro de estudo')
        raise AiProviderUnavailable('Não foi possível acessar o serviço de IA') from error
