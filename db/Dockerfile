FROM python:3.12-slim

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc g++ && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

RUN mkdir -p /app/static/audio/temp

COPY evals ./evals
COPY server.py .
COPY my-recommendation-app/dist /app/static/frontend

EXPOSE 8000

RUN echo '#!/bin/sh\nPORT=${PORT:-8000}\nexec uvicorn server:app --host 0.0.0.0 --port "$PORT"' > /app/start.sh && chmod +x /app/start.sh

CMD ["/app/start.sh"]
