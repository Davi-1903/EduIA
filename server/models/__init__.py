from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, sessionmaker

# engine = create_engine('sqlite:///banco.db')
# sessao = sessionmaker(bind=engine)

class Base(DeclarativeBase):
    pass