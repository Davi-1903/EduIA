from flask import Flask

from utils.ai import get_llm, get_vector_store


def init_ai(app: Flask):
    app.extensions['llm'] = get_llm()
    app.extensions['vector_store'] = get_vector_store()
