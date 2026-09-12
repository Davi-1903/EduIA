"""Popula o banco com usuários e materiais de desenvolvimento."""

import random
from argparse import ArgumentParser

from pwdlib import PasswordHash
from rich import box, print
from rich.table import Table
from sqlalchemy import desc, func, select
from sqlalchemy.orm import Session

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
    (Aluno, 'Fulano', 'fulano@eduia.com'),
    (Professor, 'Beltrano', 'beltrano@eduia.com'),
    (Aluno, 'Sicrano', 'sicrano@eduia.com'),
)


def exibir_usuarios():
    table = Table(
        title='Users',
        box=box.SIMPLE_HEAD,
    )
    table.add_column('Id', style='cyan')
    table.add_column('Nome', style='green')
    table.add_column('Email', style='green')
    table.add_column('Senha', style='yellow', justify='right')
    table.add_column('Tipo', style='cyan')

    for idx, user in enumerate(USUARIOS_PADRAO, 1):
        table.add_row(f'{idx:0>2}', user[1], user[2], PASSWORD, user[0].__name__)

    print('', table)


def exibir_materiais(session: Session):
    materiais = session.execute(
        select(Material.type, func.count('*').label('qnt')).group_by(Material.type).order_by(desc('qnt'))
    ).all()

    table = Table(title='Materiais', box=box.SIMPLE, show_footer=True)
    table.add_column('Tipo', style='green', footer='Total')
    table.add_column(
        'Quantidade',
        style='cyan bold',
        footer=str(sum(quantidade for _, quantidade in materiais)),
        footer_style='cyan bold',
    )

    for type_, quantidade in materiais:
        table.add_row(type_.value.upper(), str(quantidade))

    print(table)


def obter_ou_criar_usuario(session: Session, model, nome: str, email: str) -> Usuario:
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


def criar_conteudo_estatico(material_type, disciplina: str) -> dict:
    if material_type is Desafio:
        return {
            'content': (
                f'## Desafio: {disciplina}\n\n'
                f'Explique como os conceitos de **{disciplina}** aparecem em uma situação prática. '
                'Apresente um exemplo, descreva as etapas da solução e justifique suas escolhas.'
            )
        }
    if material_type is ExercicioGuiado:
        return {
            'content': (
                f'## Exercício guiado: {disciplina}\n\n'
                f'1. Defina o conceito principal de {disciplina}.\n'
                '2. Liste duas características importantes.\n'
                '3. Resolva um exemplo relacionado ao curso técnico.\n'
                '4. Confira a resolução e explique o resultado com suas próprias palavras.'
            )
        }
    if material_type is Explicacao:
        return {
            'content': (
                f'# {disciplina}\n\n'
                f'{disciplina} reúne conceitos fundamentais para compreender situações acadêmicas e profissionais.\n\n'
                '## Ideias principais\n'
                '- Identifique os conceitos e suas relações.\n'
                '- Observe como eles são aplicados em exemplos reais.\n'
                '- Compare os resultados e registre dúvidas para revisão.'
            )
        }
    if material_type is FlashCards:
        return {
            'content': [
                {
                    'id': 1,
                    'question': f'Qual é a ideia central de {disciplina}?',
                    'answer': f'É o conjunto de conceitos e aplicações fundamentais de {disciplina}.',
                },
                {
                    'id': 2,
                    'question': f'Como você explicaria {disciplina} com um exemplo prático?',
                    'answer': 'Relacionando seus conceitos a uma situação real e observando como eles se aplicam.',
                },
                {
                    'id': 3,
                    'question': f'O que deve ser revisado ao estudar {disciplina}?',
                    'answer': 'Os conceitos-chave, suas relações e os exemplos em que eles aparecem.',
                },
            ]
        }
    if material_type is Formulario:
        return {
            'content': [
                {
                    'id': 1,
                    'question': f'Qual alternativa representa uma aplicação de {disciplina}?',
                    'answers': [
                        {'id': 1, 'text': f'Aplicar conceitos de {disciplina} em uma situação prática.'},
                        {'id': 2, 'text': 'Ignorar os dados do problema.'},
                        {'id': 3, 'text': 'Repetir uma resposta sem analisá-la.'},
                        {'id': 4, 'text': 'Escolher uma resposta ao acaso.'},
                    ],
                    'correctAnswerId': 1,
                },
                {
                    'id': 2,
                    'question': f'Qual é o melhor caminho para compreender melhor {disciplina}?',
                    'answers': [
                        {'id': 1, 'text': 'Conectar teoria, exemplos e reflexão sobre o conteúdo.'},
                        {'id': 2, 'text': 'Memorizar sem relacionar o tema a contextos.'},
                        {'id': 3, 'text': 'Evitar a revisão de conceitos fundamentais.'},
                        {'id': 4, 'text': 'Aceitar a primeira ideia que aparecer.'},
                    ],
                    'correctAnswerId': 1,
                },
                {
                    'id': 3,
                    'question': f'O que caracteriza uma boa análise de {disciplina}?',
                    'answers': [
                        {'id': 1, 'text': 'Identificar relações entre conceitos e situações reais.'},
                        {'id': 2, 'text': 'Substituir o raciocínio por respostas prontas.'},
                        {'id': 3, 'text': 'Ignorar exemplos e exercícios.'},
                        {'id': 4, 'text': 'Repetir frases sem entender seu significado.'},
                    ],
                    'correctAnswerId': 1,
                },
            ]
        }
    if material_type is PlanoDeAula:
        return {
            'content': (
                f'# Plano de aula: {disciplina}\n\n'
                '## Objetivo\n'
                f'Compreender os fundamentos de {disciplina} e relacioná-los a uma aplicação prática.\n\n'
                '## Etapas\n'
                '1. Levantamento dos conhecimentos prévios.\n'
                '2. Apresentação dos conceitos.\n'
                '3. Atividade em dupla e discussão dos resultados.\n'
                '4. Síntese e avaliação formativa.'
            )
        }
    if material_type is Questoes:
        return {
            'content': [
                {
                    'id': 1,
                    'question': f'Por que estudar {disciplina}?',
                    'answers': [
                        {'id': 1, 'text': 'Para compreender conceitos e resolver situações práticas.'},
                        {'id': 2, 'text': 'Para evitar qualquer forma de análise.'},
                        {'id': 3, 'text': 'Para memorizar respostas sem contexto.'},
                        {'id': 4, 'text': 'Para ignorar exemplos e repertórios de estudo.'},
                    ],
                    'correctAnswerId': 1,
                    'explanation': f'O estudo de {disciplina} combina compreensão conceitual e aplicação prática.',
                },
                {
                    'id': 2,
                    'question': f'Qual estratégia ajuda mais no aprendizado de {disciplina}?',
                    'answers': [
                        {'id': 1, 'text': 'Relacionar teoria, exemplos e revisão constante.'},
                        {'id': 2, 'text': 'Repetir textos sem refletir sobre o conteúdo.'},
                        {'id': 3, 'text': 'Evitar perguntas e exercícios de verificação.'},
                        {'id': 4, 'text': 'Acreditar que a primeira resposta é sempre correta.'},
                    ],
                    'correctAnswerId': 1,
                    'explanation': f'Uma boa estratégia para {disciplina} envolve reflexão, aplicação e revisão do conteúdo.',
                },
                {
                    'id': 3,
                    'question': f'O que indica uma compreensão mais sólida de {disciplina}?',
                    'answers': [
                        {'id': 1, 'text': 'Ser capaz de explicar o tema e aplicá-lo em exemplos.'},
                        {'id': 2, 'text': 'Só memorizar fórmulas ou definições sem contexto.'},
                        {'id': 3, 'text': 'Ignorar as dúvidas durante a aprendizagem.'},
                        {'id': 4, 'text': 'Resumir tudo sem praticar o conteúdo.'},
                    ],
                    'correctAnswerId': 1,
                    'explanation': f'Compreender {disciplina} significa explicar, relacionar e aplicar os conceitos com clareza.',
                },
            ]
        }
    if material_type is Quiz:
        return {
            'content': [
                {
                    'id': 1,
                    'question': f'Qual é um bom primeiro passo ao estudar {disciplina}?',
                    'answers': [
                        {'id': 1, 'text': 'Relacionar o conceito a um exemplo.'},
                        {'id': 2, 'text': 'Pular a leitura do enunciado.'},
                        {'id': 3, 'text': 'Escolher uma resposta ao acaso.'},
                        {'id': 4, 'text': 'Ignorar a definição do tema.'},
                    ],
                    'correctAnswerId': 1,
                },
                {
                    'id': 2,
                    'question': f'Qual ação melhora a retenção de {disciplina}?',
                    'answers': [
                        {'id': 1, 'text': 'Revisar os conceitos com pausas e exercícios.'},
                        {'id': 2, 'text': 'Estudar apenas uma vez e parar.'},
                        {'id': 3, 'text': 'Evitar exemplos práticos.'},
                        {'id': 4, 'text': 'Repetir respostas sem verificar o tema.'},
                    ],
                    'correctAnswerId': 1,
                },
                {
                    'id': 3,
                    'question': f'Como você pode avaliar se aprendeu {disciplina}?',
                    'answers': [
                        {'id': 1, 'text': 'Explicando o tema e resolvendo aplicações.'},
                        {'id': 2, 'text': 'Sem tentar usar o conhecimento em situações reais.'},
                        {'id': 3, 'text': 'Sem revisar os conceitos principais.'},
                        {'id': 4, 'text': 'Usando apenas uma resposta memorizada.'},
                    ],
                    'correctAnswerId': 1,
                },
            ]
        }
    if material_type is Resumo:
        return {
            'content': (
                f'# Resumo: {disciplina}\n\n'
                f'{disciplina} envolve conceitos, métodos e aplicações que podem ser relacionados ao cotidiano. '
                'Para revisar, destaque definições, relações entre ideias e exemplos de uso.'
            )
        }
    return {
        'content': (
            f'# Roteiro de estudo: {disciplina}\n\n'
            '## Sequência sugerida\n'
            '1. Leia a definição do tema.\n'
            '2. Registre os conceitos desconhecidos.\n'
            '3. Resolva um exemplo prático.\n'
            '4. Revise os pontos principais e produza uma síntese.'
        )
    }


def criar_material(usuario: Usuario, indice: int) -> Material:
    grupo = random.choice(list(CATALOGO))
    disciplina = random.choice(CATALOGO[grupo])
    assunto = f'{disciplina}: conceitos e aplicações'
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
    conteudo = criar_conteudo_estatico(material_type, disciplina)
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


def popular_banco():
    parser = ArgumentParser()
    parser.add_argument('quantidade', type=int, help='Quantidade de materiais por usuário')
    args = parser.parse_args()

    Base.metadata.create_all(engine)

    with SessionLocal.begin() as session:
        usuarios = [obter_ou_criar_usuario(session, *dados) for dados in USUARIOS_PADRAO]
        for usuario in usuarios:
            for indice in range(args.quantidade):
                material = criar_material(usuario, indice)
                session.add(Historico(material=material))
        exibir_usuarios()
        exibir_materiais(session)


if __name__ == '__main__':
    popular_banco()
