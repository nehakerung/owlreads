import time

import requests
from books.models import Book
from decouple import config
from django.core.management.base import BaseCommand

GOOGLE_BOOKS_API_KEY = GOOGLE_BOOKS_API_KEY = config('GOOGLE_BOOKS_API_KEY', default='')

BASE_URL = "https://www.googleapis.com/books/v1/volumes"
MAX_BOOKS = 100

QUERIES = [
    "subject:juvenile fiction",
    "subject:juvenile nonfiction",
    "subject:children fiction",
    "subject:picture books",
    "subject:young adult fiction",
]

ALLOWED_CATEGORIES = {"juvenile fiction", "juvenile nonfiction"}


def is_valid_book(volume_info):
    # Must be English
    if volume_info.get("language") != "en":
        return False

    # Must have at least one matching category
    categories = [c.lower() for c in volume_info.get("categories", [])]
    if not any(cat in ALLOWED_CATEGORIES for cat in categories):
        return False

    return True


def enrich_categories(volume_info):
    categories = volume_info.get("categories", [])
    desc = volume_info.get("description", "").lower()
    title = volume_info.get("title", "").lower()
    combined = desc + " " + title

    if any(word in combined for word in ["adventure", "quest", "journey"]):
        categories.append("Adventure")
    if any(word in combined for word in ["animal", "dog", "cat", "horse"]):
        categories.append("Animals")
    if any(word in combined for word in ["magic", "wizard", "fairy"]):
        categories.append("Fantasy")
    if any(word in combined for word in ["school", "classroom", "teacher"]):
        categories.append("School")

    return list(set(categories))


class Command(BaseCommand):
    help = "Seed the database with children's books from Google Books API"

    def handle(self, *args, **kwargs):
        total_saved = 0

        for query in QUERIES:
            if total_saved >= MAX_BOOKS:
                break

            start_index = 0

            while total_saved < MAX_BOOKS:
                self.stdout.write(f"Fetching '{query}' from index {start_index}...")

                params = {
                    "q": query,
                    "printType": "books",
                    "langRestrict": "en",
                    "maxResults": 40,
                    "startIndex": start_index,
                    "key": GOOGLE_BOOKS_API_KEY,
                }

                response = requests.get(BASE_URL, params=params)
                data = response.json()
                items = data.get("items", [])

                if not items:
                    break  # No more results for this query

                for item in items:
                    if total_saved >= MAX_BOOKS:
                        break

                    volume_info = item.get("volumeInfo", {})

                    if not is_valid_book(volume_info):
                        continue

                    authors = volume_info.get("authors", [])
                    thumbnail = volume_info.get("imageLinks", {}).get("thumbnail", "")

                    _, created = Book.objects.get_or_create(
                        google_books_id=item["id"],
                        defaults={
                            "title": volume_info.get("title", "Unknown Title"),
                            "authors": authors if authors else ["Unknown"],
                            "description": volume_info.get("description", ""),
                            "thumbnail": thumbnail.replace("http://", "https://", 1),
                            "page_count": volume_info.get("pageCount"),
                            "categories": enrich_categories(volume_info),
                            "subjects": volume_info.get("subject", []),
                            "average_rating": volume_info.get("averageRating"),
                            "ratings_count": volume_info.get("ratingsCount"),
                        }
                    )

                    if created:
                        total_saved += 1
                        self.stdout.write(f"  Saved ({total_saved}): {volume_info.get('title')}")

                start_index += 40
                time.sleep(0.5)  # Avoid hitting rate limits

        self.stdout.write(self.style.SUCCESS(f"Done. {total_saved} books saved."))
