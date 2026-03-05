from books.models import Book
from django.shortcuts import get_object_or_404
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import BookShelfEntry
from .serializers import BookShelfEntrySerializer


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
        return Response(BookShelfEntrySerializer(entry).data)


class ShelfRemoveView(APIView):
    """DELETE /api/shelf/<entry_id>/remove/ — remove a book from shelf"""
    permission_classes = [IsAuthenticated]

    def delete(self, request, entry_id):
        entry = get_object_or_404(BookShelfEntry, id=entry_id, user=request.user)
        entry.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
