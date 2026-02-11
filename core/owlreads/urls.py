# TODO: Investigate if images work better for views or viewsets - for now views loads more images
from books.viewsets import BookViewSet, book_detail_page, book_search_page
from django.contrib import admin
from django.urls import include, path
from rest_framework.routers import DefaultRouter
from users.views import login_view, logout_view, registerpage

from owlreads.views import aboutpage, homepage

# API Router
router = DefaultRouter()
router.register(r'books', BookViewSet, basename='book')

urlpatterns = [
    path('api/', include(router.urls)),
    path("admin/", admin.site.urls),
    path("", homepage, name="home"),
    path("about/", aboutpage, name="about"),

    # User routes
    path("users/", include("users.urls")),
    path("register/", registerpage, name="register"),
    path("login/", login_view, name="login"),
    path("logout/", logout_view, name="logout"),

    # Books frontend pages
    path("books/search/", book_search_page, name="book-search-page"),
    path("books/<str:book_id>/", book_detail_page, name="book-detail-page"),


    # Template views (if you still need them)
    path('search/', book_search_page, name='book_search'),
    path('detail/<str:book_id>/', book_detail_page, name='book_detail'),
]
