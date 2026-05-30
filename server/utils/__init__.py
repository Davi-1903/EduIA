from os import getenv
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError
from dotenv import load_dotenv


ph = PasswordHasher()


def get_env(key: str) -> str:
    load_dotenv()
    
    value = getenv(key)
    if value is None or value == '':
        raise RuntimeError(f'A variável de ambiente "{key}" não foi definida ou está vazia')
    return value


def create_hash(password: str) -> str:
    return ph.hash(password)


def verify_hash(hash: str, password: str) -> bool:
    try:
        return ph.verify(hash, password)
    except VerifyMismatchError:
        return False
