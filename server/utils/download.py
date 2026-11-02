from io import BytesIO

import nh3
from markdown import markdown
from xhtml2pdf import pisa


PDF_CSS = """
@page { size: a4; margin: 20mm }
body { font-family: Arial; font-size: 12pt; line-height: 1.5; }
h1 { -pdf-keep-with-next: true; font-size: 16pt; }
h2 { -pdf-keep-with-next: true; font-size: 14pt; }
h3 { -pdf-keep-with-next: true; font-size: 12pt; }
h4 { -pdf-keep-with-next: true; font-size: 10pt; }
blockquote { border-left: solid 2px black; background-color: #dfdfdf; }
"""


def json_to_html(content: list | dict, type_: str, title: str) -> str:
    format_types = {
        'exercicio_guiado': 'Exercício guiado',
        'flashcards': 'Flashcards',
        'formulario': 'Formulário',
        'questoes': 'Questões',
        'quiz': 'Quiz',
    }
    letters = ['A)', 'B)', 'C)', 'D)']
    html = f'<h1>{format_types[type_]} - {title}</h1>'

    if type_ == 'exercicio_guiado' and isinstance(content, dict):
        if content['type'] == 'multiple_choice':
            for question in content['content']:
                html += f'<h2>{question["id"]}. {question["question"]}</h2>'
                html += '<ul>'
                for letter, item in zip(letters, question['answers']):
                    html += f'<p><strong>{letter}</strong> {item["text"]}</p>'
                html += '</ul>'
                html += f'<p><strong>Resposta:</strong> {question["answers"][question["correctAnswerId"]]}</p>'
                html += f'<p><strong>Explicação:</strong> {question["explanation"]}</p>'
        elif content['type'] == 'true_or_false':
            for question in content['content']:
                html += f'<h2>{question["id"]}. {question["question"]} Verdadeiro ou Falso?</h2>'
                html += f'<p><strong>Resposta:</strong> {"Verdadeiro" if question["correctAnswer"] else "Falso"}</p>'
                html += f'<p><strong>Explicação:</strong> {question["explanation"]}</p>'
        elif content['type'] == 'discursive':
            for question in content['content']:
                html += f'<h2>{question["id"]}. {question["question"]}</h2>'
                html += f'<p><strong>Resposta esperada:</strong> {question["expectedAnswer"]}</p>'
                html += f'<p><strong>Explicação:</strong> {question["explanation"]}</p>'
    elif type_ == 'flashcards':
        for item in content:
            html += '<ul>'
            html += f'<li><strong>Pergunta:</strong> <span>{item["question"]}</span><li>'
            html += f'<li><strong>Resposta:</strong> <span>{item["answer"]}</span></li>'
            html += '</ul>'
    elif type_ in ('questoes', 'quiz', 'formulario'):
        for question in content:
            html += f'<h2>{question["id"]}. {question["question"]}</h2>'
            html += '<ul>'
            for letter, item in zip(letters, question['answers']):
                html += f'<p><strong>{letter}</strong> {item["text"]}</p>'
            html += '</ul>'

    return html


def make_pdf(content: str | list, type_: str, title: str) -> bytes:
    if isinstance(content, list):
        html_body = json_to_html(content, type_, title)
    else:
        html_body = nh3.clean(markdown(content, extensions=['extra', 'sane_lists', 'tables', 'fenced_code']))
    html = f"<html><head><meta charset='utf-8'><style>{PDF_CSS}</style></head><body>{html_body}<blockquote>Teste</blockquote></body></html>"

    out = BytesIO()
    result = pisa.CreatePDF(html, dest=out, encoding='utf-8')
    if result.err:
        raise RuntimeError('Falha ao gerar o PDF')
    return out.getvalue()
