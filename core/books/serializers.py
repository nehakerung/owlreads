from rest_framework import serializers

from .models import Book, Review


def genres_as_list(value):
    """Normalize model CharField or API dict list/string into a list of genre strings."""
    if value is None:
        return []
    if isinstance(value, list):
        return [str(x).strip() for x in value if str(x).strip()]
    s = str(value).strip()
    if not s:
        return []
    return [x.strip() for x in s.split(",") if x.strip()]


class BookSerializer(serializers.Serializer):
    id = serializers.CharField()
    title = serializers.CharField()
    authors = serializers.ListField(child=serializers.CharField(), required=False)
    description = serializers.CharField(required=False, allow_blank=True)
    thumbnail = serializers.CharField(required=False, allow_blank=True)
    published_date = serializers.CharField(required=False, allow_blank=True)
    publisher = serializers.CharField(required=False, allow_blank=True)
    page_count = serializers.IntegerField(required=False, allow_null=True)
    genres = serializers.SerializerMethodField()
    language = serializers.CharField(required=False, allow_blank=True)
    preview_link = serializers.CharField(required=False, allow_blank=True)
    average_rating = serializers.FloatField(required=False, allow_null=True)
    ratings_count = serializers.IntegerField(required=False, allow_null=True)

    def get_genres(self, obj):
        if isinstance(obj, dict):
            return genres_as_list(obj.get("genres"))
        if isinstance(obj, Book):
            return obj.genre_list
        return genres_as_list(getattr(obj, "genres", None))


class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ['id', 'book', 'name', 'role', 'rating', 'comment', 'created_at']
