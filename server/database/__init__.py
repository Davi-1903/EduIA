from sqlalchemy.orm import sessionmaker, DeclarativeBase
from utils import get_connection, get_env


__all__ = ['engine', 'SessionLocal', 'Base', 'init_database']


engine = get_connection(get_env('DATABASE_URI'))
SessionLocal = sessionmaker(bind=engine)


class Base(DeclarativeBase):
    pass


def init_database():
    Base.metadata.create_all(engine)
