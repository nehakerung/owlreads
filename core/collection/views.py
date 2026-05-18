from django.contrib.auth import get_user_model
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .genre_catalog import genre_slug_to_label_map
from .models import Collection
from .serializers import CollectionSerializer
from .signals import check_and_grant_awards

User = get_user_model()


def _user_from_lookup(lookup):
    user = User.objects.filter(username=lookup).first()
    if user is None and lookup.isdigit():
        user = User.objects.filter(pk=int(lookup)).first()
    return user


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


class PublicUserCollectionView(APIView):
    """Any authenticated user can view another user's collection awards."""

    permission_classes = [IsAuthenticated]

    def get(self, request, lookup):
        user = _user_from_lookup(lookup)
        if user is None:
            return Response({"detail": "User not found."}, status=404)

        collection, _ = Collection.objects.get_or_create(user=user)
        label_map = genre_slug_to_label_map()
        serializer = CollectionSerializer(
            collection,
            context={'genre_label_by_slug': label_map},
        )
        return Response(serializer.data)
