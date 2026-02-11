from django.shortcuts import render
from rest_framework import status, viewsets
from rest_framework.response import Response

from .serializers import BookSerializer
from .services.google_books import GoogleBooksService


class BookViewSet(viewsets.ViewSet):
    """
    ViewSet for managing book search and details via Google Books API
    """

    def list(self, request):
        """
        List books based on search query
        """
        query = request.query_params.get('q', '')
        # To change when adding pagination

        if not query:
            return Response(
                {'error': 'Query parameter "q" is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        service = GoogleBooksService()
        data = service.search_books(query)

        if 'error' in data:
            return Response(data, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        books = []
        for item in data.get('items', []):
            volume_info = item.get('volumeInfo', {})
            books.append({
                'id': item.get('id'),
                'title': volume_info.get('title'),
                'authors': volume_info.get('authors', []),
                'description': volume_info.get('description', ''),
                'thumbnail': volume_info.get('imageLinks', {}).get('thumbnail', ''),
                'published_date': volume_info.get('publishedDate', '')
            })

        serializer = BookSerializer(books, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        """
        Retrieve a single book by ID
        GET /api/books/{book_id}/
        """
        service = GoogleBooksService()
        data = service.get_book_by_id(pk)

        if 'error' in data:
            return Response(data, status=status.HTTP_404_NOT_FOUND)

        volume_info = data.get('volumeInfo', {})
        book_data = {
            'id': data.get('id'),
            'title': volume_info.get('title'),
            'authors': volume_info.get('authors', []),
            'description': volume_info.get('description', ''),
            'thumbnail': volume_info.get('imageLinks', {}).get('thumbnail', ''),
            'published_date': volume_info.get('publishedDate', ''),
            'page_count': volume_info.get('pageCount', ''),
            'categories': volume_info.get('categories', []),
            'average_rating': volume_info.get('averageRating', ''),
            'ratings_count': volume_info.get('ratingsCount', ''),
            'preview_link': volume_info.get('previewLink', '')
        }

        serializer = BookSerializer(book_data)
        return Response(serializer.data)


# Template Views (for frontend pages)
def book_search_page(request):
    """Render the book search page with results"""
    query = request.GET.get('q', '')
    books = []
    error = None

    if query:
        try:
            service = GoogleBooksService()
            data = service.search_books(query)

            if 'error' in data:
                error = data['error']
            else:
                for item in data.get('items', []):
                    volume_info = item.get('volumeInfo', {})
                    books.append({
                        'id': item.get('id'),
                        'title': volume_info.get('title', 'Unknown Title'),
                        'authors': volume_info.get('authors', []),
                        'description': volume_info.get('description', ''),
                        'thumbnail': volume_info.get('imageLinks', {}).get('thumbnail', ''),
                        'published_date': volume_info.get('publishedDate', '')
                    })
        except Exception as e:
            error = f"An error occurred: {str(e)}"

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
        service = GoogleBooksService()
        data = service.get_book_by_id(book_id)

        if 'error' in data:
            error = data['error']
        else:
            volume_info = data.get('volumeInfo', {})
            book = {
                'id': data.get('id'),
                'title': volume_info.get('title', 'Unknown Title'),
                'authors': volume_info.get('authors', []),
                'description': volume_info.get('description', ''),
                'thumbnail': volume_info.get('imageLinks', {}).get('thumbnail', ''),
                'page_count': volume_info.get('pageCount', ''),
                'categories': volume_info.get('categories', []),
                'average_rating': volume_info.get('averageRating', ''),
                'ratings_count': volume_info.get('ratingsCount', ''),
                'preview_link': volume_info.get('previewLink', '')
            }
    except Exception as e:
        error = f"An error occurred: {str(e)}"

    context = {
        'book': book,
        'error': error
    }

    return render(request, 'books/book_detail.html', context)
