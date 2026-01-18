import requests
from django.conf import settings


class GoogleBooksService:
    BASE_URL = "https://www.googleapis.com/books/v1/volumes"

    def __init__(self):
        self.api_key = settings.GOOGLE_BOOKS_API_KEY

    def search_books(self, query, max_results=10):
        params = {
            'q': query,
            'maxResults': max_results,
            'key': self.api_key
        }

        try:
            response = requests.get(self.BASE_URL, params=params)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            return {'error': str(e)}

    def get_book_by_id(self, book_id):
        url = f"{self.BASE_URL}/{book_id}"
        params = {'key': self.api_key}

        try:
            response = requests.get(url, params=params)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            return {'error': str(e)}
