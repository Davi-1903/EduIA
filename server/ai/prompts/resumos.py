from langchain_core.output_parsers import JsonOutputParser
from langchain_core.prompts import PromptTemplate

from schemas.resumos import Resumos


PROMPT = """
Você é um professor especialista em {disciplina}.
Gere um resumo sobre o tema abaixo, organizado em seções curtas em markdown.

Dados para o resumo:
- Tema: {assunto}
- Observações: {observacoes}

{format_instructions}

Documentação:
{documentacao}
"""

parser = JsonOutputParser(pydantic_object=Resumos)

prompt_template = PromptTemplate(
    template=PROMPT,
    input_variables=['disciplina', 'assunto', 'observacoes', 'documentacao'],
    partial_variables={'format_instructions': parser.get_format_instructions()},
)
