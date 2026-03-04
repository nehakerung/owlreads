from books.models import Book
from django.conf import settings
from django.db import models


class BookShelfEntry(models.Model):
    STATUS_CHOICES = [
        ("to_read", "To Read"),
        ("reading", "Reading"),
        ("read", "Read"),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="shelf_entries"
    )
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name="shelf_entries")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="to_read")
    added_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("user", "book")
        ordering = ["-updated_at"]

    def __str__(self):
        return f"{self.user.username} — {self.book.title} [{self.status}]"
