# backend/Dockerfile

# Use an appropriate base image
FROM ghcr.io/astral-sh/uv:0.9.8-python3.13-bookworm-slim

WORKDIR /app

COPY . .

RUN uv sync

# Copy the rest of the application code

# Command to run the application
CMD ["uv", "run", "main.py"]
