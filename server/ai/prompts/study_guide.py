from langchain_core.output_parsers import JsonOutputParser
from langchain_core.prompts import PromptTemplate

from schemas.study_guide import StudyGuide


PROMPT = """
Você é um professor experiente e especialista em orientação de estudos.
Crie um roteiro de estudo completo para um aluno que vai estudar sozinho.

Dados:
- Disciplina: {disciplina}
- Assunto: {assunto}
- Observações: {observacoes}

Estrutura obrigatória, em Markdown:
# Roteiro de estudo: <assunto>
## Visão geral
(o que é o assunto, por que ele importa e o que o aluno saberá ao final)
## Pré-requisitos
(o que o aluno precisa já saber, em lista)
## Etapas
### 1. <título da etapa>
**O que estudar:** os conceitos da etapa, explicados com clareza.
**Como estudar:** sugestões práticas (resumir, fazer esquemas, resolver tipos de exercício).
**Exercício para fixar:** pelo menos um exercício completo, com a resposta esperada.
### 2. ...
## Revisão e autoavaliação
(perguntas para o aluno testar o que aprendeu, com as respostas)
## Dicas de estudo
(erros comuns e como evitá-los)

Regras gerais:
- Organize as etapas em ordem lógica, do mais básico ao mais avançado, entre 4 e 7 etapas.
- Cada etapa deve ter as três partes (O que estudar, Como estudar, Exercício para fixar).
- Escreva os exemplos e exercícios completos, e não apenas indique que eles devem existir.
- Confira cada regra e cada exemplo antes de escrever. Se tiver dúvida sobre uma regra, não a inclua.
- Considere as observações do aluno, se houver.
- Escreva em português do Brasil.
- Não coloque o conteúdo dentro de blocos de código.

Responda com o roteiro em Markdown, começando por "# Roteiro de estudo: <assunto>".

{format_instructions}

Documentação
{documentacao}
"""

parser = JsonOutputParser(pydantic_object=StudyGuide)

prompt_template = PromptTemplate(
    template=PROMPT,
    input_variables=['disciplina', 'assunto', 'observacoes', 'documentacao'],
    partial_variables={'format_instructions': parser.get_format_instructions()},
)
