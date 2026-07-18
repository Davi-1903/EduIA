from models.material import Material
from database import Base


class Roteiro(Material, Base):
    __tablename__ = 'roteiros_de_estudo'
