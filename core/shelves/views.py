from books.models import Book
from collection.signals import check_and_grant_awards
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import BookShelfEntry
from .serializers import BookShelfEntrySerializer

User = get_user_model()


# ---------------------------------------------------------------------------
# Shelf views (unchanged)
# ---------------------------------------------------------------------------

class ShelfListView(generics.ListAPIView):
    """GET /api/shelf/ — returns all shelf entries for the logged-in user"""
    serializer_class = BookShelfEntrySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        qs = BookShelfEntry.objects.filter(user=self.request.user).select_related("book")
        status_filter = self.request.query_params.get("status")
        if status_filter:
            qs = qs.filter(status=status_filter)
        return qs


class ShelfAddView(APIView):
    """POST /api/shelf/add/ — add a book to shelf or update its status"""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        book_id = request.data.get("book_id")
        status_value = request.data.get("status", "to_read")

        if not book_id:
            return Response({"error": "book_id is required"}, status=status.HTTP_400_BAD_REQUEST)

        book = get_object_or_404(Book, id=book_id)

        entry, created = BookShelfEntry.objects.update_or_create(
            user=request.user,
            book=book,
            defaults={"status": status_value},
        )

        if status_value == "read":
            check_and_grant_awards(request.user)

        serializer = BookShelfEntrySerializer(entry)
        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED if created else status.HTTP_200_OK,
        )


class ShelfUpdateView(APIView):
    """PATCH /api/shelf/<entry_id>/update/ — change status of an existing entry"""
    permission_classes = [IsAuthenticated]

    def patch(self, request, entry_id):
        entry = get_object_or_404(BookShelfEntry, id=entry_id, user=request.user)
        new_status = request.data.get("status")

        if new_status not in dict(BookShelfEntry.STATUS_CHOICES):
            return Response({"error": "Invalid status"}, status=status.HTTP_400_BAD_REQUEST)

        entry.status = new_status
        entry.save()

        if new_status == "read":
            check_and_grant_awards(request.user)

        return Response(BookShelfEntrySerializer(entry).data)


class ShelfRemoveView(APIView):
    """DELETE /api/shelf/<entry_id>/remove/ — remove a book from shelf"""
    permission_classes = [IsAuthenticated]

    def delete(self, request, entry_id):
        entry = get_object_or_404(BookShelfEntry, id=entry_id, user=request.user)
        entry.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# ---------------------------------------------------------------------------
# Allocation views
# ---------------------------------------------------------------------------

class TeacherStudentListView(generics.ListAPIView):
    """GET /api/teacher/students/ — returns the teacher's students for the allocate dropdown"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != "teacher":
            return Response({"error": "Forbidden."}, status=status.HTTP_403_FORBIDDEN)

        students = (
            request.user.students
            .filter(role="student")
            .values("id", "first_name", "last_name", "username")
        )

        data = [
            {
                "id": s["id"],
                "username": s["username"],
                "full_name": f"{s['first_name']} {s['last_name']}".strip(),
            }
            for s in students
        ]

        return Response(data)


class AllocateBookView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != "teacher":
            return Response({"error": "Forbidden"}, status=403)

        book_id = request.query_params.get("book_id")
        if not book_id:
            return Response({"error": "book_id is required"}, status=400)

        allocated_entries = BookShelfEntry.objects.filter(
            book_id=book_id,
            user__teacher=request.user,
            user__role="student",
            allocated_by=request.user,
        ).select_related("user")

        data = [
            {
                "entry_id": entry.id,
                "student_id": entry.user_id,
                "student_name": f"{entry.user.first_name} {entry.user.last_name}".strip()
                or entry.user.username,
                "allocated_at": entry.allocated_at.isoformat() if entry.allocated_at else None,
            }
            for entry in allocated_entries
        ]

        return Response(
            {
                "book_id": int(book_id),
                "allocated": data,
                "student_ids": [item["student_id"] for item in data],
            },
            status=200,
        )

    def post(self, request):
        if request.user.role != "teacher":
            return Response({"error": "Forbidden"}, status=403)

        book_id = request.data.get("book_id")
        student_ids = request.data.get("student_ids", [])

        if not book_id or not student_ids:
            return Response(
                {"error": "book_id and student_ids required"},
                status=400
            )

        book = get_object_or_404(Book, id=book_id)

        allocated_entries = []

        for student_id in student_ids:
            student = get_object_or_404(
                User,
                id=student_id,
                teacher=request.user,
                role="student"
            )

            entry, created = BookShelfEntry.objects.get_or_create(
                user=student,
                book=book,
                defaults={
                    "status": "to_read",
                },
            )

            # Always update allocation info
            entry.allocated_by = request.user

            # OPTIONAL (recommended)
            if hasattr(entry, "allocated_at"):
                entry.allocated_at = timezone.now()

            entry.save()

            allocated_entries.append({
                "entry_id": entry.id,
                "student_id": student.id,
            })

        allocated_timestamp = timezone.now()
        return Response(
            {
                "allocated": allocated_entries,
                "allocated_at": allocated_timestamp.isoformat(),
            },
            status=200,
        )

    def delete(self, request, entry_id):
        if request.user.role != "teacher":
            return Response({"error": "Forbidden"}, status=403)

        entry = get_object_or_404(
            BookShelfEntry,
            id=entry_id,
            allocated_by=request.user
        )

        entry.allocated_by = None
        entry.save(update_fields=["allocated_by", "updated_at"])

        return Response(status=204)
