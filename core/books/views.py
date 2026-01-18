from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import BookSerializer
from .services.google_books import GoogleBooksService


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

        # Transform the data
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
