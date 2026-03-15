from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .views import CreateStudentView, RegisterView, UpdateUserView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('user/', UpdateUserView.as_view(), name='user_detail'),  # ← replaces UserDetailView
    path('students/', CreateStudentView.as_view(), name='students'),
]
