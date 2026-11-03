from flask import current_app
from langchain_groq import ChatGroq
from langchain_pinecone import PineconeVectorStore


def get_llm_ext() -> ChatGroq:
    return current_app.extensions['llm']


def get_vector_store_ext() -> PineconeVectorStore:
    return current_app.extensions['vector_store']
