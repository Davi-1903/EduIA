from typing import TYPE_CHECKING
from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from database import Base


if TYPE_CHECKING:
    from models.material import Material


class Historico(Base):
    __tablename__ = 'historico'

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    material_id = Mapped[int] = mapped_column(ForeignKey('materiais.id'), nullable=False)

    material: Mapped['Material'] = relationship(back_populates='historico', uselist=False)
