from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import Award, Collection


# Auto-create collection when user is created
@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_user_collection(sender, instance, created, **kwargs):
    if created:
        Collection.objects.create(user=instance)


# Check and grant awards based on completed books
def check_and_grant_awards(user):
    completed_books = user.shelf_entries.filter(status='read').count()  # ← 'read' not 'completed'
    collection = user.collection

    award_map = {
        1: 'books_1',
        2: 'books_2',
        3: 'books_3',
        5: 'books_5',
        10: 'books_10',
    }

    for threshold, award_type in award_map.items():
        if completed_books >= threshold:
            Award.objects.get_or_create(
                collection=collection,
                award_type=award_type
            )
