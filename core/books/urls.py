from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import BookListView, SuggestedBooksView
from .viewsets import BookViewSet, book_detail_page, book_search_page

router = DefaultRouter()
router.register(r'books', BookViewSet, basename='book')

urlpatterns = [
    # Must be before router so /api/books/suggestions/ is not captured as /api/books/<pk>/
    path(
        "api/books/suggestions/",
        SuggestedBooksView.as_view(),
        name="book-suggestions",
    ),
    # API routes - gives /api/books/ and /api/books/{id}/
    path("api/", include(router.urls)),

    # Frontend routes
    path("books/search/", book_search_page, name="book-search-page"),
    path("books/<str:book_id>/", book_detail_page, name="book-detail-page"),
    path("api/books/", BookListView.as_view(), name="book-list"),
]
