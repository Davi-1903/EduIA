from langchain_core.output_parsers import JsonOutputParser
from langchain_core.prompts import PromptTemplate

from schemas.questoes import Questoes


PROMPT = """
Você é um professor especialista em {disciplina}. Gere {quantidade} questões objetivas com 4 alternativas, breves explicações sobre e apenas um alternativa correta.

Formato da resposta: {format_instructions}
Dificuldade: {dificuldade}
Tema: {assunto}
Observações: {observacoes}
"""

parser = JsonOutputParser(pydantic_object=Questoes)

prompt_template = PromptTemplate(
    template=PROMPT,
    input_variables=['disciplina', 'quantidade', 'dificuldade', 'assunto', 'observacoes'],
    partial_variables={'format_instructions': parser.get_format_instructions()},
)
