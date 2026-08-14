from sqlalchemy import Enum, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column
from models.material import Difficulty, Material, MaterialType


class Desafio(Material):
    __tablename__ = 'desafios'

    id: Mapped[int] = mapped_column(ForeignKey('materiais.id'), primary_key=True)
    note: Mapped[str] = mapped_column(Text, nullable=True)
    difficulty: Mapped[Difficulty] = mapped_column(Enum(Difficulty), nullable=True)

    __mapper_args__ = {'polymorphic_identity': MaterialType.DESAFIO}
