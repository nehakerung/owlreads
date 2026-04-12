import re
import unicodedata


def genre_to_slug(genre: str) -> str:
    """Match frontend `genreToSlug` in `frontend/src/lib/genreSlug.ts`."""
    s = genre.strip().lower()
    s = unicodedata.normalize("NFD", s)
    s = "".join(c for c in s if unicodedata.category(c) != "Mn")
    s = re.sub(r"[^a-z0-9]+", "-", s)
    s = re.sub(r"^-|-$", "", s)
    return s
