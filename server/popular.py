import random
from argparse import ArgumentParser

from pwdlib import PasswordHash
from sqlalchemy.orm import Session

from database import SessionLocal, init_database
from models.aluno import Aluno
from models.desafios import Desafio
from models.exercicios_guiados import ExercicioGuiado
from models.explicacoes import Explicacao
from models.flashcards import FlashCards
from models.formularios import Formulario
from models.material import Difficulty, MaterialType
from models.planos_de_aula import PlanoDeAula
from models.professor import Professor
from models.questoes import Questoes
from models.quizzes import Quiz
from models.resumos import Resumo
from models.roteiros import Roteiro
from models.user import UserType, Usuario

ph = PasswordHash.recommended()
discipline = [
    'Língua Portuguesa e Literatura',
    'Inglês',
    'Espanhol/Francês',
    'Arte',
    'Educação Física',
    'Geografia',
    'História',
    'Filosofia',
    'Sociologia',
    'Matemática',
    'Física',
    'Química',
    'Biologia',
    'Informática',
    'Programação Orientada a Objetos',
    'Banco de Dados',
    'Redes de Computadores',
    'Engenharia de Software',
    'Desenho Técnico',
    'Eletrônica',
    'Mecânica',
    'Química Orgânica',
    'Geologia',
]
subjects = [
    'Citologia',
    'Eletromagnetismo',
    'Programação Orientada a Objetos',
    'Genética',
    'Ecologia',
    'Cinemática',
    'Reações Orgânicas',
    'Banco de Dados',
    'Redes de Computadores',
    'Lógica Matemática',
    'História do Brasil',
    'Geopolítica',
    'Estatística',
    'Mecânica dos Fluidos',
    'Microeconomia',
]


def add_users(session: Session):
    users = [
        Aluno(name='Fulano', email='fulano@fulano.com', password=ph.hash('1234')),
        Professor(name='Beltrano', email='beltrano@beltrano.com', password=ph.hash('1234')),
        Aluno(name='Sicrano', email='sicrano@sicrano.com', password=ph.hash('1234')),
    ]
    session.add_all(users)
    session.commit()
    return session.query(Usuario).all()


def get_random_user(session: Session, allowed_types=None):
    users = session.query(Usuario).all()
    if allowed_types:
        users = [user for user in users if user.type in allowed_types]
    return random.choice(users)


def get_random_discipline():
    return random.choice(discipline)


def get_random_subject():
    return random.choice(subjects)


def get_random_difficulty():
    return random.choice(list(Difficulty))


def build_content(title: str, description: str, difficulty=None):
    content = {'title': title, 'description': description}
    if difficulty is not None:
        content['difficulty'] = difficulty.value
    return content


def add_questoes(session: Session, amount: int = 3):
    for _ in range(amount):
        user = get_random_user(session)
        difficulty = get_random_difficulty()
        material = Questoes(
            user=user,
            discipline=get_random_discipline(),
            subject=get_random_subject(),
            content=build_content('Questões geradas', 'Conjunto de questões criado automaticamente', difficulty),
            type=MaterialType.QUESTOES,
            difficulty=difficulty,
            amount=random.randint(5, 15),
            note=f'Questões geradas automaticamente para {user.name}',
        )
        session.add(material)
    session.commit()


def add_quizzes(session: Session, amount: int = 3):
    for _ in range(amount):
        user = get_random_user(session)
        difficulty = get_random_difficulty()
        material = Quiz(
            user=user,
            discipline=get_random_discipline(),
            subject=get_random_subject(),
            content=build_content('Quiz gerado', 'Quiz criado automaticamente para revisão', difficulty),
            type=MaterialType.QUIZ,
            difficulty=difficulty,
            time_per_question=random.randint(20, 60),
            amount=random.randint(5, 10),
            note=f'Quiz automático para {user.name}',
        )
        session.add(material)
    session.commit()


def add_desafios(session: Session, amount: int = 3):
    for _ in range(amount):
        user = get_random_user(session)
        difficulty = get_random_difficulty()
        material = Desafio(
            user=user,
            discipline=get_random_discipline(),
            subject=get_random_subject(),
            content=build_content('Desafio gerado', 'Desafio automático para prática', difficulty),
            type=MaterialType.DESAFIO,
            note=f'Desafio proposto para {user.name}',
        )
        session.add(material)
    session.commit()


def add_flashcards(session: Session, amount: int = 3):
    for _ in range(amount):
        user = get_random_user(session, [UserType.ALUNO])
        difficulty = get_random_difficulty()
        material = FlashCards(
            user=user,
            discipline=get_random_discipline(),
            subject=get_random_subject(),
            content=build_content('Flashcards gerados', 'Flashcards automáticos para estudo', difficulty),
            difficulty=Difficulty(difficulty),
            type=MaterialType.FLASHCARD,
            amount=random.randint(8, 20),
            note=f'Flashcards para {user.name}',
        )
        session.add(material)
    session.commit()


def add_formularios(session: Session, amount: int = 3):
    for _ in range(amount):
        user = get_random_user(session, [UserType.PROFESSOR])
        difficulty = get_random_difficulty()
        material = Formulario(
            user=user,
            discipline=get_random_discipline(),
            subject=get_random_subject(),
            content=build_content('Formulário gerado', 'Formulário automático para avaliação', difficulty),
            type=MaterialType.FORMULARIO,
            difficulty=difficulty,
            amount=random.randint(5, 15),
            note=f'Formulário criado pelo professor {user.name}',
        )
        session.add(material)
    session.commit()


def add_planos_de_aula(session: Session, amount: int = 3):
    for _ in range(amount):
        user = get_random_user(session, [UserType.PROFESSOR])
        difficulty = get_random_difficulty()
        material = PlanoDeAula(
            user=user,
            discipline=get_random_discipline(),
            subject=get_random_subject(),
            content=build_content('Plano de aula gerado', 'Plano de aula automático para o professor', difficulty),
            type=MaterialType.PLANO_DE_AULA,
            grade=random.choice(['6º ano', '7º ano', '8º ano', '9º ano', '1º ano', '2º ano', '3º ano']),
            objective='Objetivo pedagógico gerado automaticamente',
            duration=random.randint(10, 60),
            chalkboard=True,
            projector=random.choice([True, False]),
            printed=random.choice([True, False]),
            digital=random.choice([True, False]),
        )
        session.add(material)
    session.commit()


def add_explicacoes(session: Session, amount: int = 3):
    for _ in range(amount):
        user = get_random_user(session)
        difficulty = get_random_difficulty()
        material = Explicacao(
            user=user,
            discipline=get_random_discipline(),
            subject=get_random_subject(),
            content=build_content('Explicação gerada', 'Explicação automática para reforço', difficulty),
            type=MaterialType.EXPLICACAO,
            questions='Perguntas-chave geradas automaticamente',
        )
        session.add(material)
    session.commit()


def add_resumos(session: Session, amount: int = 3):
    for _ in range(amount):
        user = get_random_user(session)
        difficulty = get_random_difficulty()
        material = Resumo(
            user=user,
            discipline=get_random_discipline(),
            subject=get_random_subject(),
            content=build_content('Resumo gerado', 'Resumo automático para revisão rápida', difficulty),
            type=MaterialType.RESUMO,
            note=f'Resumo criado para {user.name}',
        )
        session.add(material)
    session.commit()


def add_roteiros(session: Session, amount: int = 3):
    for _ in range(amount):
        user = get_random_user(session, [UserType.ALUNO])
        difficulty = get_random_difficulty()
        material = Roteiro(
            user=user,
            discipline=get_random_discipline(),
            subject=get_random_subject(),
            content=build_content('Roteiro de estudo', 'Roteiro automático para estudo', difficulty),
            type=MaterialType.ROTEIRO,
        )
        session.add(material)
    session.commit()


def add_exercicios_guiados(session: Session, amount: int = 3):
    for _ in range(amount):
        user = get_random_user(session)
        difficulty = get_random_difficulty()
        material = ExercicioGuiado(
            user=user,
            discipline=get_random_discipline(),
            subject=get_random_subject(),
            content=build_content('Exercício guiado', 'Exercício guiado gerado automaticamente', difficulty),
            type=MaterialType.EXERCICIO_GUIADO,
            difficulty=difficulty,
            amount=random.randint(5, 50),
            resolution=random.choice([True, False]),
            theory=random.choice([True, False]),
            multiple_choice=random.choice([True, False]),
            true_or_false=random.choice([True, False]),
            discursive=random.choice([True, False]),
            interpretation=random.choice([True, False]),
            code=random.choice([True, False]),
            note=f'Exercício guiado para {user.name}',
        )
        session.add(material)
    session.commit()


def main():
    parser = ArgumentParser(prog='Popular sistema EduIA')
    parser.add_argument('quantidade', type=int, help='Quantidade gerada por material')
    args = parser.parse_args()

    init_database()
    with SessionLocal() as session:
        add_users(session)
        add_questoes(session, args.quantidade)
        add_quizzes(session, args.quantidade)
        add_desafios(session, args.quantidade)
        add_flashcards(session, args.quantidade)
        add_formularios(session, args.quantidade)
        add_planos_de_aula(session, args.quantidade)
        add_explicacoes(session, args.quantidade)
        add_resumos(session, args.quantidade)
        add_roteiros(session, args.quantidade)
        add_exercicios_guiados(session, args.quantidade)

    print('Dados populados com sucesso!')


if __name__ == '__main__':
    main()
