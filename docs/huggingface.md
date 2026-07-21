# Exemplo de código com HuggingFace

Para integrar o Hugging Face ao LangChain em Python e garantir que a resposta retorne estritamente um JSON estruturado (mesmo com volumes densos de texto), a melhor abordagem é utilizar a biblioteca @langchain/community com o módulo HuggingFaceEndpoint combinado com um Structured Output Parser.
Como o limite da API gratuita para respostas longas gira em torno de 2048 a 4096 tokens, recomendo usar o modelo Qwen/Qwen2.5-74B-Instruct, que entende português perfeitamente e é excelente em seguir esquemas JSON rígidos.

## Código de Exemplo (Python + LangChain)

Primeiro, certifique-se de instalar as dependências atualizadas:

```bash
pip install langchain langchain-community langchain-core huggingface_hub Pydantic
```

Aqui está a implementação completa estruturando a geração dos flashcards:

```python
import osfrom pydantic import BaseModel, Fieldfrom list import List # Apenas se usar versões antigas do Python, caso contrário use list
from langchain_core.pydantic_v1 import BaseModel as BaseModelV1, Field as FieldV1
from langchain_community.llms import HuggingFaceEndpoint
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import JsonOutputParser

# 1. Configure seu token gratuito do Hugging Face
os.environ["HUGGINGFACEHUB_API_TOKEN"] = "seu_token_aqui_hf_..."

# 2. Defina o modelo Pydantic para a estrutura do JSON desejado
# # Nota: O LangChain prefere o pydantic v1 internamente para alguns parsers
class Flashcard(BaseModelV1):
    question: str = FieldV1(description="Uma pergunta detalhada e profunda sobre o conceito do material de estudo.")
    answer: str = FieldV1(description="A resposta completa, densa e explicativa para a pergunta formulada.")


class MaterialEstudo(BaseModelV1):
    materia: str = FieldV1(description="O nome da matéria ou disciplina principal.")
    tema: str = FieldV1(description="O tópico específico abordado no material.")
    flashcards: list[Flashcard] = FieldV1(description="Lista contendo múltiplos flashcards de estudo profundo.")

# 3. Inicialize o parser de saída JSON do LangChain
parser = JsonOutputParser(pydantic_object=MaterialEstudo)

# 4. Crie o Prompt injetando as instruções de formato do JSON automaticamente
prompt = PromptTemplate(
    template="Você é um professor especialista. Gere um material de estudo denso e aprofundado sobre o tema solicitado.\n{format_instructions}\nTema: {tema}\n",
    input_variables=["tema"],
    partial_variables={"format_instructions": parser.get_format_instructions()},
)

# 5. Conecte ao modelo do Hugging Face via API Gratuita (Serverless)
# # Passamos os parâmetros necessários para textos longos e baixa criatividade (para não quebrar o JSON)
llm = HuggingFaceEndpoint(
    repo_id="Qwen/Qwen2.5-74B-Instruct",
    task="text-generation",
    max_new_tokens=3000,          # Garante uma resposta longa e densa
    temperature=0.1,              # Quase zero para evitar erros de sintaxe no JSON
    top_p=0.9,
    return_full_text=False
)

# 6. Monte a sua Chain (Cadeia de execução)
chain = prompt | llm | parser

# 7. Execute o testetema_teste = "Princípios da Programação Orientada a Objetos (Encapsulamento e Polimorfismo)
try:
    resposta_json = chain.invoke({"tema": tema_teste})

    # O resultado já é um dicionário Python (JSON decodificado nativamente pelo LangChain)
    print("Méria:", resposta_json.get("materia"))
    print("Tema:", resposta_json.get("tema"))
    print("\n--- Flashcards Gerados ---")
    for idx, card in enumerate(resposta_json.get("flashcards", []), 1):
        print(f"\n[{idx}] Pergunta: {card['question']}")
        print(f"    Resposta: {card['answer']}")
except Exception as e:
    print(f"Erro na requisição ou no parse do JSON: {e}")
```

## Por que essa estrutura funciona melhor na API Gratuita?

1.  parser.get_format_instructions(): O LangChain injeta automaticamente no prompt um esquema descritivo do seu modelo Pydantic em formato JSON Schema. Isso ensina o modelo exatamente onde fechar cada chave e colchete.
2.  temperature=0.1: Força o modelo a ser extremamente determinístico. Como modelos geram JSON caractere por caractere, qualquer variação criativa da IA no meio do caminho poderia arruinar a estrutura do código.
3.  max_new_tokens=3000: Evita que a resposta seja cortada pela metade, um problema comum na Inference API gratuita que por padrão adota valores muito baixos.

---

Se você for testar esse fluxo, observe se a velocidade de resposta atende à dinâmica do seu projeto. Caso queira, posso te mostrar como adicionar uma camada de tratamento de erros (Retry) na Chain, para o caso de a API do Hugging Face falhar temporariamente por excesso de requisições. Gostaria de ver como estruturar isso?

## Resiliência

Para adicionar resiliência ao seu sistema de testes e lidar com os limites da API gratuita do Hugging Face (como o erro 429 Too Many Requests), a melhor prática no LangChain é utilizar o mecanismo nativo de Retry (tentativas automáticas) com Exponential Backoff (espera exponencial).
Isso significa que, se a API falhar ou bloquear a requisição temporariamente, o sistema esperará alguns segundos antes de tentar novamente, aumentando o tempo a cada falha até obter sucesso.

## Código com Camada de Tratamento de Erros (Retry)

Vamos envelopar a chamada do modelo usando o método .with_retry() do LangChain core. Certifique-se de instalar a biblioteca tenacity, que é a dependência padrão do LangChain para gerenciar retentativas:

```bash
pip install tenacity
```

Aqui está o código completo e atualizado:

```python
import os
from pydantic import BaseModel, Field  # Importação padrão do Pydantic moderno
from langchain_community.llms import HuggingFaceEndpoint
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import JsonOutputParser

# 1. Configuração do token
os.environ["HUGGINGFACEHUB_API_TOKEN"] = "seu*token_aqui_hf*..."

# 2. Definição do esquema dos Flashcards
class Flashcard(BaseModel):
    question: str = Field(description="Uma pergunta detalhada e profunda sobre o conceito do material de estudo.")
    answer: str = Field(description="A resposta completa, densa e explicativa para a pergunta formulada.")

class MaterialEstudo(BaseModel):
    materia: str = Field(description="O nome da matéria ou disciplina principal.")
    tema: str = Field(description="O tópico específico abordado no material.")
    flashcards: list[Flashcard] = Field(description="Lista contendo múltiplos flashcards de estudo profundo.")

# 3. Inicialização do parser JSON
parser = JsonOutputParser(pydantic_object=MaterialEstudo)

# 4. Criação do Prompt estruturado
prompt = PromptTemplate(
    template="Você é um professor especialista. Gere um material de estudo denso e aprofundado sobre o tema solicitado.\n{format_instructions}\nTema: {tema}\n",
    input_variables=["tema"],
    partial_variables={"format_instructions": parser.get_format_instructions()},

)

# 5. Configuração do modelo base do Hugging Face
llm_base = HuggingFaceEndpoint(
    repo_id="Qwen/Qwen2.5-74B-Instruct",
    task="text-generation",
    max_new_tokens=3000,
    temperature=0.1,
    top_p=0.9,
    return_full_text=False
)

# 6. Adicionando a camada de Resiliência (Retry Automático)
# # O método with_retry intercepta falhas de rede, limites (429) e erros de servidor (5xx)
llm_resiliente = llm_base.with_retry(
    stop_after_attempt=5,          # Tenta no máximo 5 vezes antes de desistir e lançar o erro definitivo
    wait_exponential_jitter=True   # Espera um tempo exponencial entre as tentativas (ex: 2s, 4s, 8s...) + variação aleatória

)

# 7. Montagem da Chain utilizando o LLM resiliente
chain = prompt | llm_resiliente | parser

# 8. Execução do teste com tratamento de exceção finaltema_teste = "Princípios da Programação Orientada a Objetos (Encapsulamento e Polimorfismo)"
try:
    print("Enviando requisição para o Hugging Face... (Aguarde, respostas densas podem demorar)")
    resposta_json = chain.invoke({"tema": tema_teste})

    print("\n✓ Sucesso! Dados recebidos e validados.")
    print("Matéria:", resposta_json.get("materia"))
    print("Tema:", resposta_json.get("tema"))
    print("\n--- Flashcards Gerados ---")
    for idx, card in enumerate(resposta_json.get("flashcards", []), 1):
        print(f"\n[{idx}] Pergunta: {card['question']}")
        print(f"    Resposta: {card['answer']}")
except Exception as e:
    # Se todas as 5 tentativas falharem, o código cai aqui
    print(f"\n✗ Falha definitiva após múltiplas tentativas.")
    print(f"Detalhes do erro: {e}")
```

## O que mudou com essa implementação?

- with_retry(): Esse método transforma o objeto do Hugging Face em um componente robusto. Ele monitora as chamadas de API de forma transparente para você.
- wait_exponential_jitter=True: Essencial para APIs gratuitas compartilhadas. Se o servidor do Hugging Face estiver sobrecarregado, o LangChain espera de forma inteligente, evitando enviar requisições repetidas no exato mesmo segundo, o que estenderia o seu bloqueio por IP/token.
- Preservação do Parser: O comportamento do JsonOutputParser continua intacto. Se o modelo falhar na primeira tentativa e acertar o JSON na segunda, o parser processará o resultado perfeitamente.

---

Seus testes agora estão protegidos contra quedas rápidas e limites severos. Se você quiser evoluir a arquitetura, eu posso te mostrar como criar uma rota alternativa (Fallback) usando outro modelo gratuito (como o Llama 3.3) caso o Qwen fique totalmente indisponível. Gostaria de adicionar essa redundância ao seu código?
