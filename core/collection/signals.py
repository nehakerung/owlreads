from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver

from .genre_slug import genre_to_slug
from .models import Award, Collection

BOOKS_AWARD_THRESHOLDS = {
    1: 'books_1',
    2: 'books_2',
    3: 'books_3',
    5: 'books_5',
    10: 'books_10',
}

GENRE_AWARD_PREFIX = 'genre__'


# Auto-create collection when user is created
@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_user_collection(sender, instance, created, **kwargs):
    if created:
        Collection.objects.create(user=instance)


def check_and_grant_awards(user):
    """Grant milestone and genre awards from current shelf; remove genre awards that no longer apply."""
    collection = user.collection
    completed_books = user.shelf_entries.filter(status='read').count()

    for threshold, award_type in BOOKS_AWARD_THRESHOLDS.items():
        if completed_books >= threshold:
            Award.objects.get_or_create(
                collection=collection,
                award_type=award_type
            )

    read_entries = user.shelf_entries.filter(status='read').select_related('book')
    earned_slugs = set()
    for entry in read_entries:
        for g in entry.book.genre_list:
            slug = genre_to_slug(g)
            if slug:
                earned_slugs.add(slug)

    expected_genre_types = [
        f'{GENRE_AWARD_PREFIX}{s}' for s in earned_slugs
    ]
    Award.objects.filter(
        collection=collection,
        award_type__startswith=GENRE_AWARD_PREFIX,
    ).exclude(award_type__in=expected_genre_types).delete()

    for slug in earned_slugs:
        Award.objects.get_or_create(
            collection=collection,
            award_type=f'{GENRE_AWARD_PREFIX}{slug}'
        )
