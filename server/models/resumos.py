from sqlalchemy import Text
from sqlalchemy.orm import Mapped, mapped_column
from models.material import Material
from database import Base


class Resumo(Material, Base):
    __tablename__ = 'resumos'

    note: Mapped[str] = mapped_column(Text, nullable=False)
