"""
Gerador de Flashcards: modelo do Hugging Face servido via API
compatível com OpenAI, usando o pacote langchain_openai
---------------------------------------------------------------
O Hugging Face expõe um endpoint compatível com a API da OpenAI
(Inference Providers / router.huggingface.co). Isso permite usar
a classe ChatOpenAI do langchain_openai apontando para lá, trocando
apenas base_url, api_key e o nome do modelo.

Requisitos:
    pip install langchain langchain-openai pydantic

Antes de rodar, defina seu token do Hugging Face:
    export HUGGINGFACEHUB_API_TOKEN="hf_xxx..."
"""

import json
import os
from pydantic import BaseModel, Field
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate


# --- 1. Modelos Pydantic que definem o formato da resposta ---
class Flashcard(BaseModel):
    id: int = Field(description='Identificador sequencial do flashcard')
    question: str = Field(description='Pergunta do flashcard')
    answer: str = Field(description='Resposta do flashcard')


class FlashcardList(BaseModel):
    flashcards: list[Flashcard] = Field(description='Lista de flashcards gerados')


# --- 2. Configuração do modelo (Hugging Face via endpoint OpenAI-compatible) ---
# Formato do "model": "<repo_id>:<provider>" (o provider pode ser omitido
# para usar o default do Hugging Face)
MODEL_ID = 'Qwen/Qwen2.5-72B-Instruct'

llm = ChatOpenAI(
    model=MODEL_ID,
    base_url='https://router.huggingface.co/v1',
    api_key=os.environ.get('HUGGINGFACEHUB_API_TOKEN'),
    temperature=0.1,
)

# Amarra a saída do modelo ao schema Pydantic
structured_llm = llm.with_structured_output(FlashcardList)

# --- 3. Prompt ---
prompt = ChatPromptTemplate.from_messages(
    [
        (
            'system',
            'Você é um assistente que cria flashcards de estudo, claros e objetivos.',
        ),
        (
            'human',
            'Crie {quantidade} flashcards sobre o seguinte tema/conteúdo:\n\n{conteudo}',
        ),
    ]
)

chain = prompt | structured_llm

# --- 4. Execução de exemplo ---
if __name__ == '__main__':
    resultado = chain.invoke(
        {
            'quantidade': 5,
            'conteudo': 'Revolução Francesa: causas, principais eventos e consequências.',
        }
    )

    if hasattr(resultado, 'flashcards'):
        flashcards_dict = [f.model_dump() for f in resultado.flashcards]  # type: ignore
        print(json.dumps(flashcards_dict, ensure_ascii=False, indent=2))
    else:
        print('Ocorreu um erro na resposta do modelo.')
