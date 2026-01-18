from books.models import Book
from rest_framework import generics

from .serializers import BookSerializer


class BookApiView(generics.ListAPIView):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
# Create your views here.
