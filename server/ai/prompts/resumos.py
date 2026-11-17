from langchain_core.output_parsers import JsonOutputParser
from langchain_core.prompts import PromptTemplate

from schemas.resumos import ResumosJSON


PROMPT = """
Você é um professor especialista em {disciplina}. Gere um resumo explicativo.

Tema: {assunto}
Observações: {observacoes}
Formato da resposta: {format_instructions}

{documentacao}
"""

parser = JsonOutputParser(pydantic_object=ResumosJSON)

prompt_template = PromptTemplate(
    template=PROMPT,
    input_variables=['disciplina', 'assunto', 'observacoes', 'documentacao'],
    partial_variables={'format_instructions': parser.get_format_instructions()},
)
