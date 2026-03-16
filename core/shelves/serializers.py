from books.models import Book
from rest_framework import serializers

from .models import BookShelfEntry


class BookSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = ["id", "google_books_id", "title", "authors", "thumbnail",
                  "page_count", "categories", "average_rating"]


class BookShelfEntrySerializer(serializers.ModelSerializer):
    book = BookSummarySerializer(read_only=True)
    book_id = serializers.PrimaryKeyRelatedField(
        queryset=Book.objects.all(), source="book", write_only=True
    )

    class Meta:
        model = BookShelfEntry
        fields = ["id", "book", "book_id", "status", "added_at", "updated_at"]
        read_only_fields = ["id", "added_at", "updated_at"]
