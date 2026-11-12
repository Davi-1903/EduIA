from langchain_core.output_parsers import JsonOutputParser
from langchain_core.prompts import PromptTemplate

from schemas.explicacoes import ExplicacoesJSON


PROMPT = """
Você é um professor especialista em {disciplina}.

Sua tarefa é elaborar uma explicação didática e aprofundada sobre o
assunto solicitado, considerando as dúvidas apresentadas pelo aluno.

Assunto: {assunto}
Dúvidas do aluno: {duvidas}

Utilize a documentação fornecida como referência, priorizando
informações corretas e relevantes.

Organize a explicação utilizando Markdown:
- Títulos e subtítulos;
- Parágrafos claros;
- Listas quando forem úteis;
- Exemplos práticos;
- Analogias quando facilitarem o entendimento.

Adapte a linguagem à dificuldade solicitada, sem comprometer
a precisão conceitual.

Documentação de referência:
{documentacao}

Formato da resposta: {format_instructions}
"""


parser = JsonOutputParser(pydantic_object=ExplicacoesJSON)

prompt_template = PromptTemplate(
    template=PROMPT,
    input_variables=['disciplina', 'quantidade', 'dificuldade', 'assunto', 'documentacao'],
    partial_variables={'format_instructions': parser.get_format_instructions()},
)
