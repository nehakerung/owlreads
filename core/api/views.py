from rest_framework import generics

from core.books.models import Book

from .serializers import BookSerializer


class BookApiView(generics.ListAPIView):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
# Create your views here.
