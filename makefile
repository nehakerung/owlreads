.PHONY: install
install:
	poetry install

.PHONY: install-pre-commit
install-pre-commit:
	poetry run pre-commit uninstall; poetry run pre-commit install

.PHONY: lint
lint:
	poetry run pre-commit run --all-files

.PHONY: format
format:
	poetry run isort .

.PHONY: migrate
migrate:
	poetry run python core/manage.py makemigrations
	poetry run python core/manage.py migrate

.PHONY: migrations
migrations:
	poetry run python core/manage.py makemigrations

.PHONY: runserver
runserver:
	poetry run python core/manage.py runserver

.PHONY: superuser
superuser:
	poetry run python core/manage.py createsuperuser

.PHONY: update
update: install migrate ;

.PHONY: update
update: install migrate install-pre-commit ;
