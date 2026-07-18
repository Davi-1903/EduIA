from sqlalchemy import Text
from sqlalchemy.orm import Mapped, mapped_column
from models.material import Material
from database import Base


class Desafio(Material, Base):
    __tablename__ = 'desafios'

    note: Mapped[str] = mapped_column(Text, nullable=False)
