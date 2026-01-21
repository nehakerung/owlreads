from books.views import BookDetailView
from rest_framework import routers

router = routers.SimpleRouter()

router.register(r'book', BookDetailView, basename='book')

urlpatterns = router.urls