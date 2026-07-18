from sqlalchemy import ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column
from models.material import Material, MaterialType


class PlanoDeAula(Material):
    __tablename__ = 'planos_de_aula'

    id: Mapped[int] = mapped_column(ForeignKey('materiais.id'), primary_key=True)
    grade: Mapped[str] = mapped_column(String(50), nullable=False)
    objective: Mapped[str] = mapped_column(Text, nullable=False)
    duration: Mapped[int] = mapped_column(nullable=False)
    chalkboard: Mapped[bool] = mapped_column(nullable=False)
    projector: Mapped[bool] = mapped_column(nullable=False)
    printed: Mapped[bool] = mapped_column(nullable=False)
    digital: Mapped[bool] = mapped_column(nullable=False)

    __mapper_args__ = {'polymorphic_identity': MaterialType.PLANO_DE_AULA}
