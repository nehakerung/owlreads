from django.urls import path

from . import views

urlpatterns = [
    path("shelf/", views.ShelfListView.as_view(), name="shelf-list"),
    path("shelf/add/", views.ShelfAddView.as_view(), name="shelf-add"),
    path("shelf/<int:entry_id>/update/", views.ShelfUpdateView.as_view(), name="shelf-update"),
    path("shelf/<int:entry_id>/remove/", views.ShelfRemoveView.as_view(), name="shelf-remove"),
    path("social/", views.SocialFeedView.as_view(), name="social-feed"),
    path("allocate/", views.AllocateBookView.as_view(), name="allocate-book"),
    path("allocate/<int:entry_id>/", views.AllocateBookView.as_view(), name="deallocate-book"),
    path("allocations/", views.TeacherAllocationsListView.as_view(), name="teacher-allocations-list"),
    path("allocations/<int:entry_id>/", views.TeacherAllocationDetailView.as_view(), name="teacher-allocation-detail"),
]
