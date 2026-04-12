from books.models import Book
from books.serializers import genres_as_list
from rest_framework import serializers

from .models import BookShelfEntry


class BookSummarySerializer(serializers.ModelSerializer):
    genres = serializers.SerializerMethodField()

    class Meta:
        model = Book
        fields = ["id", "google_books_id", "title", "authors", "thumbnail",
                  "page_count", "genres", "average_rating"]

    def get_genres(self, obj):
        return genres_as_list(obj.genres)


class BookShelfEntrySerializer(serializers.ModelSerializer):
    book = BookSummarySerializer(read_only=True)
    book_id = serializers.PrimaryKeyRelatedField(
        queryset=Book.objects.all(), source="book", write_only=True
    )

    class Meta:
        model = BookShelfEntry
        fields = [
            "id",
            "book",
            "book_id",
            "status",
            "added_at",
            "updated_at",
            "allocated_at",
            "allocated_by",
        ]
        read_only_fields = ["id", "added_at", "updated_at", "allocated_at", "allocated_by"]


class SocialUpdateSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)
    message = serializers.SerializerMethodField()

    class Meta:
        model = BookShelfEntry
        fields = ["id", "username", "message", "updated_at"]

    def get_message(self, obj):
        return f"{obj.user.username} has added {obj.book.title} to their to read shelf"
