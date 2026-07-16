FROM python:3.12-slim

WORKDIR /app

RUN pip install debugpy
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

CMD [ "python", "-m", "debugpy", "--listen", "0.0.0.0:5678", "--wait-for-client", "-m", "flask", "run", "--host=0.0.0.0" ]