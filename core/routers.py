from books import viewsets
from rest_framework.routers import DefaultRouter

# API Router
router = DefaultRouter()
router.register(r'books', viewsets.BookViewSet, basename='book')

urlpatterns = router.urls
