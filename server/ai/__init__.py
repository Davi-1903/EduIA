from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from langchain_huggingface import ChatHuggingFace, HuggingFaceEndpoint

from utils import get_env


llm_base = HuggingFaceEndpoint(
    model=get_env('HF_MODEL'),
    max_new_tokens=int(get_env('MAX_TOKENS')),
    temperature=0.1,
    top_p=0.9,
    provider='auto',
)

chat_model = ChatHuggingFace(llm=llm_base)

llm_resiliente = chat_model.with_retry(stop_after_attempt=5, wait_exponential_jitter=True)


def get_chain(prompt: PromptTemplate, parser: JsonOutputParser):
    return prompt | llm_resiliente | parser
