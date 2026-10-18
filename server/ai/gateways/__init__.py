from langchain_core.exceptions import OutputParserException

from ai.prompts import flashcards, questoes, quiz
from errors.ai import (
    AiInvalidRequest,
    AiInvalidResponse,
    AiProviderUnavailable,
    AiServiceError,
    AiTimeout,
)
from utils.ai import search_documentation
from utils.extensions import get_llm_ext, get_vector_store_ext


def generate_questions(payload: dict):
    llm = get_llm_ext()
    vector_store = get_vector_store_ext()

    documentation = search_documentation(vector_store, payload['assunto'], payload['disciplina'])

    try:
        return llm.invoke(questoes.prompt_template.format(**{**payload, 'documentacao': documentation})).content

    except AiServiceError:
        raise
    except OutputParserException as error:
        raise AiInvalidResponse('A IA retornou uma resposta inválida') from error
    except (KeyError, TypeError, ValueError) as error:
        raise AiInvalidRequest('Dados inválidos para geração de questões') from error
    except TimeoutError as error:
        raise AiTimeout('O serviço de IA demorou para responder') from error
    except (ConnectionError, OSError) as error:
        raise AiProviderUnavailable('O serviço de IA está indisponível') from error
    except Exception as error:
        raise AiProviderUnavailable('Não foi possível acessar o serviço de IA') from error


def generate_quizzes(payload: dict):
    llm = get_llm_ext()
    vector_store = get_vector_store_ext()

    documentation = search_documentation(vector_store, payload['assunto'], payload['disciplina'])

    try:
        return llm.invoke(quiz.prompt_template.format(**{**payload, 'documentacao': documentation})).content

    except AiServiceError:
        raise
    except OutputParserException as error:
        raise AiInvalidResponse('A IA retornou uma resposta inválida') from error
    except (KeyError, TypeError, ValueError) as error:
        raise AiInvalidRequest('Dados inválidos para geração de questões') from error
    except TimeoutError as error:
        raise AiTimeout('O serviço de IA demorou para responder') from error
    except (ConnectionError, OSError) as error:
        raise AiProviderUnavailable('O serviço de IA está indisponível') from error
    except Exception as error:
        raise AiProviderUnavailable('Não foi possível acessar o serviço de IA') from error


def generate_flashcards(payload: dict):
    llm = get_llm_ext()
    vector_store = get_vector_store_ext()

    documentation = search_documentation(vector_store, payload['assunto'], payload['disciplina'])

    try:
        return llm.invoke(flashcards.prompt_template.format(**{**payload, 'documentacao': documentation})).content

    except AiServiceError:
        raise
    except OutputParserException as error:
        raise AiInvalidResponse('A IA retornou uma resposta inválida') from error
    except (KeyError, TypeError, ValueError) as error:
        raise AiInvalidRequest('Dados inválidos para geração de flashcards') from error
    except TimeoutError as error:
        raise AiTimeout('O serviço de IA demorou para responder') from error
    except (ConnectionError, OSError) as error:
        raise AiProviderUnavailable('O serviço de IA está indisponível') from error
    except Exception as error:
        raise AiProviderUnavailable('Não foi possível acessar o serviço de IA') from error
