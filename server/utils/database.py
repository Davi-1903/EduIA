from pathlib import Path
from time import sleep

from dotenv import load_dotenv
from loguru import logger
from sqlalchemy import Engine, create_engine
from sqlalchemy.exc import OperationalError

from . import get_env, setup_logger


load_dotenv()

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


def get_connection(**kargs) -> Engine:
    for attempt in range(10):
        try:
            engine = create_engine(**kargs)
            engine.connect()
            logger.info('Conexão com o banco de dados estabelecida')
            return engine
        except OperationalError as error:
            logger.warning('Tentativa {}/10 de conexão com o banco falhou: {}', attempt + 1, error)
            sleep(3)
    logger.error('Não foi possível estabelecer uma conexão com o banco de dados após 10 tentativas')
    raise RuntimeError('Não foi possível estabeler uma conexão com o banco de dados')
