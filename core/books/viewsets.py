from django.db.models import Q
from django.shortcuts import render
from rest_framework import status, viewsets
from rest_framework.response import Response

from .models import Book
from .serializers import BookSerializer


class BookViewSet(viewsets.ViewSet):

    def list(self, request):
        """
        Search books from your own database
        GET /api/books/?q=harry
        """
        query = request.query_params.get('q', '')

        if not query:
            # Return all books if no query provided
            books = Book.objects.all()
        else:
            books = Book.objects.filter(
                Q(title__icontains=query)

                | Q(author__icontains=query)

                | Q(description__icontains=query)
            )

        serializer = BookSerializer(books, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        """
        Retrieve a single book by its database ID
        GET /api/books/{id}/
        """
        try:
            book = Book.objects.get(pk=pk)
        except Book.DoesNotExist:
            return Response(
                {'error': f'Book {pk} not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = BookSerializer(book)
        return Response(serializer.data)


# Template Views (for frontend pages)
def book_search_page(request):
    """Render the book search page with results"""
    query = request.GET.get('q', '')
    books = []
    error = None

    if query:
        books = Book.objects.filter(
            Q(title__icontains=query)

            | Q(author__icontains=query)

            | Q(description__icontains=query)
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
    """Render the book detail page"""
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
