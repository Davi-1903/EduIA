from langchain_core.output_parsers import JsonOutputParser
from langchain_core.prompts import PromptTemplate

from schemas.flashcards import Flashcards


PROMPT = """
Você é um professor especialista em {disciplina}. Gere {quantidade} flashcards, com breves explicações sobre o assunto.

Dados para os flashcards:
- Tema: {assunto}
- Dificuldade: {dificuldade}

Regras gerais:
- Cada flashcard deve conter uma pergunta e uma resposta, com explicações claras, porém concisas;

{format_instructions}

Documentação:
{documentacao}
"""

parser = JsonOutputParser(pydantic_object=Flashcards)

prompt_template = PromptTemplate(
    template=PROMPT,
    input_variables=['disciplina', 'quantidade', 'dificuldade', 'assunto', 'documentacao'],
    partial_variables={'format_instructions': parser.get_format_instructions()},
)
