FROM python:3.13-bullseye

WORKDIR /opt

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PYTHONPATH=.
ENV CORESETTINGS_IN_DOCKER=true

# install dependencies
RUN set -xe \
    && apt-get update \
    && apt-get install -y --no-install-recommends build-essential \
    && pip install poetry==2.2.0 \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/

# Copy and install Python dependencies
COPY ["poetry.lock", "pyproject.toml", "./"]
RUN poetry config virtualenvs.create false \
    && poetry install --no-root

# Copy project files
COPY ["README.md", "makefile", "./"]
COPY core core
COPY local local


EXPOSE 8000

COPY scripts/entrypoint.sh /entrypoint.sh
RUN chmod a+x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
