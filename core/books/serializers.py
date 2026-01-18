from rest_framework import serializers


class BookSerializer(serializers.Serializer):
    # A003 class attribute "id" is shadowing a Python builtin
    # id = serializers.CharField()
    title = serializers.CharField()
    authors = serializers.ListField(child=serializers.CharField(), required=False)
    description = serializers.CharField(required=False)
    thumbnail = serializers.URLField(required=False)
    published_date = serializers.CharField(required=False)
