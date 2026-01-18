from django.urls import path

from .views import BookDetailView, BookSearchView

urlpatterns = [
    path('books/search/', BookSearchView.as_view(), name='book-search'),
    path('books/<str:book_id>/', BookDetailView.as_view(), name='book-detail'),
]
