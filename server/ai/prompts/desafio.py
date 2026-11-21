from langchain_core.output_parsers import JsonOutputParser
from langchain_core.prompts import PromptTemplate

from schemas.desafios import Desafio


PROMPT = """
Você é um professor especialista em {disciplina}. Gere um desafio com uma situação e uma breve explicação da resolução, dividida em seções curtas e formatada como uma lista em Markdown. Use um nível de dificuldade muito difícil.

Tema: {assunto}
Formato da resposta: {format_instructions}
Observações: {observacoes}

{documentacao}
"""

parser = JsonOutputParser(pydantic_object=Desafio)

prompt_template = PromptTemplate(
    template=PROMPT,
    input_variables=['disciplina', 'assunto', 'observacoes', 'documentacao'],
    partial_variables={'format_instructions': parser.get_format_instructions()},
)
