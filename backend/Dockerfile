# backend/Dockerfile

# Use an appropriate base image
FROM ghcr.io/astral-sh/uv:0.9.8-python3.13-bookworm-slim

WORKDIR /app

RUN apt update && apt install -y curl

COPY pyproject.toml ./

RUN uv sync

COPY . .

CMD ["uv", "run", "main.py"]