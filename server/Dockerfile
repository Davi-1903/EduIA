# ============================< Build >============================
FROM python:3.12-slim AS builder

ARG HF_EMBEDDING_MODEL
ENV HF_HOME=/models \
    HF_HUB_DISABLE_PROGRESS_BARS=1

WORKDIR /app

RUN test -n "$HF_EMBEDDING_MODEL" || (echo "ERRO: HF_EMBEDDING_MODEL nao definido" >&2 && exit 1)
RUN pip install --no-cache-dir --user huggingface_hub
RUN python -c "import os; from huggingface_hub import snapshot_download; snapshot_download(os.environ['HF_EMBEDDING_MODEL'])"

RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc g++ libffi-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir --user \
    --index-url https://download.pytorch.org/whl/cpu \
    --no-deps torch==2.14.1
RUN pip install --no-cache-dir --user --root-user-action=ignore -r requirements.txt

# ============================< Final >============================
FROM python:3.12-slim

ARG HF_EMBEDDING_MODEL
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PATH=/root/.local/bin:$PATH \
    HF_HOME=/models \
    HF_HUB_OFFLINE=1 \
    TRANSFORMERS_OFFLINE=1 \
    HF_EMBEDDING_MODEL=${HF_EMBEDDING_MODEL}

WORKDIR /app

COPY --from=builder /root/.local /root/.local
COPY --from=builder /models /models
COPY . .

EXPOSE 5000
VOLUME /models

CMD [ "gunicorn", "-b", "0.0.0.0:5000", "app:app", "--timeout", "300" ]