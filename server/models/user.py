from flask_login import UserMixin
from sqlalchemy import Column, Integer, String, ForeignKey
from database import Base


class User(Base, UserMixin):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    password = Column(String(200), nullable=False)
    type = Column(String(50))

    __mapper_args__ = {
        'polymorphic_identity': 'user',
        'polymorphic_on': type
    }

    def get_id(self):
        return str(self.id)


class Professor(User):
    __tablename__ = 'professores'

    id = Column(Integer, ForeignKey('users.id'), primary_key=True)
    # por enquanto, os campos abaixo vão poder aceitar valores nulos pois ainda não temos páginas para o usuário indicar esses dados
    materia = Column(String(100), nullable=True)
    turma = Column(String(100), nullable=True)

    __mapper_args__ = {
        'polymorphic_identity': 'professor'
    }


class Aluno(User):
    __tablename__ = 'alunos'

    id = Column(Integer, ForeignKey('users.id'), primary_key=True)
    # por enquanto, o campo abaixo vai poder aceitar valores nulos pois ainda não temos páginas para o usuário indicar esses dados
    turma = Column(String(100), nullable=True)

    __mapper_args__ = {
        'polymorphic_identity': 'aluno'
    }
