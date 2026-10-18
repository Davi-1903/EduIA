from utils.ai import get_llm, get_vector_store

from . import gateways, prompts, services


__all__ = ['gateways', 'prompts', 'services']


llm = get_llm()
_, vector_store = get_vector_store()
