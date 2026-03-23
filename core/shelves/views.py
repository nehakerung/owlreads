from books.models import Book
from collection.signals import check_and_grant_awards
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
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
    """POST /api/allocate/ — teacher allocates a book to one of their students"""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if request.user.role != "teacher":
            return Response({"error": "Forbidden."}, status=status.HTTP_403_FORBIDDEN)

        student_id = request.data.get("student_id")
        book_id = request.data.get("book_id")

        if not student_id or not book_id:
            return Response(
                {"error": "student_id and book_id are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Ensure the student actually belongs to this teacher
        student = get_object_or_404(
            User,
            id=student_id,
            teacher=request.user,
            role="student",
        )

        book = get_object_or_404(Book, id=book_id)

        entry, created = BookShelfEntry.objects.get_or_create(
            user=student,
            book=book,
            defaults={
                "status": "to_read",
                "allocated_by": request.user,
            },
        )

        # Book was already on the student's shelf — just stamp allocated_by
        if not created and entry.allocated_by is None:
            entry.allocated_by = request.user
            entry.save(update_fields=["allocated_by", "updated_at"])

        serializer = BookShelfEntrySerializer(entry)
        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED if created else status.HTTP_200_OK,
        )


class DeallocateBookView(APIView):
    """DELETE /api/allocate/<entry_id>/ — teacher removes their allocation from a shelf entry"""
    permission_classes = [IsAuthenticated]

    def delete(self, request, entry_id):
        if request.user.role != "teacher":
            return Response({"error": "Forbidden."}, status=status.HTTP_403_FORBIDDEN)

        entry = get_object_or_404(
            BookShelfEntry,
            id=entry_id,
            allocated_by=request.user,
        )

        entry.allocated_by = None
        entry.save(update_fields=["allocated_by", "updated_at"])

        return Response(status=status.HTTP_204_NO_CONTENT)


class TeacherAllocationsView(APIView):
    """GET /api/allocations/ — all allocations this teacher has made, grouped by student"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != "teacher":
            return Response({"error": "Forbidden."}, status=status.HTTP_403_FORBIDDEN)

        entries = (
            BookShelfEntry.objects
            .filter(allocated_by=request.user)
            .select_related("user", "book")
            .order_by("user__first_name", "-updated_at")
        )

        grouped: dict = {}
        for entry in entries:
            key = str(entry.user.id)
            if key not in grouped:
                grouped[key] = {
                    "student_id": entry.user.id,
                    "student_name": entry.user.get_full_name(),
                    "username": entry.user.username,
                    "books": [],
                }
            grouped[key]["books"].append({
                "entry_id": entry.id,
                "book_id": entry.book.id,
                "title": entry.book.title,
                "status": entry.status,
                "allocated_at": entry.allocated_at,
            })

        return Response(list(grouped.values()))
