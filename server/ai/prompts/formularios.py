from langchain_core.output_parsers import JsonOutputParser
from langchain_core.prompts import PromptTemplate

from schemas.formularios import Formularios


PROMPT = """
Você é um professor especialista em {disciplina}. Gere {quantidade} questões objetivascom 4 alternativas ou discursivas, com apenas um alternativa correta.

Formato da resposta: {format_instructions}
Dificuldade: {dificuldade}
Tema: {assunto}
Observações: {observacoes}
"""

parser = JsonOutputParser(pydantic_object=Formularios)

prompt_template = PromptTemplate(
    template=PROMPT,
    input_variables=['disciplina', 'quantidade', 'dificuldade', 'assunto', 'observacoes'],
    partial_variables={'format_instructions': parser.get_format_instructions()},
)
