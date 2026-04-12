from rest_framework import serializers

from .genre_catalog import catalog_genres_payload
from .models import Award, Collection
from .signals import GENRE_AWARD_PREFIX

MILESTONE_DISPLAY = {
    'books_1': 'First Book Completed',
    'books_2': '2 Books Completed',
    'books_3': '3 Books Completed',
    'books_5': '5 Books Completed',
    'books_10': '10 Books Completed',
}


class AwardSerializer(serializers.ModelSerializer):
    award_display = serializers.SerializerMethodField()

    class Meta:
        model = Award
        fields = ['id', 'award_type', 'award_display', 'earned_at']

    def get_award_display(self, obj):
        if obj.award_type.startswith(GENRE_AWARD_PREFIX):
            slug = obj.award_type[len(GENRE_AWARD_PREFIX):]
            labels = self.context.get('genre_label_by_slug') or {}
            label = labels.get(slug)
            if label:
                return f'{label} — genre medal'
            return f'{slug.replace("-", " ").title()} — genre medal'
        return MILESTONE_DISPLAY.get(obj.award_type, obj.award_type)


class CollectionSerializer(serializers.ModelSerializer):
    awards = AwardSerializer(many=True, read_only=True)
    catalog_genres = serializers.SerializerMethodField()

    class Meta:
        model = Collection
        fields = ['id', 'awards', 'catalog_genres', 'created_at']

    def get_catalog_genres(self, obj):
        return catalog_genres_payload()
