from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import SuggestedBooksView
from .viewsets import BookViewSet, ReviewViewSet, book_detail_page, book_search_page

router = DefaultRouter()
router.register(r'books', BookViewSet, basename='book')
router.register(r'reviews', ReviewViewSet, basename='review')

urlpatterns = [
    path(
        "api/books/suggestions/",
        SuggestedBooksView.as_view(),
        name="book-suggestions",
    ),
    path("api/", include(router.urls)),
    path("books/search/", book_search_page, name="book-search-page"),
    path("books/<str:book_id>/", book_detail_page, name="book-detail-page"),
]
