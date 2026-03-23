from django.conf import settings
from django.db import models


class Collection(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='collection'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username}'s collection"


class Award(models.Model):
    AWARD_CHOICES = [
        ('books_1', 'First Book Completed'),
        ('books_2', '2 Books Completed'),
        ('books_3', '3 Books Completed'),
        ('books_5', '5 Books Completed'),
        ('books_10', '10 Books Completed'),
    ]

    collection = models.ForeignKey(
        Collection,
        on_delete=models.CASCADE,
        related_name='awards'
    )
    award_type = models.CharField(max_length=50, choices=AWARD_CHOICES)
    earned_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['collection', 'award_type']  # can't earn same award twice

    def __str__(self):
        return f"{self.collection.user.username} - {self.award_type}"