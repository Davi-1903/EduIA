from langchain_core.output_parsers import JsonOutputParser
from langchain_core.prompts import PromptTemplate

from schemas.exercicios_guiados import ExerciciosGuiados


PROMPT = """
Você é um professor especialista em {disciplina}. Gere {quantidade} questões de exercício guiado do tipo {tipo}.

Regras gerais:
- Todas as questões devem ser do tipo {tipo}, sem misturar tipos.
- Cada questão deve ter uma dica (hint) que oriente o aluno sem entregar a resposta.
- Cada questão deve ter uma explicação (explanation) com a resolução comentada, passo a passo.
- Escreva fórmulas em LaTeX.
- No campo type da resposta, use exatamente: {tipo}

Regras por tipo:
- multiple_choice: 4 alternativas em answers (ids 1 a 4) e apenas uma correta, indicada em correctAnswerId. Não use correctAnswer nem expectedAnswer.
- true_or_false: o enunciado é uma afirmação. Use correctAnswer como true ou false. Não use answers, correctAnswerId nem expectedAnswer.
- discursive: não use answers, correctAnswerId nem correctAnswer. Preencha expectedAnswer com um modelo de resposta esperada.

Tema: {assunto}
Dificuldade: {dificuldade}
Observações: {observacoes}
Formato da resposta: {format_instructions}

{documentacao}
"""

parser = JsonOutputParser(pydantic_object=ExerciciosGuiados)

prompt_template = PromptTemplate(
    template=PROMPT,
    input_variables=['disciplina', 'quantidade', 'tipo', 'dificuldade', 'assunto', 'observacoes', 'documentacao'],
    partial_variables={'format_instructions': parser.get_format_instructions()},
)