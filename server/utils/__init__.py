from os import getenv
from dotenv import load_dotenv


load_dotenv()


def get_env(key: str, default: str | None = None) -> str:
    value = getenv(key)
    if value is not None and value != '':
        return value
    if default is not None:
        return default
    raise RuntimeError(f'A variável de ambiente "{key}" não foi definida ou está vazia')
