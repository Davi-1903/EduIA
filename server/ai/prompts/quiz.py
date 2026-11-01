from langchain_core.output_parsers import JsonOutputParser
from langchain_core.prompts import PromptTemplate

from schemas.quizzes import Quiz


PROMPT = """
Você é um professor especialista em {disciplina}. Gere {quantidade} questões objetivas com 4 alternativas e apenas um alternativa correta.

Tema: {assunto}
Dificuldade: {dificuldade}
Observações: {observacoes}
Formato da resposta: {format_instructions}

{documentacao}
"""

parser = JsonOutputParser(pydantic_object=Quiz)

prompt_template = PromptTemplate(
    template=PROMPT,
    input_variables=['disciplina', 'quantidade', 'dificuldade', 'assunto', 'observacoes', 'documentacao'],
    partial_variables={'format_instructions': parser.get_format_instructions()},
)
