from auth.views import LogoutView
from books.viewsets import book_detail_page, book_search_page
from django.contrib import admin
from django.urls import include, path
from routers import router
from users.views import login_view, logout_view, registerpage

from owlreads.views import aboutpage, homepage

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

    # Djoser URLs
    path("auth/", include("djoser.urls")),
    path("auth/", include("djoser.urls.jwt")),
    path("auth/logout/", LogoutView.as_view()),
]
