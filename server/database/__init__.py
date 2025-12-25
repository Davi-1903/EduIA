import os
from time import sleep
from dotenv import load_dotenv
from sqlalchemy import Engine, create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from sqlalchemy.exc import OperationalError


def get_connection(DATABASE_URI: str) -> Engine:
    for _ in range(10):
        try:
            engine = create_engine(DATABASE_URI, echo=False)
            engine.connect()
            return engine
        except OperationalError:
            sleep(3)
    raise RuntimeError('Não foi possível estabeler uma conexão com o banco de dados')


load_dotenv()

DATABASE_URI = os.getenv("DATABASE_URI")
if DATABASE_URI is None:
    raise RuntimeError("A variável de ambiente DATABASE_URI não foi definida")

engine = get_connection(DATABASE_URI)
SessionLocal = sessionmaker(bind=engine)


class Base(DeclarativeBase):
    pass


def init_database():
    Base.metadata.create_all(engine)