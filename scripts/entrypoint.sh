#!/usr/bin/env bash

set -e

RUN_MANAGE_PY='poetry run python -m core.manage.py'

echo 'Collecting static files...'
cd /opt/core
python manage.py collectstatic --noinput

echo 'Running database migrations...'
cd /opt/core
python manage.py migrate --no-input

exec poetry run daphne -b 0.0.0.0 -p 8000 core.owlreads.asgi:application

echo "PWD:"
pwd
echo "Python path:"
python -c "import sys; print(sys.path)"
