from os import getenv
from pathlib import Path

from loguru import logger


try:
    logger.remove(0)
except ValueError:
    pass


def get_env(key: str, default: str | None = None) -> str:
    value = getenv(key)
    if value is not None and value != '':
        return value
    if default is not None:
        return default
    raise RuntimeError(f'A variável de ambiente {key} não foi definida')


def setup_logger(name: str, filepath: str | Path, rotation: str = '1 MB') -> int:
    log_path = Path(filepath)
    log_path.parent.mkdir(parents=True, exist_ok=True)

    return logger.add(
        log_path,
        format='{level:<8} | {time:DD/MM/YYYY HH:mm} | {name} - {message}',
        rotation=rotation,
        filter=lambda record, _name=name: record['name'] == _name,
    )
