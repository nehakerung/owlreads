from django.db import models


class Book(models.Model):
    google_books_id = models.CharField(max_length=20, unique=True)
    title = models.CharField(max_length=200)
    authors = models.JSONField(default=list)
    description = models.TextField(blank=True)
    thumbnail = models.URLField(blank=True)
    page_count = models.IntegerField(null=True, blank=True)
    categories = models.JSONField(default=list)
    average_rating = models.FloatField(null=True, blank=True)
    ratings_count = models.IntegerField(null=True, blank=True)

    def __str__(self):
        return self.title
