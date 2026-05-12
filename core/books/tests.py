from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient

from .models import Book


class BookAPITestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.book = Book.objects.create(
            google_books_id="seed-1",
            title="Test Book",
            authors=["A. Author"],
        )

    def test_book_list(self):
        url = reverse("book-list")
        response = self.client.get(url, {"q": "Test"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsInstance(response.data, list)

    def test_book_detail(self):
        url = reverse("book-detail", kwargs={"pk": self.book.pk})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("title", response.data)
