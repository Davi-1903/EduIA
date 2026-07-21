from sqlalchemy import Enum, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column
from models.material import Difficulty, Material, MaterialType


class Formulario(Material):
    __tablename__ = 'formularios'

    id: Mapped[int] = mapped_column(ForeignKey('materiais.id'), primary_key=True)
    difficulty: Mapped[Difficulty] = mapped_column(Enum(Difficulty), nullable=False)
    amount: Mapped[int] = mapped_column(nullable=False)
    note: Mapped[str] = mapped_column(Text, nullable=False)

    __mapper_args__ = {'polymorphic_identity': MaterialType.FORMULARIO}
