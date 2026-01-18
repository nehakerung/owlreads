from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient


class BookAPITestCase(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_book_search(self):
        url = reverse('book-search')
        response = self.client.get(url, {'q': 'django'})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsInstance(response.data, list)

    def test_book_detail(self):
        url = reverse('book-detail', kwargs={'book_id': 'zjnwDwAAQBAJ'})
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('title', response.data)
