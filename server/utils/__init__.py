from os import getenv
from time import sleep
from dotenv import load_dotenv
from sqlalchemy import Engine, create_engine
from sqlalchemy.exc import OperationalError


def get_env(key: str) -> str:
    load_dotenv()

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