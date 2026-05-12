from django.db.models import Q
from django.shortcuts import render
from rest_framework import status, viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.response import Response

from .models import Book, Review
from .serializers import BookSerializer, ReviewSerializer


class BookViewSet(viewsets.ViewSet):

    def list(self, request):
        query = request.query_params.get('q', '')

        if not query:
            books = Book.objects.all()
        else:
            books = Book.objects.filter(
                Q(title__icontains=query)
                | Q(authors__icontains=query)
                | Q(description__icontains=query)
            )

        serializer = BookSerializer(books, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        try:
            book = Book.objects.get(pk=pk)
        except Book.DoesNotExist:
            return Response(
                {'error': f'Book {pk} not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = BookSerializer(book)
        return Response(serializer.data)


class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        queryset = Review.objects.all()
        book_id = self.request.query_params.get('book')
        if book_id:
            queryset = queryset.filter(book_id=book_id)
        return queryset


def book_search_page(request):
    query = request.GET.get('q', '')
    books = []
    error = None

    if query:
        books = Book.objects.filter(
            Q(title__icontains=query) |
            Q(description__icontains=query) |
            Q(authors__icontains=query)
        )
    else:
        books = Book.objects.all()

    context = {
        'query': query,
        'books': books,
        'error': error
    }

    return render(request, 'books/book_search.html', context)


def book_detail_page(request, book_id):
    book = None
    error = None

    try:
        book = Book.objects.get(pk=book_id)
    except Book.DoesNotExist:
        error = f'Book {book_id} not found'

    context = {
        'book': book,
        'error': error
    }

    return render(request, 'books/book_detail.html', context)
