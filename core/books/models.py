from django.db import models


class Book(models.Model):
    google_books_id = models.CharField(max_length=20, unique=True)
    title = models.CharField(max_length=200)
    authors = models.JSONField(default=list)
    description = models.TextField(blank=True)
    thumbnail = models.URLField(blank=True)
    page_count = models.IntegerField(null=True, blank=True)
    categories = models.JSONField(default=list)
    genres = models.JSONField(default=list)
    average_rating = models.FloatField(null=True, blank=True)
    ratings_count = models.IntegerField(null=True, blank=True)

    @property
    def genre_list(self):
        g = self.genres
        if isinstance(g, list):
            return [str(x).strip() for x in g if str(x).strip()]
        if isinstance(g, str) and g.strip():
            return [x.strip() for x in g.split(",") if x.strip()]
        return []

    def __str__(self):
        return self.title


class Review(models.Model):
    book = models.ForeignKey(
        Book,
        on_delete=models.CASCADE,
        related_name='reviews',
        null=True,
        blank=True,
    )
    name = models.CharField(max_length=100)
    role = models.CharField(max_length=100, blank=True)
    rating = models.PositiveSmallIntegerField()
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        constraints = [
            models.CheckConstraint(
                check=models.Q(rating__gte=1, rating__lte=5),
                name='website_review_rating_1_5',
            )
        ]

    def __str__(self):
        return f'{self.name} ({self.rating}/5)'
