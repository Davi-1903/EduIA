from typing import TYPE_CHECKING, Any

from sqlalchemy import JSON, ForeignKey
from sqlalchemy.ext.mutable import MutableDict
from sqlalchemy.orm import Mapped, mapped_column, relationship

from database import Base


if TYPE_CHECKING:
    from models.material import Material


class Historico(Base):
    __tablename__ = 'historico'

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    material_id: Mapped[int] = mapped_column(ForeignKey('materiais.id'), unique=True, nullable=False)
    answer: Mapped[dict[str, Any] | None] = mapped_column(MutableDict.as_mutable(JSON), nullable=True)

    material: Mapped['Material'] = relationship(back_populates='historico')
