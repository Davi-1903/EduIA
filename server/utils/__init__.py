from os import getenv
from time import sleep
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError
from dotenv import load_dotenv
from sqlalchemy import Engine, create_engine
from sqlalchemy.exc import OperationalError


__all__ = ['get_env', 'get_connection', 'create_hash', 'verify_hash']

load_dotenv()
ph = PasswordHasher()


def get_env(key: str) -> str:
    value = getenv(key)
    if value is None or value == '':
        raise RuntimeError(f'A variável de ambiente {key} não foi definida')
    return value


def get_connection(DATABASE_URI: str) -> Engine:
    for _ in range(10):
        try:
            engine = create_engine(DATABASE_URI, echo=False)
            engine.connect()
            print('A conexão com o banco de dados foi estabelecida')
            return engine
        except OperationalError:
            sleep(3)
    raise RuntimeError('Não foi possível estabeler uma conexão com o banco de dados')


def create_hash(password: str) -> str:
    return ph.hash(password)


def verify_hash(hash: str, password: str) -> bool:
    try:
        return ph.verify(hash, password)
    except VerifyMismatchError:
        return False
