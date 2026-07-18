from sqlalchemy import Enum, Text
from sqlalchemy.orm import Mapped, mapped_column
from models.material import Difficulty, Material
from database import Base


class Formulario(Material, Base):
    __tablename__ = 'formularios'

    difficulty: Mapped[Difficulty] = mapped_column(Enum(Difficulty), nullable=False)
    amount: Mapped[int] = mapped_column(nullable=False)
    note: Mapped[str] = mapped_column(Text, nullable=False)
