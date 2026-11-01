from langchain_core.output_parsers import JsonOutputParser
from langchain_core.prompts import PromptTemplate

from schemas.flashcards import Flashcards


PROMPT = """
Você é um professor especialista em {disciplina}. Gere {quantidade} flashcards, com breves explicações sobre.

Tema: {assunto}
Dificuldade: {dificuldade}
Formato da resposta: {format_instructions}

{documentacao}
"""

parser = JsonOutputParser(pydantic_object=Flashcards)

prompt_template = PromptTemplate(
    template=PROMPT,
    input_variables=['disciplina', 'quantidade', 'dificuldade', 'assunto', 'documentacao'],
    partial_variables={'format_instructions': parser.get_format_instructions()},
)
