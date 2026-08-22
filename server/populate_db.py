"""Popula o banco com usuários e materiais de desenvolvimento."""

import random

from pwdlib import PasswordHash
from sqlalchemy import select

from database import Base, SessionLocal, engine
from models.aluno import Aluno
from models.desafios import Desafio
from models.exercicios_guiados import ExercicioGuiado
from models.explicacoes import Explicacao
from models.flashcards import FlashCards
from models.formularios import Formulario
from models.historico import Historico
from models.material import Difficulty, Material
from models.planos_de_aula import PlanoDeAula
from models.professor import Professor
from models.questoes import Questoes
from models.quizzes import Quiz
from models.resumos import Resumo
from models.roteiros import Roteiro
from models.user import Usuario


PASSWORD = '1234'
password_hash = PasswordHash.recommended()

CATALOGO = {
    'Disciplinas Comuns': [
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
    ],
    'Informática para Internet': [
        'Fundamentos de Lógica e Algoritmo',
        'Análise e Projeto Orientados a Objeto',
        'Design Web e Arquitetura da Informação',
        'Programação Estruturada e Orientada a Objetos',
        'Banco de Dados',
        'Programação de Sistemas para Internet',
        'Projeto de Interface do Usuário',
        'Programação Orientada a Serviços',
    ],
    'Eletrotécnica': [
        'Segurança do Trabalho',
        'Desenho Técnico',
        'Eletricidade Básica',
        'Circuitos Elétricos',
        'Medidas Elétricas',
        'Eletrônica Digital',
        'Eletrônica Analógica',
        'Instalações Elétricas de Baixa Tensão',
        'Máquinas e Acionamentos Elétricos',
        'Manutenção Elétrica Industrial',
    ],
    'Têxtil': [
        'Introdução à Tecnologia Têxtil',
        'Tecnologia das Fibras Têxteil',
        'Tecnologia da Fiação',
        'Desenvolvimento de Padronagens',
        'Tecnologia da Tecelagem',
        'Introdução à Colorimetria',
        'Controle de Qualidade na Indústria Têxtil',
        'Planejamento e Controle da Produção',
        'Tecnologia e Meio Ambiente',
    ],
    'Vestuário': [
        'Matemática Básica',
        'História da Indumentária',
        'Introdução à Tecnologia da Costura',
        'Tecnologia da Modelagem I',
        'Tecnologia da Modelagem II',
        'Planejamento e Criação de Coleção',
        'Marketing e Moda',
        'Lavanderia Industrial',
        'Laboratório de CAD Aplicado ao Vestuário',
        'Normas Técnicas e Controle de Qualidade na Confecção do Vestuário',
    ],
}

USUARIOS_PADRAO = (
    (Aluno, 'Fulano', 'fulano@eduia.local'),
    (Professor, 'Beltrano', 'beltrano@eduia.local'),
    (Aluno, 'Sicrano', 'sicrano@eduia.local'),
)


def solicitar_quantidade() -> int:
    while True:
        try:
            quantidade = int(input('Quantidade de materiais por usuário [5]: ') or '5')
        except ValueError:
            print('Informe um número inteiro não negativo.')
            continue

        if quantidade >= 0:
            return quantidade

        print('Informe um número inteiro não negativo.')


def obter_ou_criar_usuario(session, model, nome: str, email: str) -> Usuario:
    usuario = session.scalar(select(Usuario).where(Usuario.email == email))
    if usuario is not None:
        if not isinstance(usuario, model):
            raise ValueError(f'O e-mail {email} já pertence a um usuário de outro tipo.')
        usuario.name = nome
        usuario.password = password_hash.hash(PASSWORD)
        return usuario

    usuario = model(name=nome, email=email, password=password_hash.hash(PASSWORD))
    session.add(usuario)
    session.flush()
    return usuario


def criar_material(usuario: Usuario, indice: int) -> Material:
    grupo = random.choice(list(CATALOGO))
    disciplina = random.choice(CATALOGO[grupo])
    assunto = f'{disciplina}: conceitos e aplicações'
    conteudo = {
        'titulo': assunto,
        'resumo': f'Material de desenvolvimento sobre {disciplina}, com foco em fundamentos e aplicações práticas.',
        'pontos_chave': [
            f'Conceitos fundamentais de {disciplina}',
            'Exemplos relacionados ao curso técnico',
            'Aplicações no cotidiano e no mercado de trabalho',
        ],
        'ordem': indice + 1,
    }
    material_type = random.choice(
        [
            Desafio,
            ExercicioGuiado,
            Explicacao,
            FlashCards,
            Formulario,
            PlanoDeAula,
            Questoes,
            Quiz,
            Resumo,
            Roteiro,
        ]
    )
    campos_comuns = {
        'user_id': usuario.id,
        'discipline': disciplina,
        'subject': assunto,
        'content': conteudo,
    }

    if material_type is Desafio:
        return Desafio(**campos_comuns, difficulty=random.choice(list(Difficulty)))
    if material_type is ExercicioGuiado:
        return ExercicioGuiado(
            **campos_comuns,
            difficulty=random.choice(list(Difficulty)),
            amount=5,
            resolution=True,
            theory=True,
            multiple_choice=True,
            true_or_false=False,
            discursive=True,
            interpretation=True,
            code=disciplina == 'Programação de Sistemas para Internet',
        )
    if material_type is Explicacao:
        return Explicacao(**campos_comuns, questions='Quais são os principais conceitos deste assunto?')
    if material_type is FlashCards:
        return FlashCards(**campos_comuns, difficulty=random.choice(list(Difficulty)), amount=5)
    if material_type is Formulario:
        return Formulario(**campos_comuns, difficulty=random.choice(list(Difficulty)), amount=5)
    if material_type is PlanoDeAula:
        return PlanoDeAula(
            **campos_comuns,
            grade='Ensino Médio Técnico',
            objective=f'Compreender os fundamentos de {disciplina}.',
            duration=50,
            chalkboard=True,
            projector=True,
            printed=False,
            digital=True,
        )
    if material_type is Questoes:
        return Questoes(**campos_comuns, difficulty=random.choice(list(Difficulty)), amount=5)
    if material_type is Quiz:
        return Quiz(**campos_comuns, difficulty=random.choice(list(Difficulty)), time_per_question=30, amount=5)
    if material_type is Resumo:
        return Resumo(**campos_comuns)
    return Roteiro(**campos_comuns)


def popular_banco(quantidade: int) -> None:
    Base.metadata.create_all(engine)

    with SessionLocal.begin() as session:
        usuarios = [obter_ou_criar_usuario(session, *dados) for dados in USUARIOS_PADRAO]
        for usuario in usuarios:
            for indice in range(quantidade):
                material = criar_material(usuario, indice)
                session.add(Historico(material=material))

    print(f'{len(usuarios)} usuários prontos; {quantidade} materiais criados por usuário.')


if __name__ == '__main__':
    popular_banco(solicitar_quantidade())
