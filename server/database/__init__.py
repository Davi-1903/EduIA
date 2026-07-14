from sqlalchemy.orm import sessionmaker, DeclarativeBase
from utils import create_url, get_connection


engine = get_connection(url=create_url(), echo=False)
SessionLocal = sessionmaker(bind=engine)


class Base(DeclarativeBase):
    pass


def init_database():
    Base.metadata.create_all(engine)
