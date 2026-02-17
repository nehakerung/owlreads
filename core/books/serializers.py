from rest_framework import serializers


class BookSerializer(serializers.Serializer):
    id = serializers.CharField()
    title = serializers.CharField()
    authors = serializers.ListField(child=serializers.CharField(), required=False)
    description = serializers.CharField(required=False, allow_blank=True)
    thumbnail = serializers.CharField(required=False, allow_blank=True)
    published_date = serializers.CharField(required=False, allow_blank=True)
    publisher = serializers.CharField(required=False, allow_blank=True)
    page_count = serializers.IntegerField(required=False, allow_null=True)
    categories = serializers.ListField(child=serializers.CharField(), required=False)
    language = serializers.CharField(required=False, allow_blank=True)
    preview_link = serializers.CharField(required=False, allow_blank=True)
    average_rating = serializers.FloatField(required=False, allow_null=True)
    ratings_count = serializers.IntegerField(required=False, allow_null=True)
