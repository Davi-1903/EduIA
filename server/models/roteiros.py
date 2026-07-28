from sqlalchemy import ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column
from models.material import Material, MaterialType


class Roteiro(Material):
    __tablename__ = 'roteiros_de_estudo'

    id: Mapped[int] = mapped_column(ForeignKey('materiais.id'), primary_key=True)
    note: Mapped[str] = mapped_column(Text, nullable=True)

    __mapper_args__ = {'polymorphic_identity': MaterialType.ROTEIRO}
