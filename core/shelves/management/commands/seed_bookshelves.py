import random

from books.models import Book
from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand
from shelves.models import BookShelfEntry  # adjust import path if needed

User = get_user_model()

# ------------------------------------------------------------------
# Tuning knobs
# ------------------------------------------------------------------

BOOK_ID_MAX = 1000

# How many shelf entries to create per user
TEACHER_BOOK_COUNT = 40

# Students get a random count within this range
STUDENT_BOOK_COUNT_MIN = 5
STUDENT_BOOK_COUNT_MAX = 20

# Weighted probability for each status (to_read, reading, read)
# Weights don't have to sum to 100 — random.choices handles that
STATUS_WEIGHTS = {
    "to_read": 30,
    "reading": 10,   # realistically only a few books at once
    "read": 60,
}


class Command(BaseCommand):
    help = (
        "Seeds BookShelfEntry rows for the seeded teacher and their students. "
        "Books are picked at random from IDs 1–1000 (skipping missing ones). "
        "Run seed_classroom first so the users exist."
    )

    def add_arguments(self, parser):
        parser.add_argument(
            "--clear",
            action="store_true",
            help="Delete all existing shelf entries for seeded users before re-seeding.",
        )
        parser.add_argument(
            "--teacher",
            default="teacher_smith",
            help="Username of the teacher to seed (default: teacher_smith).",
        )

    def handle(self, *args, **options):
        teacher_username = options["teacher"]

        try:
            teacher = User.objects.get(username=teacher_username, role="teacher")
        except User.DoesNotExist:
            self.stdout.write(self.style.ERROR(
                f"Teacher '{teacher_username}' not found. Run seed_classroom first."
            ))
            return

        students = list(teacher.students.filter(role="student"))

        if not students:
            self.stdout.write(self.style.ERROR(
                "No students found linked to this teacher. Run seed_classroom first."
            ))
            return

        if options["clear"]:
            self._clear_entries(teacher, students)

        # Pre-fetch all valid book IDs once so we never hit missing PKs
        valid_ids = list(
            Book.objects.filter(id__lte=BOOK_ID_MAX).values_list("id", flat=True)
        )

        if not valid_ids:
            self.stdout.write(self.style.ERROR(
                "No books found in the database. Seed books first."
            ))
            return

        self.stdout.write(f"  📚 {len(valid_ids)} books available (IDs up to {BOOK_ID_MAX}).\n")

        total = 0
        total += self._seed_user(teacher, valid_ids, TEACHER_BOOK_COUNT, "👩‍🏫 Teacher")

        for student in students:
            count = random.randint(STUDENT_BOOK_COUNT_MIN, STUDENT_BOOK_COUNT_MAX)
            total += self._seed_user(student, valid_ids, count, "🎒 Student")

        self.stdout.write(self.style.SUCCESS(
            f"\n✅ Done! Created {total} shelf entries across "
            f"1 teacher + {len(students)} students."
        ))

    # ------------------------------------------------------------------
    # Private helpers
    # ------------------------------------------------------------------

    def _clear_entries(self, teacher, students):
        all_users = [teacher] + students
        deleted, _ = BookShelfEntry.objects.filter(user__in=all_users).delete()
        self.stdout.write(self.style.WARNING(f"🗑  Cleared {deleted} existing shelf entries.\n"))

    def _seed_user(self, user, valid_ids, target_count, label):
        # How many entries does this user already have?
        existing_book_ids = set(
            BookShelfEntry.objects.filter(user=user).values_list("book_id", flat=True)
        )

        # Books not yet on their shelf
        available_ids = [i for i in valid_ids if i not in existing_book_ids]

        if not available_ids:
            self.stdout.write(f"  {label} '{user.username}': shelf already full — skipping.")
            return 0

        # Don't ask for more books than exist
        actual_count = min(target_count, len(available_ids))
        chosen_ids = random.sample(available_ids, actual_count)

        statuses = random.choices(
            population=list(STATUS_WEIGHTS.keys()),
            weights=list(STATUS_WEIGHTS.values()),
            k=actual_count,
        )

        entries = [
            BookShelfEntry(user=user, book_id=book_id, status=status)
            for book_id, status in zip(chosen_ids, statuses)
        ]

        BookShelfEntry.objects.bulk_create(entries, ignore_conflicts=True)

        status_summary = _summarise_statuses(statuses)
        self.stdout.write(
            f"  {label} '{user.username}': "
            f"{actual_count} books added  {status_summary}"
        )

        return actual_count


def _summarise_statuses(statuses):
    counts = {s: statuses.count(s) for s in STATUS_WEIGHTS}
    return (
        f"[read: {counts['read']}  "
        f"reading: {counts['reading']}  "
        f"to_read: {counts['to_read']}]"
    )
