from langchain_core.output_parsers import JsonOutputParser
from langchain_core.prompts import PromptTemplate

from schemas.quizzes import Quiz


PROMPT = """
Você é um professor especialista em {disciplina}. Gere {quantidade} questões objetivas.

Dados para o quiz:
- Tema: {assunto}
- Dificuldade: {dificuldade}
- Observações: {observacoes}

Regras gerais:
- As questões devem ser de múltipla escolha, com 4 alternativas, sendo apenas uma correta;
- Varie a alternativa correta entre as questões, evite repetir a mesma opção como correta em todas as questões;
- Não inicie a questão com "Questão 1", "1.", "A)", "A." ou qualquer outro marcador de numeração;

{format_instructions}

Documentação:
{documentacao}
"""

parser = JsonOutputParser(pydantic_object=Quiz)

prompt_template = PromptTemplate(
    template=PROMPT,
    input_variables=['disciplina', 'quantidade', 'dificuldade', 'assunto', 'observacoes', 'documentacao'],
    partial_variables={'format_instructions': parser.get_format_instructions()},
)
