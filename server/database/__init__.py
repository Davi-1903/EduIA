from sqlalchemy.orm import sessionmaker, DeclarativeBase
from utils import create_url, get_connection


engine = get_connection(url=create_url(), echo=False, connect_args={'init_command': "SET time_zone='+00:00'"})
SessionLocal = sessionmaker(bind=engine)


class Base(DeclarativeBase):
    pass


def init_database():
    Base.metadata.create_all(engine)
