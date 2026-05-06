from os import getenv
from dotenv import load_dotenv


def get_env(key: str) -> str:
    load_dotenv()
    
    value = getenv(key)
    if value is None or value == '':
        raise RuntimeError(f'A variável de ambiente "{key}" não foi definida ou está vazia')
    return value
