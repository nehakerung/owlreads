
from django.contrib.auth import get_user_model
from rest_framework import generics
from rest_framework.exceptions import PermissionDenied
from rest_framework.generics import RetrieveUpdateAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .permissions import IsTeacher
from .serializers import (
    CreateStudentSerializer, RegisterSerializer, ResetPasswordSerializer, UpdateUserSerializer, UserSerializer
)

User = get_user_model()


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer


class UserDetailView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)


class TeacherResetStudentPasswordView(APIView):
    permission_classes = [IsAuthenticated, IsTeacher]

    def post(self, request, user_id):
        try:
            student = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=404)

        if not student.is_student:  # cleaner if you add property
            return Response({"error": "You can only reset student passwords"}, status=403)

        serializer = ResetPasswordSerializer(data=request.data)
        if serializer.is_valid():
            student.set_password(serializer.validated_data['new_password'])
            student.save()
            return Response({"message": "Password reset successful"})

        return Response(serializer.errors, status=400)


class UpdateUserView(RetrieveUpdateAPIView):
    serializer_class = UpdateUserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user  # always edits the logged-in user


class CreateStudentView(generics.CreateAPIView):
    serializer_class = CreateStudentSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        if not self.request.user.is_teacher:
            raise PermissionDenied("Only teachers can create student accounts")
        serializer.save()


class StudentListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if not request.user.is_teacher:
            raise PermissionDenied("Only teachers can view students")
        students = User.objects.filter(teacher=request.user)
        serializer = UserSerializer(students, many=True)
        return Response(serializer.data)
