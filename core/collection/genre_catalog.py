from books.models import Book

from .genre_slug import genre_to_slug


def _genres_from_json(genres_json):
    if not genres_json:
        return []
    if isinstance(genres_json, list):
        return [str(x).strip() for x in genres_json if str(x).strip()]
    if isinstance(genres_json, str) and genres_json.strip():
        return [x.strip() for x in genres_json.split(",") if x.strip()]
    return []


def genre_slug_to_label_map():
    """One display label per slug (first seen wins) for all genres stored on books."""
    slug_to_label = {}
    for genres_json in Book.objects.values_list("genres", flat=True):
        for g in _genres_from_json(genres_json):
            slug = genre_to_slug(g)
            if slug:
                slug_to_label.setdefault(slug, g)
    return slug_to_label


def catalog_genres_payload():
    """Sorted list of {slug, label} for API consumers."""
    m = genre_slug_to_label_map()
    return [
        {"slug": slug, "label": m[slug]}
        for slug in sorted(m.keys(), key=lambda s: m[s].lower())
    ]
