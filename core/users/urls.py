from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .views import (
    CreateStudentView, RegisterView, StudentListView, TeacherResetStudentPasswordView, UpdateUserView, UserDetailView
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('user/', UserDetailView.as_view(), name='user_detail'),
    path('user/update/', UpdateUserView.as_view(), name='user_update'),
    path('students/', CreateStudentView.as_view(), name='students'),
    path('students/list/', StudentListView.as_view(), name='student-list'),
    path(
        'students/<str:student_id>/reset-password/',
        TeacherResetStudentPasswordView.as_view(),
        name='teacher-reset-student-password',
    ),
]
