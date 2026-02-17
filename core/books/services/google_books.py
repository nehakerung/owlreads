import requests
from django.conf import settings


class GoogleBooksService:
    BASE_URL = "https://www.googleapis.com/books/v1/volumes"

    def __init__(self):
        self.api_key = settings.GOOGLE_BOOKS_API_KEY

    def search_books(self, query, max_results=15):
        params = {
            'q': query,
            # googles api has a max limit of 40 results per request
            'maxResults': max_results,
            'key': self.api_key
        }

        try:
            response = requests.get(self.BASE_URL, params=params)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.HTTPError as e:
            return {'error': f'HTTP error: {e.response.status_code}'}
        except requests.exceptions.RequestException as e:
            return {'error': str(e)}

    def get_book_by_id(self, book_id):
        url = f"{self.BASE_URL}/{book_id}"
        params = {'key': self.api_key}

        try:
            response = requests.get(url, params=params)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.HTTPError as e:
            if e.response.status_code == 404:
                return {'error': f'Book with ID "{book_id}" not found'}
            return {'error': f'HTTP error: {e.response.status_code}'}
        except requests.exceptions.RequestException as e:
            return {'error': str(e)}
