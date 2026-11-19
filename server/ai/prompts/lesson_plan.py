from langchain_core.output_parsers import JsonOutputParser
from langchain_core.prompts import PromptTemplate

from schemas.plano_de_aula import PlanoDeAula


parser = JsonOutputParser(pydantic_object=PlanoDeAula)

prompt_template = PromptTemplate(
    template="""
Você é um professor experiente e especialista em planejamento pedagógico.
Crie um plano de aula completo, pronto para ser aplicado pelo professor.

Dados da aula:
- Disciplina: {disciplina}
- Série/turma: {serie}
- Assunto: {assunto}
- Objetivo da aula: {objetivo}
- Duração total: {duracao} minutos
- Recursos disponíveis: {recursos}
- Observações: {observacoes}

Estrutura obrigatória do conteúdo, em Markdown:
# Plano de aula: <assunto>
## Objetivo
(objetivo geral e 2 a 3 objetivos específicos, no formato "ao final da aula o aluno será capaz de...")
## Conteúdo a ser trabalhado
(explicação do conteúdo em si, com os conceitos, regras e exceções que o professor precisa dominar, e exemplos)
## Recursos
## Etapas
### 1. <título da etapa> (<minutos> min)
**O que o professor faz:** passo a passo da condução, com falas sugeridas, perguntas para a turma e exemplos concretos.
**O que os alunos fazem:** atividade esperada dos alunos.
**Exemplos e atividades:** frases, exercícios ou situações prontas para usar, com a resposta esperada.
### 2. ...
## Avaliação
(como verificar se o objetivo foi atingido, com 3 a 5 questões ou critérios de observação)
## Dicas para o professor
(dificuldades comuns da turma e como contorná-las)

Regras gerais:
- O plano deve ser detalhado a ponto de o professor conseguir aplicar a aula sem pesquisar mais nada.
- Cada etapa deve ter no mínimo 3 parágrafos ou itens, e nunca uma única frase.
- Escreva os exemplos e exercícios completos, e não apenas indique que eles devem existir.
- Use apenas os recursos disponíveis informados. Se não houver nenhum, planeje uma aula só com fala e discussão.
- A soma dos minutos de todas as etapas deve ser exatamente {duracao}.
- Inclua etapas de abertura, desenvolvimento, prática e fechamento/verificação da aprendizagem.
- Adapte a linguagem e a profundidade à série/turma informada.
- Escreva em português do Brasil.
- Não coloque o conteúdo dentro de blocos de código.

{format_instructions}
""",
    input_variables=['disciplina', 'serie', 'assunto', 'objetivo', 'duracao', 'recursos', 'observacoes'],
    partial_variables={'format_instructions': parser.get_format_instructions()},
)