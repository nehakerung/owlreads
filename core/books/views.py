from django.shortcuts import render
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Book
from .serializers import BookSerializer
from .services.google_books import GoogleBooksService


# API Views (for REST endpoints)
class BookSearchView(APIView):
    def get(self, request):
        query = request.query_params.get('q', '')
        max_results = request.query_params.get('max_results', 10)

        if not query:
            return Response(
                {'error': 'Query parameter "q" is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        service = GoogleBooksService()
        data = service.search_books(query, max_results)

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


class BookDetailView(APIView):
    def get(self, request, book_id):
        service = GoogleBooksService()
        data = service.get_book_by_id(book_id)

        if 'error' in data:
            return Response(data, status=status.HTTP_404_NOT_FOUND)

        volume_info = data.get('volumeInfo', {})
        book_data = {
            'id': data.get('id'),
            'title': volume_info.get('title'),
            'authors': volume_info.get('authors', []),
            'description': volume_info.get('description', ''),
            'thumbnail': volume_info.get('imageLinks', {}).get('thumbnail', ''),
            'published_date': volume_info.get('publishedDate', '')
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
            data = service.search_books(query, max_results=20)

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
                'published_date': volume_info.get('publishedDate', ''),
                'publisher': volume_info.get('publisher', ''),
                'page_count': volume_info.get('pageCount', ''),
                'genres': volume_info.get('genres', []),
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


class SuggestedBooksView(APIView):
    """
    Suggest books from the local DB that share genres with the current book.
    Book.genres is a JSONField (list of strings), not a related Genre model.
    """

    def get(self, request):
        genres_param = request.query_params.get("genres", "")
        exclude_id = request.query_params.get("exclude")
        try:
            limit = max(1, min(int(request.query_params.get("limit", 10)), 50))
        except (TypeError, ValueError):
            limit = 10

        genre_list = [
            g.strip().lower() for g in genres_param.split(",") if g.strip()
        ]

        queryset = Book.objects.all()
        if exclude_id is not None and str(exclude_id).strip() != "":
            try:
                queryset = queryset.exclude(pk=int(exclude_id))
            except (TypeError, ValueError):
                pass

        if not genre_list:
            return Response([])

        genre_set = set(genre_list)
        scored = []
        for book in queryset.iterator(chunk_size=200):
            book_genres = {g.lower() for g in book.genre_list}
            overlap = genre_set & book_genres
            if overlap:
                scored.append((len(overlap), book.title, book))

        scored.sort(key=lambda row: (-row[0], row[1]))
        books = [b for _, _, b in scored[:limit]]

        serializer = BookSerializer(books, many=True)
        return Response(serializer.data)
