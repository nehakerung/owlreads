from django.apps import AppConfig


class BooksConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "core.books"

    def __str__(self):
        return self.title
