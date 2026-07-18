from sqlalchemy import Text
from sqlalchemy.orm import Mapped, mapped_column
from models.material import Material
from database import Base


class FlashCards(Material, Base):
    __tablename__ = 'flashcards'

    amount: Mapped[int] = mapped_column(nullable=False)
    note: Mapped[str] = mapped_column(Text, nullable=False)
