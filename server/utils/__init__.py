from os import getenv
from time import sleep
from dotenv import load_dotenv
from sqlalchemy import Engine, create_engine
from sqlalchemy.exc import OperationalError


load_dotenv()


def get_env(key: str, default: str | None = None) -> str:
    value = getenv(key)
    if value is not None and value != '':
        return value
    if default is not None:
        return default
    raise RuntimeError(f'A variável de ambiente {key} não foi definida')


def create_url() -> str:
    user = get_env('DB_USER')
    password = get_env('DB_PASSWORD', '')
    host = get_env('DB_HOST')
    port = get_env('DB_PORT')
    name = get_env('DB_NAME')

    if password == '':
        return f'mysql+pymysql://{user}@{host}:{port}/{name}'
    return f'mysql+pymysql://{user}:{password}@{host}:{port}/{name}'


def get_connection(**kargs) -> Engine:
    for _ in range(10):
        try:
            engine = create_engine(**kargs)
            engine.connect()
            print('A conexão com o banco de dados foi estabelecida')
            return engine
        except OperationalError:
            sleep(3)
    raise RuntimeError('Não foi possível estabeler uma conexão com o banco de dados')
