from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .viewsets import BookViewSet, book_detail_page, book_search_page

router = DefaultRouter()
router.register(r'books', BookViewSet, basename='book')

urlpatterns = [
    # API routes - gives you /api/books/ and /api/books/{id}/
    path('api/', include(router.urls)),

    # Frontend routes
    path('books/search/', book_search_page, name='book-search-page'),
    path('books/<str:book_id>/', book_detail_page, name='book-detail-page'),
]
