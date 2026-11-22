from langchain_core.output_parsers import JsonOutputParser
from langchain_core.prompts import PromptTemplate

from schemas.formularios import Formularios


PROMPT = """
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

parser = JsonOutputParser(pydantic_object=Formularios)

prompt_template = PromptTemplate(
    template=PROMPT,
    input_variables=['disciplina', 'quantidade', 'dificuldade', 'assunto', 'observacoes', 'documentacao'],
    partial_variables={'format_instructions': parser.get_format_instructions()},
)
