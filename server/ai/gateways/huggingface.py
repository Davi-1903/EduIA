from ai import get_chain
from ai.prompts import questoes, quiz
from langchain_core.exceptions import OutputParserException

from errors.ai import (
    AiInvalidRequest,
    AiInvalidResponse,
    AiProviderUnavailable,
    AiServiceError,
    AiTimeout,
)


def generate_questions(payload: dict):
    try:
        chain = get_chain(questoes.prompt_template, questoes.parser)
        return chain.invoke(payload)

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
    try:
        chain = get_chain(quiz.prompt_template, quiz.parser)
        return chain.invoke(payload)

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
