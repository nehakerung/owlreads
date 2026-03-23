from rest_framework import serializers

from .models import Award, Collection


class AwardSerializer(serializers.ModelSerializer):
    award_display = serializers.CharField(source='get_award_type_display', read_only=True)

    class Meta:
        model = Award
        fields = ['id', 'award_type', 'award_display', 'earned_at']


class CollectionSerializer(serializers.ModelSerializer):
    awards = AwardSerializer(many=True, read_only=True)

    class Meta:
        model = Collection
        fields = ['id', 'awards', 'created_at']
