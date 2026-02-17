from django.contrib import admin
from django.urls import include, path

from owlreads.views import aboutpage, homepage

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', homepage, name='home'),
    path('about/', aboutpage, name='about'),

    # Auth routes
    path('api/auth/', include('users.urls')),

    # Books API + frontend
    path('', include('books.urls')),
]
