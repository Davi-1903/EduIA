from pathlib import Path
from time import sleep

from dotenv import load_dotenv
from loguru import logger
from sqlalchemy import Engine, create_engine
from sqlalchemy.exc import OperationalError

from . import get_env, setup_logger


load_dotenv(override=True)
setup_logger(__name__, Path(__file__).resolve().parents[1] / 'logs' / 'database.log')


def create_url() -> str:
    user = get_env('DB_USER')
    password = get_env('DB_PASSWORD', '')
    host = get_env('DB_HOST')
    port = get_env('DB_PORT')
    name = get_env('DB_NAME')

    if password == '':
        return f'mysql+pymysql://{user}@{host}:{port}/{name}'
    return f'mysql+pymysql://{user}:{password}@{host}:{port}/{name}'


def get_connection(**kwargs) -> Engine:
    try:
        engine = create_engine(**kwargs)

        with engine.connect() as connection:
            logger.info('Conexão com o banco estabelecida')

        return engine

    except Exception as error:
        print(f'\nERRO ORIGINAL: {type(error).__name__}: {error}\n')
        raise