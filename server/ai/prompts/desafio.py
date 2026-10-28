from langchain_core.output_parsers import JsonOutputParser
from langchain_core.prompts import PromptTemplate

from schemas.desafios import Desafio


PROMPT = """
Você é um professor especialista em {disciplina}. Gere {quantidade} desafios com uma situação e uma explicação breve da resolução
Formato da resposta: {format_instructions}
Dificuldade: {dificuldade}
Tema: {assunto}
Observações: {observacoes}
"""

parser = JsonOutputParser(pydantic_object=Desafio)

prompt_template = PromptTemplate(
    template=PROMPT,
    input_variables=['disciplina', 'quantidade', 'dificuldade', 'assunto', 'observacoes'],
    partial_variables={'format_instructions': parser.get_format_instructions()},
)
