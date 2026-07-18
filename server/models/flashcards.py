from sqlalchemy import ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column
from models.material import Material, MaterialType


class FlashCards(Material):
    __tablename__ = 'flashcards'

    id: Mapped[int] = mapped_column(ForeignKey('materiais.id'), primary_key=True)
    amount: Mapped[int] = mapped_column(nullable=False)
    note: Mapped[str] = mapped_column(Text, nullable=False)

    __mapper_args__ = {'polymorphic_identity': MaterialType.FLASHCARD}
