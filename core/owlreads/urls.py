from django.contrib import admin
from django.urls import include, path

from core.books.views import bookslist
from core.users.views import login_view, logout_view, registerpage

from . import views

urlpatterns = [
    path("admin/", admin.site.urls),
    path("", views.homepage, name="home"),
    path("about/", views.aboutpage, name="about"),
    path("users/", include("core.users.urls")),
    path("register/", registerpage, name="register"),
    path("login/", login_view, name="login"),
    path("logout/", logout_view, name="logout"),
    path("books/", bookslist, name="books-list"),
    path("api/", include("core.api.urls")),
]
