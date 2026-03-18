FROM python:3.13-alpine

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Install system deps
RUN apk add --no-cache build-base

# Install poetry
RUN pip install poetry

# Copy dependency files
COPY pyproject.toml poetry.lock /app/backend/

# Set working dir for poetry
WORKDIR /app/backend

RUN poetry install --no-root

# Copy project
COPY ./core /app/backend
COPY ./docker /app/docker