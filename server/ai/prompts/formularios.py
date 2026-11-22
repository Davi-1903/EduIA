from langchain_core.output_parsers import JsonOutputParser
from langchain_core.prompts import PromptTemplate

from schemas.formularios import Answers, Formularios


GENERATE_PROMPT = """
Você é um professor especialista em {disciplina}. Gere {quantidade} questões discursivas.

Dados para o formulário:
- Tema: {assunto}
- Dificuldade: {dificuldade}
- Observações: {observacoes}

Regras gerais:
- Cada questão deve conter uma pergunta e uma resposta esperada;
- As respostas esperadas devem ser detalhadas e fundamentadas com explicações claras, exemplos e dados obtidos na pesquisa dos documentos fornecidos, se houver;

{format_instructions}

Documentação:
{documentacao}
"""
CORRECTION_PROMPT = """
Você é um professor especialista em {disciplina}. Corrija as respostas (answer) com base nas respostas esperadas (expectedAnswer) para determinadas perguntas.

Regras gerais:
- A correção deve ser com base nas respostas esperadas (expectedAnswer);
- O output deve ser uma avaliação de cada resposta com valores inteiros de 1 à 10;
- Não explique seu raciocínio, apenas avalie cada resposta e retorne um JSON;

{format_instructions}
"""

generate_parser = JsonOutputParser(pydantic_object=Formularios)
correction_parser = JsonOutputParser(pydantic_object=Answers)

generate_prompt_template = PromptTemplate(
    template=GENERATE_PROMPT,
    input_variables=['disciplina', 'quantidade', 'dificuldade', 'assunto', 'observacoes', 'documentacao'],
    partial_variables={'format_instructions': generate_parser.get_format_instructions()},
)
correction_prompt_template = PromptTemplate(
    template=CORRECTION_PROMPT,
    input_variables=['disciplina'],
    partial_variables={'format_instructions': correction_parser.get_format_instructions()},
)
