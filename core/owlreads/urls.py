# core/owlreads/urls.py
from books.views import BookDetailView, BookSearchView, book_detail_page, book_search_page
from django.contrib import admin
from django.db import router
from django.urls import include, path
from users.views import login_view, logout_view, registerpage

from owlreads import views

urlpatterns = [
    path("admin/", admin.site.urls),
    path("", views.homepage, name="home"),
    path("about/", views.aboutpage, name="about"),

    # User routes
    path("users/", include("users.urls")),
    path("register/", registerpage, name="register"),
    path("login/", login_view, name="login"),
    path("logout/", logout_view, name="logout"),

    # Books frontend pages
    path("books/search/", book_search_page, name="book-search-page"),
    path("books/<str:book_id>/", book_detail_page, name="book-detail-page"),

    # API routes
    path("api/books/search/", BookSearchView.as_view(), name='book-search'),
    path("api/books/<str:book_id>/", BookDetailView.as_view(), name='book-detail'),
]
