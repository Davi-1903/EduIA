# Guia: Configurando e Usando o Docker Model Runner (Windows e Linux)

## O que é

O Docker Model Runner (DMR) é a solução da Docker para rodar modelos de IA (LLMs e modelos de imagem) localmente, tratando modelos como artefatos de primeira classe no ecossistema Docker — assim como containers, imagens e volumes. Ele usa o llama.cpp como engine padrão (com suporte também a vLLM e Diffusers), expõe uma API compatível com OpenAI, Anthropic e Ollama, e permite baixar modelos do Docker Hub ou de qualquer registro compatível com OCI (incluindo Hugging Face).

Principais características:

- **Engines de inferência**: llama.cpp (padrão, todas as plataformas), vLLM (GPUs NVIDIA, Linux x86_64 e Windows com WSL2) e Diffusers (geração de imagens, GPUs NVIDIA no Linux).
- **API compatível** com OpenAI, Anthropic e Ollama.
- **Isolamento**: no Linux, o DMR e os engines rodam dentro de um container; no Windows/macOS, rodam em ambiente sandboxed (fora de um container, para acesso direto à GPU).

---

## 1. Instalação e habilitação

### No Windows (via Docker Desktop)

1. Instale ou atualize o **Docker Desktop** (versão 4.40 ou superior).
2. Abra **Settings > AI**.
3. Ative **Enable Docker Model Runner**.
4. Se você tiver uma GPU NVIDIA compatível, também aparecerá a opção **Enable GPU-backed inference** — ative para acelerar a inferência.
5. Opcional: para acessar a API a partir do host (fora de containers), ative **Enable host-side TCP support** e defina uma porta.
6. Se for usar um frontend web local, configure os domínios permitidos em **CORS Allows Origins**.

Teste a instalação:

```powershell
docker model version
docker model status
docker model --help
```

### No Linux (via Docker Engine)

No Linux, o DMR é instalado como um plugin do Docker Engine.

**Debian/Ubuntu (apt):**

```bash
sudo apt-get update
sudo apt-get install docker-model-plugin
docker model version
```

**Fedora/RHEL (dnf):**

```bash
sudo dnf update
sudo dnf install docker-model-plugin
docker model version
```

Se você ainda não tem o Docker Engine instalado:

```bash
curl -fsSL https://get.docker.com | sudo bash
sudo usermod -aG docker $USER   # dá permissão para acessar o daemon; faça logout/login depois
```

O suporte TCP já vem habilitado por padrão no Docker Engine, na porta **12434**.

Gerenciando o runner manualmente:

```bash
docker model install-runner     # instala o componente (roda implicitamente ao usar "docker model")
docker model start-runner
docker model status
docker model stop-runner
docker model restart-runner
docker model uninstall-runner   # remove as imagens, mantendo os modelos locais
docker model uninstall-runner --images --models   # remove tudo, incluindo modelos
```

### Alternativa: binário standalone (`dmr`)

Caso não queira instalar o Docker Desktop/Engine, existe o binário autocontido `dmr`, que já embute o daemon de inferência e a CLI:

```bash
# macOS (arm64)
brew install docker/tap/dmr

# Windows (amd64)
winget install Docker.dmr
```

No Linux, baixe o binário pré-compilado na página de releases do projeto ou compile a partir do código-fonte.

Uso básico:

```bash
dmr serve &            # inicia o daemon (porta 12434 por padrão)
dmr pull ai/gemma3
dmr run ai/gemma3 "Olá"
```

---

## 2. Comandos essenciais

```bash
# Buscar/baixar um modelo do Docker Hub (ou Hugging Face)
docker model pull ai/qwen2.5-coder

# Listar modelos baixados localmente
docker model list

# Rodar um modelo interativamente (baixa automaticamente se necessário)
docker model run ai/qwen2.5-coder

# Rodar com um prompt direto
docker model run ai/gemma3 "Explique o que é Docker em uma frase"

# Remover um modelo local
docker model rm ai/qwen2.5-coder
```

Você também pode pesquisar e baixar modelos pela interface do Docker Desktop: aba **Models > Docker Hub** (buscar e clicar em _Pull_) ou **Models > Local** (clicar no ícone de play para abrir um chat interativo).

---

## 3. Configuração do modelo

O tamanho de contexto (context size) e outros parâmetros de runtime podem ser ajustados por modelo:

```bash
docker model configure --context-size 8192 ai/qwen2.5-coder
```

O padrão varia por modelo, mas costuma ficar entre 2.048 e 8.192 tokens. Também é possível passar flags de runtime específicas do engine (ex.: `--no-prefill-assistant`) na configuração ou via Docker Compose.

---

## 4. Usando a API (OpenAI / Anthropic / Ollama compatível)

Depois de habilitado, o DMR expõe endpoints locais. A URL base depende de como você está chamando:

- **De dentro de um container**, use o hostname interno do Docker Desktop (ex.: `model-runner.docker.internal`).
- **Do host**, habilite o suporte TCP (Settings > AI, no Windows/macOS; já vem ativo por padrão no Linux) e use `http://localhost:12434`.

Exemplo com `curl` (formato OpenAI):

```bash
curl http://localhost:12434/engines/llama.cpp/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "ai/smollm2",
    "messages": [
      {"role": "system", "content": "Você é um assistente útil."},
      {"role": "user", "content": "Olá, tudo bem?"}
    ]
  }'
```

Outros endpoints úteis:

```bash
curl http://localhost:12434/models                     # lista modelos
curl http://localhost:12434/models/ai/smollm2           # detalhes de um modelo
curl -X DELETE http://localhost:12434/models/ai/smollm2 # remove um modelo
curl http://localhost:12434/metrics                     # métricas
```

Com o SDK da OpenAI em Python, basta apontar o `base_url` para o endpoint local do DMR:

```python
from openai import OpenAI

client = OpenAI(
    base_url="http://localhost:12434/engines/llama.cpp/v1",
    api_key="não-usado"
)

response = client.chat.completions.create(
    model="ai/smollm2",
    messages=[{"role": "user", "content": "Olá!"}]
)
print(response.choices[0].message.content)
```

**Atenção de segurança**: a API do Model Runner não é autenticada por padrão. Qualquer cliente que consiga alcançá-la (incluindo outros containers na mesma rede Docker) pode baixar, carregar e rodar modelos, além de enviar requisições de inferência. Evite expor a porta TCP publicamente sem uma camada adicional de proteção.

---

## 5. Integração com Docker Compose

O Docker Compose trata modelos como um recurso de primeira classe (`models:`):

```yaml
services:
  app:
    image: minha-app
    models:
      - llm
      - embedding-model

models:
  llm:
    model: ai/llama3.2
  embedding-model:
    model: ai/all-minilm
```

Você pode injetar a URL do modelo como variável de ambiente e configurar parâmetros como contexto e flags de runtime:

```yaml
services:
  app:
    image: minha-app
    environment:
      - LLM_URL=${LLM_URL}
    models:
      llm:
        endpoint_var: LLM_URL

models:
  llm:
    model: ai/llama3.2:3B-Q4_K_M
    context_size: 4096
    runtime_flags:
      - "--no-prefill-assistant"
```

Se estiver acessando o DMR via `model-runner.docker.internal` dentro de um projeto Compose e a interface `172.17.0.1` não estiver disponível, adicione:

```yaml
services:
  app:
    extra_hosts:
      - "model-runner.docker.internal:host-gateway"
```

Testcontainers (Java e Go) também têm suporte nativo ao Docker Model Runner.

---

## 6. Alterando a porta padrão

Por padrão, o Docker Model Runner expõe sua API na porta **12434** (TCP). Em ambos os sistemas é possível trocar essa porta — útil quando ela já está em uso por outro serviço ou por questões de organização/segurança.

### No Windows (Docker Desktop)

**Via interface gráfica:**

1. Abra **Settings > AI**.
2. Ative **Enable host-side TCP support**.
3. No campo **Port**, digite a nova porta desejada (ex.: `13434`).
4. Clique em **Apply & Restart**.

**Via CLI** (`docker desktop enable model-runner`):

```powershell
# Habilita/troca a porta TCP para 13434
docker desktop enable model-runner --tcp 13434

# Também é possível configurar o CORS na mesma chamada
docker desktop enable model-runner --tcp 13434 --cors all

# Para desabilitar o acesso TCP
docker desktop enable model-runner --no-tcp
```

Depois de trocar a porta, os endpoints passam a responder em `http://localhost:13434` (ao invés de `12434`).

### No Linux (Docker Engine)

No Docker Engine, a porta é definida no momento em que o runner é (re)instalado, usando o comando `docker model install-runner`:

```bash
# Desinstala o runner atual, mantendo os modelos baixados
docker model uninstall-runner

# Reinstala especificando a nova porta
docker model install-runner --port 13434

# Verifique se subiu na porta correta
docker model status
curl http://localhost:13434/models
```

Outras opções úteis do `install-runner` que podem ser combinadas com `--port`:

| Opção        | Padrão      | Descrição                                                      |
| ------------ | ----------- | -------------------------------------------------------------- |
| `--port`     | `12434`     | Porta TCP do container do Model Runner                         |
| `--host`     | `127.0.0.1` | Endereço de host onde o Model Runner escuta                    |
| `--gpu`      | `auto`      | Suporte a GPU (`none`, `auto`, `cuda`, `rocm`, `musa`, `cann`) |
| `--backend`  | `llama.cpp` | Engine padrão (`llama.cpp`, `vllm`, `diffusers`)               |
| `--tls`      | —           | Habilita TLS/HTTPS na API                                      |
| `--tls-port` | `12444`     | Porta usada quando o TLS está habilitado                       |

Exemplo combinando porta customizada e GPU:

```bash
docker model install-runner --port 13434 --gpu cuda
```

> **Dica:** se você só quer trocar a porta sem perder os modelos já baixados, use `docker model uninstall-runner` (sem `--models`) seguido de `docker model install-runner --port <nova-porta>` — os modelos locais são preservados.

---

## 7. GPU e engines avançados

- **llama.cpp**: engine padrão, funciona em todas as plataformas (CPU e GPU quando disponível).
- **vLLM**: requer GPU NVIDIA; suportado em Linux x86_64 e Windows com WSL2.
- **Diffusers** (geração de imagens): requer GPU NVIDIA, disponível apenas no Linux (x86_64 ou ARM64).

Exemplo de geração de imagem via Diffusers:

```bash
curl -s -X POST http://localhost:12434/engines/diffusers/v1/images/generations \
  -H "Content-Type: application/json" \
  -d '{
    "model": "stable-diffusion:Q4",
    "prompt": "Um gato fofo em estilo aquarela",
    "size": "512x512"
  }' | jq -r '.data[0].b64_json' | base64 -d > imagem.png
```

No Windows, para usar GPU, ative **Enable GPU-backed inference** nas configurações do Docker Desktop (requer NVIDIA GPU compatível).

---

## 8. Exemplo de código com LangChain

Como o DMR expõe uma API compatível com OpenAI, basta usar o pacote `langchain-openai` apontando o `base_url` para o endpoint local do Model Runner — sem precisar de uma chave de API real.

Instalação:

```bash
pip install langchain langchain-openai
```

Exemplo simples de chat:

```python
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage, SystemMessage

# Aponte para o endpoint do Docker Model Runner
# - Do host (Windows/Linux com TCP habilitado): http://localhost:12434/engines/v1
# - De dentro de um container (Docker Desktop): http://model-runner.docker.internal/engines/v1
llm = ChatOpenAI(
    base_url="http://localhost:12434/engines/v1",
    api_key="nao-utilizada",   # obrigatório para a lib, mas ignorado pelo DMR
    model="ai/qwen2.5-coder",
    temperature=0.7,
)

resposta = llm.invoke([
    SystemMessage(content="Você é um assistente técnico especialista em Docker."),
    HumanMessage(content="Explique em 2 frases o que é o Docker Model Runner."),
])

print(resposta.content)
```

Exemplo com uma chain simples usando `ChatPromptTemplate`:

```python
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

llm = ChatOpenAI(
    base_url="http://localhost:12434/engines/v1",
    api_key="nao-utilizada",
    model="ai/qwen2.5-coder",
)

prompt = ChatPromptTemplate.from_messages([
    ("system", "Você é um assistente que resume textos técnicos em português."),
    ("user", "Resuma o seguinte texto em até 3 tópicos:\n\n{texto}"),
])

chain = prompt | llm | StrOutputParser()

resultado = chain.invoke({
    "texto": "O Docker Model Runner permite rodar modelos de IA localmente, "
             "usando comandos familiares do Docker, com API compatível com OpenAI, "
             "Anthropic e Ollama, e suporte a GPU em Windows e Linux."
})

print(resultado)
```

Exemplo com streaming de resposta:

```python
for chunk in llm.stream([HumanMessage(content="Conte até 5, um número por linha.")]):
    print(chunk.content, end="", flush=True)
```

> **Observação**: o modelo precisa estar previamente baixado localmente (`docker model pull ai/qwen2.5-coder`) para que a chamada funcione. Se estiver rodando sua aplicação Python dentro de um container Docker Desktop, use `http://model-runner.docker.internal/engines/v1` como `base_url` em vez de `localhost`.

---

## 9. Solução de problemas comuns

| Problema                          | Solução                                                                                                                                                             |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `docker model` não é reconhecido  | Verifique se o Model Runner está habilitado (Desktop) ou se o plugin `docker-model-plugin` foi instalado (Linux). Se necessário, crie um symlink para o plugin CLI. |
| App não consegue acessar o modelo | Confirme se a chamada é do host ou de um container e use o endpoint correto; garanta que o suporte TCP está habilitado se for do host.                              |
| Primeira resposta demorada        | Normal — o modelo é carregado na memória no primeiro uso (on-demand loading); as próximas respostas são mais rápidas.                                               |
| GPU não está sendo usada          | Verifique drivers/backends e se o Docker Desktop tem permissão de usar a GPU; nem todos os modelos/quantizações usam GPU igualmente.                                |
| Atualizar o DMR no Docker Engine  | `docker model uninstall-runner --images && docker model install-runner`                                                                                             |

---

## 10. Quando usar o Docker Model Runner

- **Use o DMR** quando quiser desenvolvimento local-first, ambientes reprodutíveis e integração fácil com Compose, mantendo dados privados e custos de token baixos.
- **Use uma API remota** (OpenAI, Azure OpenAI etc.) quando precisar de modelos de última geração, escala maior, ou não houver restrição quanto a dados saírem do seu ambiente.
- **Use servidores dedicados** (vLLM standalone, text-generation-webui etc.) quando precisar de agendamento/batching avançado em hosts grandes e não houver problema em lidar com operação extra.

---

## Referências

- Documentação oficial: https://docs.docker.com/ai/model-runner/
- Guia de início rápido: https://docs.docker.com/ai/model-runner/get-started/
- Referência da API: https://docs.docker.com/ai/model-runner/api-reference/
- Repositório no GitHub: https://github.com/docker/model-runner
