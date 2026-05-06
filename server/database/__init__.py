from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from utils import get_env

#esse arquivo aqui é para criar uma "conexão" entre o .env que guarda dados sensiveis e o database.py, que vai precisar de algumas coisas do .env. O __init__.py não foi utilizado para essa função porque ele ficaria muito grande e poderia gerar confusão com import circular

DATABASE_URI = get_env('DATABASE_URI')

engine = create_engine(DATABASE_URI, echo=False)
SessionLocal = sessionmaker(bind=engine)


class Base(DeclarativeBase):
    pass


def init_database():
    Base.metadata.create_all(engine)