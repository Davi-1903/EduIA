from flask_login import UserMixin
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, sessionmaker
from sqlalchemy import String, create_engine

# engine = create_engine('sqlite:///banco.db')
# sessao = sessionmaker(bind=engine)

class Base(DeclarativeBase):
    pass

class User(Base, UserMixin):
    __tablename__ = 'users'

    id:Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    user_name:Mapped[str] = mapped_column(String(30), unique=True, nullable=False)
    full_name:Mapped[str] = mapped_column(nullable=False)
    email:Mapped[str] = mapped_column(unique=True, nullable=False)
    password:Mapped[str] = mapped_column(nullable=False)

    def get_id(self):
        return str(self.id)

# Base.metadata.create_all(engine)