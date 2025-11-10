# backend/Dockerfile

# Use an appropriate base image
FROM python:3.13-slim

# Install dependencies
RUN apt-get update && apt-get install -y \
    uv

WORKDIR /app

COPY . .

RUN uv sync

# Copy the rest of the application code

# Command to run the application
CMD ["uv", "run", "main.py"]