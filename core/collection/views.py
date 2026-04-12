from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .genre_catalog import genre_slug_to_label_map
from .models import Collection
from .serializers import CollectionSerializer
from .signals import check_and_grant_awards


class CollectionView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        collection, _ = Collection.objects.get_or_create(user=request.user)
        check_and_grant_awards(request.user)
        label_map = genre_slug_to_label_map()
        serializer = CollectionSerializer(
            collection,
            context={'genre_label_by_slug': label_map},
        )
        return Response(serializer.data)
