from django.urls import path

from . import views

urlpatterns = [
    path("shelf/", views.ShelfListView.as_view(), name="shelf-list"),
    path("shelf/add/", views.ShelfAddView.as_view(), name="shelf-add"),
    path("shelf/<int:entry_id>/update/", views.ShelfUpdateView.as_view(), name="shelf-update"),
    path("shelf/<int:entry_id>/remove/", views.ShelfRemoveView.as_view(), name="shelf-remove"),
]
