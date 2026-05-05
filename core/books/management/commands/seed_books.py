import random
import time

import requests
from books.models import Book
from decouple import config
from django.core.management.base import BaseCommand

GOOGLE_BOOKS_API_KEY = config('GOOGLE_BOOKS_API_KEY', default='')

BASE_URL = "https://www.googleapis.com/books/v1/volumes"
MAX_BOOKS = 1500

# Broader, more popular-focused queries with known children's authors/series
QUERIES = [
    "subject:juvenile fiction",
    "subject:juvenile nonfiction",
    "subject:picture books",
    "Harry Potter children",
    "Diary of a Wimpy Kid",
    "Magic Tree House",
    "Captain Underpants",
    "Roald Dahl",
    "Dr. Seuss",
    "Junie B. Jones",
    "Percy Jackson children",
    "Goosebumps children",
    "Rainbow Magic children",
    "Geronimo Stilton",
    "Big Nate children",
    "Wimpy Kid children",
    "Rick Riordan children",
    "Michael Morpurgo",
    "Biff, Chip and Kipper books",
    "Louis Sachar children",
    "Anne Fine children",
    "C.S. Lewis children",
    "Horrible Histories children",
    "children bestseller fiction",
    "children bestseller adventure",
    "children classic fiction",
]

# Shuffle queries each run for randomness
random.shuffle(QUERIES)

# Broad category keywords — if ANY of these appear anywhere in the category string, accept the book
ALLOWED_CATEGORY_KEYWORDS = {
    "juvenile",
    "children",
    "picture book",
    "young adult",
    "kids",
    "middle grade",
    "ages",
    "early reader",
    "beginner",
    "fiction",       # catches "juvenile fiction", "children's fiction", etc.
    "nonfiction",
}

# Block adult/irrelevant content even if it slips through
BLOCKED_CATEGORY_KEYWORDS = {
    "adult",
    "erotica",
    "crime",
    "thriller",
    "horror",
    "political",
    "military",
    "business",
    "computing",
    "medical",
}


def is_valid_book(volume_info):
    # Must be English
    if volume_info.get("language") != "en":
        return False

    # Must have a title
    if not volume_info.get("title"):
        return False

    categories = [c.lower() for c in volume_info.get("categories", [])]
    category_str = " ".join(categories)

    # Block explicitly adult/irrelevant categories
    if any(blocked in category_str for blocked in BLOCKED_CATEGORY_KEYWORDS):
        return False

    # Accept if any allowed keyword appears in any category
    if any(kw in category_str for kw in ALLOWED_CATEGORY_KEYWORDS):
        return True

    return False


def enrich_genres(volume_info):
    genres = volume_info.get("genres", [])
    desc = volume_info.get("description", "").lower()
    title = volume_info.get("title", "").lower()
    combined = desc + " " + title

    enrichments = {
        "Adventure": ["adventure", "quest", "journey", "explore"],
        "Animals": ["animal", "dog", "cat", "horse", "rabbit", "bear", "lion"],
        "Fantasy": ["magic", "wizard", "fairy", "dragon", "enchant", "spell"],
        "School": ["school", "classroom", "teacher", "homework", "recess"],
        "Friendship": ["friend", "friendship", "best friend", "buddy"],
        "Family": ["family", "sister", "brother", "mum", "mom", "dad", "parent"],
        "Humor": ["funny", "hilarious", "laugh", "silly", "comedy", "joke"],
        "Mystery": ["mystery", "detective", "clue", "solve", "secret"],
        "Science": ["science", "experiment", "discovery", "nature", "space"],
        "Sports": ["sport", "soccer", "football", "basketball", "baseball", "swim"],
    }

    for tag, keywords in enrichments.items():
        if any(word in combined for word in keywords):
            genres.append(tag)

    return list(set(genres))


class Command(BaseCommand):
    help = "Seed the database with popular children's books from Google Books API"

    def handle(self, *args, **kwargs):  # noqa: C901
        total_saved = 0
        seen_ids = set(Book.objects.values_list("google_books_id", flat=True))

        for query in QUERIES:
            if total_saved >= MAX_BOOKS:
                break

            # Randomise the start index slightly so we don't always get the same top results
            start_index = random.choice([0, 0, 0, 40])  # Bias toward index 0 (most relevant)

            consecutive_empty = 0

            while total_saved < MAX_BOOKS:
                self.stdout.write(f"Fetching '{query}' from index {start_index}...")

                params = {
                    "q": query,
                    "printType": "books",
                    "langRestrict": "en",
                    "maxResults": 40,
                    "startIndex": start_index,
                    "orderBy": "relevance",  # Surface popular/relevant titles
                    "key": GOOGLE_BOOKS_API_KEY,
                }

                try:
                    response = requests.get(BASE_URL, params=params, timeout=10)
                    response.raise_for_status()
                    data = response.json()
                except Exception as e:
                    self.stdout.write(self.style.WARNING(f"  Request failed: {e}"))
                    break

                items = data.get("items", [])

                if not items:
                    consecutive_empty += 1
                    if consecutive_empty >= 2:
                        break  # Give up on this query after 2 empty pages
                    start_index += 40
                    continue

                consecutive_empty = 0

                # Shuffle items within each page for randomness
                random.shuffle(items)

                for item in items:
                    if total_saved >= MAX_BOOKS:
                        break

                    book_id = item.get("id")
                    if not book_id or book_id in seen_ids:
                        continue

                    volume_info = item.get("volumeInfo", {})

                    if not is_valid_book(volume_info):
                        continue

                    authors = volume_info.get("authors", [])
                    thumbnail = volume_info.get("imageLinks", {}).get("thumbnail", "")

                    _, created = Book.objects.get_or_create(
                        google_books_id=book_id,
                        defaults={
                            "title": volume_info.get("title", "Unknown Title"),
                            "authors": authors if authors else ["Unknown"],
                            "description": volume_info.get("description", ""),
                            "thumbnail": thumbnail.replace("http://", "https://", 1) if thumbnail else "",
                            "page_count": volume_info.get("pageCount"),
                            "categories": volume_info.get("categories") or [],
                            "genres": enrich_genres(volume_info),
                            "average_rating": volume_info.get("averageRating"),
                            "ratings_count": volume_info.get("ratingsCount"),
                        }
                    )

                    if created:
                        seen_ids.add(book_id)
                        total_saved += 1
                        self.stdout.write(f"  Saved ({total_saved}): {volume_info.get('title')}")

                start_index += 40
                time.sleep(0.3)  # Avoid hitting rate limits

        self.stdout.write(self.style.SUCCESS(f"Done. {total_saved} books saved."))
