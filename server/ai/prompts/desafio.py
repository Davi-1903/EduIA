from langchain_core.output_parsers import JsonOutputParser
from langchain_core.prompts import PromptTemplate

from schemas.desafios import Desafio


PROMPT = """
Você é um professor especialista em {disciplina}. Gere um desafio com uma situação formatada como uma lista em Markdown.

Dados para o desafio:
- Tema: {assunto}
- Dificuldade: Muito difícil
- Observações: {observacoes}

Regras gerais:
- Gere um desafio com uma situação que envolva raciocínio lógico, análise crítica, aplicação de conceitos avançados ou experimentos práticos;
- A explicação deve ser detalhada, divida em seções curtas e conter exemplos práticos, analogias ou ilustrações para facilitar a compreensão;

{format_instructions}

Documentação:
{documentacao}
"""

parser = JsonOutputParser(pydantic_object=Desafio)

prompt_template = PromptTemplate(
    template=PROMPT,
    input_variables=['disciplina', 'assunto', 'observacoes', 'documentacao'],
    partial_variables={'format_instructions': parser.get_format_instructions()},
)
