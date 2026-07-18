from sqlalchemy import Text
from sqlalchemy.orm import Mapped, mapped_column
from models.material import Material
from database import Base


class Explicacao(Material, Base):
    __tablename__ = 'explicacoes'

    questions: Mapped[str] = mapped_column(Text, nullable=False)
