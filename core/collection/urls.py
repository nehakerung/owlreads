from django.urls import path

from .views import CollectionView, PublicUserCollectionView

urlpatterns = [
    path('', CollectionView.as_view(), name='collection'),
    path(
        'users/<str:lookup>/',
        PublicUserCollectionView.as_view(),
        name='public-user-collection',
    ),
]
