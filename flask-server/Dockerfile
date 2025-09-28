# Stage 1: Builder
FROM python:3.10-slim AS builder

RUN apt-get update && apt-get install -y \
    build-essential \
    poppler-utils \
    tesseract-ocr \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .

RUN pip wheel --default-timeout=200 --wheel-dir=/wheels -r requirements.txt

COPY . .

# Stage 2: Final minimal runtime image
FROM python:3.10-slim

RUN apt-get update && apt-get install -y \
    poppler-utils \
    tesseract-ocr \
    curl \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY --from=builder /wheels /wheels
COPY --from=builder /app/requirements.txt .
RUN pip install --default-timeout=100 --no-cache-dir --no-index --find-links=/wheels -r requirements.txt

COPY --from=builder /app /app

EXPOSE 5000

CMD ["gunicorn", "-c", "gunicorn.conf.py", "app:app"]
