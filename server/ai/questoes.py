from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import JsonOutputParser

from schemas.questoes import Questoes


parser = JsonOutputParser(pydantic_object=Questoes)

PROMPT = PromptTemplate(
    template='Você é um professor especialista em {disciplina}. Gere {quantidade} questões objetivas com breves explicações sobre e uma alternativa correta\n{format_instructions}\nDificuldade: {dificuldade}\nTema: {assunto}\nObservações: {observacoes}',
    input_variables=['disciplina', 'quantidade', 'dificuldade', 'assunto', 'observacoes'],
    partial_variables={'format_instructions': parser.get_format_instructions()},
)
