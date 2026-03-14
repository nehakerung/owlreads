
from django.contrib.auth import get_user_model
from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .permissions import IsTeacher
from .serializers import RegisterSerializer, ResetPasswordSerializer, StudentCreateSerializer, UserSerializer

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


class CreateStudentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if request.user.role != "teacher":
            return Response({"error": "Only teachers can create students"}, status=403)

        serializer = StudentCreateSerializer(data=request.data)  # Create instance with data

        if serializer.is_valid():                                 # Call on instance
            student = serializer.save()

            # Force role to student
            student.role = "student"
            student.save()

            return Response(serializer.data)                     # Use instance

        return Response(serializer.errors, status=400)           # Use instance
