from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Collection
from .serializers import CollectionSerializer


class CollectionView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        collection, _ = Collection.objects.get_or_create(user=request.user)
        serializer = CollectionSerializer(collection)
        return Response(serializer.data)