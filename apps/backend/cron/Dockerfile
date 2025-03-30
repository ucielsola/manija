FROM python:3.11-slim

# Evita warnings por stdin/stdout
ENV PYTHONUNBUFFERED=1

# Instala dependencias
RUN pip install yt-dlp psycopg2-binary

WORKDIR /app

COPY . .

CMD ["python", "update.py"]