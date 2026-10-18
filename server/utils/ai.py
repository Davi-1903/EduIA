from enum import Enum

from langchain_huggingface import ChatHuggingFace, HuggingFaceEmbeddings, HuggingFaceEndpoint
from langchain_pinecone import PineconeVectorStore
from pinecone import Pinecone

from . import get_env


# Usar para validar a disciplina
class Discipline(str, Enum):
    filosofia_ciencia_e_tecnologia = 'Filosofia, Ciência e Tecnologia'
    sociologia_do_trabalho = 'Sociologia do Trabalho'
    qualidade_de_vida_e_trabalho = 'Qualidade de Vida e Trabalho'
    gestao_organizacional = 'Gestão Organizacional'
    fundamentos_de_logica_e_algoritmo = 'Fundamentos de Lógica e Algoritmo'
    analise_e_projeto_orientados_a_objetos = 'Análise e Projeto Orientados a Objetos'
    projeto_de_desenvolvimento_de_sistemas_para_internet = 'Projeto de Desenvolvimento de Sistemas para Internet'
    principios_de_design_e_projeto_grafico = 'Princípios de Design e Projeto Gráfico'
    design_web_e_arquitetura_da_informacao = 'Design Web e Arquitetura da Informação'
    programacao_estruturada_e_orientada_a_objetos = 'Programação Estruturada e Orientada a Objetos'
    banco_de_dados = 'Banco de Dados'
    programacao_de_sistemas_para_internet = 'Programação de Sistemas para Internet'
    instalacao_e_configuracao_de_servidores = 'Instalação e Configuração de Servidores'
    projeto_de_interface_do_usuario = 'Projeto de Interface do Usuário'
    programacao_orientada_a_servicos = 'Programação Orientada a Serviços'


def get_llm() -> ChatHuggingFace:
    llm_base = HuggingFaceEndpoint(
        model=get_env('HF_MODEL'),
        max_new_tokens=int(get_env('MAX_TOKENS')),
        temperature=0.1,
        top_p=0.9,
        provider='auto',
    )
    return ChatHuggingFace(llm=llm_base)


def get_embedding_model() -> HuggingFaceEmbeddings:
    return HuggingFaceEmbeddings(
        model_name=get_env('HF_EMBEDDING_MODEL'),
        encode_kwargs={'normalize_embeddings': True},
    )


def get_vector_store() -> PineconeVectorStore:
    embeddings = get_embedding_model()

    try:
        pc = Pinecone(api_key=get_env('PINECONE_API_KEY'))
        index = pc.Index(get_env('INDEX_NAME'))
    except Exception as err:
        raise RuntimeError(f'Não foi possível se conectar ao pinecone: {err}') from err

    return PineconeVectorStore(embedding=embeddings, index=index)


def search_documentation(vector_store: PineconeVectorStore, query: str, discipline: str) -> str:
    result = vector_store.similarity_search(query, filter={'discipline': discipline}, k=10)
    if not result:
        return 'Nenhum resultado encontrado nos documentos indexados.'

    return '\n\n---\n\n'.join(
        f'Fonte: {doc.metadata.get("source", "desconhecida")}\n{doc.page_content}' for doc in result
    )
