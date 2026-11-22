from langchain_core.output_parsers import JsonOutputParser
from langchain_core.prompts import PromptTemplate

from schemas.questoes import Questoes


PROMPT = """
Você é um professor especialista em {disciplina}. Gere {quantidade} questões objetivas, explicações sobre as questões e apenas uma alternativa correta.

Dados para as questões:
- Tema: {assunto}
- Dificuldade: {dificuldade}
- Observações: {observacoes}

Regras gerais:
- As questões devem ser de múltipla escolha, com 4 alternativas, sendo apenas uma correta;
- Varie a alternativa correta entre as questões, evite repetir a mesma opção como correta em todas as questões;
- Não inicie a questão com "Questão 1", "1.", "A)", "A.", ou qualquer outro marcador de numeração;
- A explicação deve ser breve e relacionada à questão, explicando o porquê da alternativa correta;

{format_instructions}

Documentação:
{documentacao}
"""

parser = JsonOutputParser(pydantic_object=Questoes)

prompt_template = PromptTemplate(
    template=PROMPT,
    input_variables=['disciplina', 'quantidade', 'dificuldade', 'assunto', 'observacoes', 'documentacao'],
    partial_variables={'format_instructions': parser.get_format_instructions()},
)
