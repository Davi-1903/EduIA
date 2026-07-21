from sqlalchemy import ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column
from models.material import Material, MaterialType


class Explicacao(Material):
    __tablename__ = 'explicacoes'

    id: Mapped[int] = mapped_column(ForeignKey('materiais.id'), primary_key=True)
    questions: Mapped[str] = mapped_column(Text, nullable=False)

    __mapper_args__ = {'polymorphic_identity': MaterialType.EXPLICACAO}
