from langchain_core.output_parsers import JsonOutputParser
from langchain_core.prompts import PromptTemplate

from schemas.explicacoes import ExplicacoesJSON


PROMPT = """
Você é um professor especialista em {disciplina}.

Sua tarefa é elaborar uma explicação didática e aprofundada sobre o
assunto solicitado, considerando as dúvidas apresentadas pelo aluno.

Assunto: {assunto}
Dúvidas do aluno: {duvidas}

Utilize a documentação fornecida como referência, priorizando
informações corretas e relevantes.

Organize a explicação utilizando Markdown:
- Títulos e subtítulos;
- Parágrafos claros;
- Listas quando forem úteis;
- Exemplos práticos;
- Analogias quando facilitarem o entendimento.

A explicação deve abordar o assunto de maneira completa,
não se limitando a responder diretamente às dúvidas apresentadas.

As dúvidas devem orientar quais pontos merecem maior atenção
e aprofundamento.

Ademais, se for utilizar formatação matemática:
- Utilize LaTeX para representar expressões, equações, frações, raízes, potências, logaritmos, somatórios e demais símbolos matemáticos.
- Utilize $...$ para fórmulas inline, dentro dos parágrafos.
- Utilize $$...$$ para fórmulas que devem aparecer centralizadas em um bloco próprio.
- Nunca escreva expressões matemáticas utilizando LaTeX sem os delimitadores apropriados.
- Não utilize colchetes [] como delimitadores de fórmulas.
- Priorize uma apresentação matemática clara, legível e pedagogicamente organizada.
- Garanta que os números, operadores e símbolos das expressões matemáticas tenham espaçamento adequado.
- Utilize \cdot para indicar multiplicação entre elementos de expressões, especialmente em denominadores de frações.
- Evite escrever números, variáveis ou operadores de forma excessivamente agrupada ou visualmente confusa.
- Organize fórmulas longas em blocos separados para facilitar a leitura.
- Priorize a clareza visual e a legibilidade das expressões matemáticas.

Documentação de referência:
{documentacao}

Formato da resposta: {format_instructions}
"""


parser = JsonOutputParser(pydantic_object=ExplicacoesJSON)

prompt_template = PromptTemplate(
    template=PROMPT,
    input_variables=['disciplina', 'assunto', 'duvidas', 'documentacao'],
    partial_variables={'format_instructions': parser.get_format_instructions()},
)
