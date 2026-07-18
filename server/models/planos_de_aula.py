from sqlalchemy import String, Text
from sqlalchemy.orm import Mapped, mapped_column
from models.material import Material
from database import Base


class PlanoDeAula(Material, Base):
    __tablename__ = 'planos_de_aula'

    grade: Mapped[str] = mapped_column(String(50), nullable=False)
    objective: Mapped[str] = mapped_column(Text, nullable=False)
    duration: Mapped[int] = mapped_column(nullable=False)
    chalkboard: Mapped[bool] = mapped_column(nullable=False)
    projector: Mapped[bool] = mapped_column(nullable=False)
    printed: Mapped[bool] = mapped_column(nullable=False)
    digital: Mapped[bool] = mapped_column(nullable=False)
