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

A explicação deve abordar o assunto de maneira completa,
não se limitando a responder diretamente às dúvidas apresentadas.

As dúvidas devem orientar quais pontos merecem maior atenção
e aprofundamento.

Documentação de referência:
{documentacao}

Formato da resposta: {format_instructions}
"""


parser = JsonOutputParser(pydantic_object=ExplicacoesJSON)

prompt_template = PromptTemplate(
    template=PROMPT,
    input_variables=['disciplina', 'assunto', 'duvidas', 'documentacao'],
    partial_variables={'format_instructions': parser.get_format_instructions()},
)
