from datetime import timedelta

from books.models import Book
from collection.signals import check_and_grant_awards
from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand
from django.utils import timezone
from shelves.models import BookShelfEntry

User = get_user_model()

SHARED_PASSWORD = "Password123!"

TEACHER = {
    "username": "demo_teacher",
    "email": "demo.teacher@owlreads.test",
    "first_name": "Alex",
    "last_name": "Rivera",
    "classname": "Year 5 · OwlReads Demo",
    "teachername": "Mr Rivera",
}

STUDENTS = [
    {
        "first_name": "Maya",
        "last_name": "Chen",
        "student_id": "DEMO001",
        "shelf": [
            {"book_index": 0, "status": "read"},
            {"book_index": 1, "status": "read"},
            {"book_index": 2, "status": "read"},
            {"book_index": 3, "status": "read"},
            {"book_index": 4, "status": "read"},
            {"book_index": 5, "status": "reading"},
            {"book_index": 6, "status": "to_read", "updated_days_ago": 0},
        ],
    },
    {
        "first_name": "Leo",
        "last_name": "Patel",
        "student_id": "DEMO002",
        "shelf": [
            {"book_index": 7, "status": "read"},
            {"book_index": 8, "status": "read"},
            {"book_index": 9, "status": "reading", "updated_days_ago": 0},
        ],
    },
    {
        "first_name": "Ava",
        "last_name": "Johnson",
        "student_id": "DEMO003",
        "shelf": [
            {"book_index": 10, "status": "to_read", "updated_days_ago": 0},
            {"book_index": 11, "status": "to_read", "updated_days_ago": 0},
        ],
    },
    {
        "first_name": "Noah",
        "last_name": "Williams",
        "student_id": "DEMO004",
        "shelf": [
            {"book_index": 12, "status": "to_read", "allocated": True, "updated_days_ago": 1},
            {"book_index": 13, "status": "read", "allocated": True, "updated_days_ago": 2},
        ],
    },
    {
        "first_name": "Emma",
        "last_name": "Brown",
        "student_id": "DEMO005",
        "shelf": [],
    },
    {
        "first_name": "Sam",
        "last_name": "Taylor",
        "student_id": "DEMO006",
        "shelf": [
            {"book_index": 14, "status": "read", "updated_days_ago": 1},
            {"book_index": 15, "status": "to_read", "updated_days_ago": 1},
        ],
    },
]

# Minimal shelf templates reused for the extra class members.
_SHELF_EMPTY = []
_SHELF_ONE_TO_READ = [{"book_index": 0, "status": "to_read", "updated_days_ago": 2}]
_SHELF_ONE_READ = [{"book_index": 1, "status": "read", "updated_days_ago": 4}]
_SHELF_TWO_MIXED = [
    {"book_index": 2, "status": "read", "updated_days_ago": 5},
    {"book_index": 3, "status": "to_read", "updated_days_ago": 3},
]

_BULK_STUDENT_NAMES = [
    ("George", "Green"),
    ("Hannah", "Hill"),
    ("Ivan", "Ingram"),
    ("Julia", "Jones"),
    ("Kevin", "King"),
    ("Laura", "Lewis"),
    ("Marcus", "Moore"),
    ("Nina", "Nash"),
    ("Oliver", "Owen"),
    ("Petra", "Price"),
    ("Quinn", "Quinn"),
    ("Rachel", "Reed"),
    ("Samuel", "Scott"),
    ("Tina", "Taylor"),
    ("Uma", "Underwood"),
    ("Victor", "Vance"),
]

_BULK_SHELF_CYCLE = [
    _SHELF_EMPTY,
    _SHELF_ONE_TO_READ,
    _SHELF_ONE_READ,
    _SHELF_TWO_MIXED,
]

STUDENTS.extend(
    {
        "first_name": first_name,
        "last_name": last_name,
        "student_id": f"DEMO{index:03d}",
        "shelf": list(_BULK_SHELF_CYCLE[(index - 7) % len(_BULK_SHELF_CYCLE)]),
    }
    for index, (first_name, last_name) in enumerate(_BULK_STUDENT_NAMES, start=7)
)

# Teacher shelf — all users have shelf so this exists
TEACHER_SHELF = [
]


class Command(BaseCommand):
    help = (
        "Seeds a demo teacher, 22 students, and bookshelf data for presentations. "
        "Requires books in the database (run seed_books first)."
    )

    def add_arguments(self, parser):
        parser.add_argument(
            "--clear",
            action="store_true",
            help="Remove demo users and their shelf data before re-seeding.",
        )
        parser.add_argument(
            "--users-only",
            action="store_true",
            help="Create users only; skip bookshelf and awards.",
        )

    def handle(self, *args, **options):
        if options["clear"]:
            self._clear_demo_data()

        teacher = self._create_teacher()
        students = self._create_students(teacher)

        if options["users_only"]:
            self._print_summary(teacher, skipped_shelf=True)
            return

        books = self._load_books(min_count=19)
        if not books:
            self.stdout.write(self.style.ERROR(
                "No books in the database. Run: poetry run python core/manage.py seed_books"
            ))
            self._print_summary(teacher, skipped_shelf=True)
            return

        self._seed_teacher_shelf(teacher, books)
        for student_data, student in zip(STUDENTS, students, strict=True):
            self._seed_student_shelf(teacher, student, student_data["shelf"], books)

        self.stdout.write(self.style.SUCCESS("\nDemo bookshelf and awards ready."))
        self._print_summary(teacher)

    def _clear_demo_data(self):
        usernames = [TEACHER["username"]] + [
            self._student_username(s) for s in STUDENTS
        ]
        users = User.objects.filter(username__in=usernames)
        count = users.count()
        users.delete()
        self.stdout.write(self.style.WARNING(f"Cleared {count} demo user(s) and related data."))

    def _create_teacher(self):
        username = TEACHER["username"]
        if User.objects.filter(username=username).exists():
            teacher = User.objects.get(username=username)
            self.stdout.write(f"  Teacher '{username}' already exists — reusing.")
            return teacher

        teacher = User.objects.create_user(
            username=username,
            email=TEACHER["email"],
            password=SHARED_PASSWORD,
            first_name=TEACHER["first_name"],
            last_name=TEACHER["last_name"],
            role="teacher",
            classname=TEACHER["classname"],
            teachername=TEACHER["teachername"],
        )
        self.stdout.write(f"  Created teacher: {teacher.username}")
        return teacher

    def _create_students(self, teacher):
        created = []
        for student_data in STUDENTS:
            username = self._student_username(student_data)
            if User.objects.filter(username=username).exists():
                student = User.objects.get(username=username)
                self.stdout.write(f"  Student '{username}' already exists — reusing.")
                created.append(student)
                continue

            student = User.objects.create_user(
                username=username,
                email="",
                password=SHARED_PASSWORD,
                first_name=student_data["first_name"],
                last_name=student_data["last_name"],
                role="student",
                classname=teacher.classname,
                teachername=teacher.teachername,
                teacher=teacher,
                student_id=student_data["student_id"],
            )
            if student_data["student_id"] <= "DEMO006":
                self.stdout.write(
                    f"  Created student [{student_data['student_id']}]: "
                    f"{student.get_full_name()} ({username})"
                )
            created.append(student)
        bulk_created = sum(1 for s in STUDENTS if s["student_id"] > "DEMO006")
        if bulk_created:
            self.stdout.write(f"  … {bulk_created} additional class members (DEMO007–DEMO022)")
        return created

    def _load_books(self, min_count):
        books = list(Book.objects.order_by("id")[: max(min_count, 50)])
        if len(books) < min_count:
            self.stdout.write(self.style.WARNING(
                f"  Only {len(books)} book(s) found; demo will use whatever is available."
            ))
        return books

    def _seed_teacher_shelf(self, teacher, books):
        BookShelfEntry.objects.filter(user=teacher).delete()
        for spec in TEACHER_SHELF:
            book = books[spec["book_index"] % len(books)]
            BookShelfEntry.objects.create(
                user=teacher,
                book=book,
                status=spec["status"],
            )
        self.stdout.write(f"  Teacher shelf: {len(TEACHER_SHELF)} books")

    def _seed_student_shelf(self, teacher, student, shelf_specs, books):
        BookShelfEntry.objects.filter(user=student).delete()
        now = timezone.now()

        for spec in shelf_specs:
            book = books[spec["book_index"] % len(books)]
            days_ago = spec.get("updated_days_ago", 3)
            updated_at = now - timedelta(days=days_ago)

            entry = BookShelfEntry.objects.create(
                user=student,
                book=book,
                status=spec["status"],
            )

            update_fields = {"updated_at": updated_at}
            if spec.get("allocated"):
                update_fields["allocated_by_id"] = teacher.id
                update_fields["allocated_at"] = now - timedelta(days=days_ago)
            BookShelfEntry.objects.filter(pk=entry.pk).update(**update_fields)

        if any(s["status"] == "read" for s in shelf_specs):
            check_and_grant_awards(student)

        if student.student_id and student.student_id <= "DEMO006":
            read_count = sum(1 for s in shelf_specs if s["status"] == "read")
            self.stdout.write(
                f"  {student.username}: {len(shelf_specs)} shelf entries "
                f"({read_count} read)"
            )

    def _print_summary(self, teacher, *, skipped_shelf=False):
        lines = [
            "",
            "=" * 60,
            "  OwlReads demo class — login credentials",
            "=" * 60,
            f"  Class:     {teacher.classname}",
            f"  Password:  {SHARED_PASSWORD}  (all accounts)",
            "",
            f"  Teacher:   {teacher.username}  ({teacher.email})",
            "",
            "  Students:",
        ]
        for student_data in STUDENTS[:6]:
            username = self._student_username(student_data)
            lines.append(
                f"    {student_data['student_id']}  {username:16}  "
                f"{student_data['first_name']} {student_data['last_name']}"
            )
        lines.append(f"    … plus {len(STUDENTS) - 6} more students (DEMO007–DEMO022)")
        lines.extend([
            "",
            "  Suggested logins for the live demo:",
            "    • Teacher dashboard  → demo_teacher",
            "    • Star reader        → maya_chen   (5+ books read, awards)",
            "    • Social feed posts  → ava_johnson (recent to-read adds)",
            "    • Allocated books    → noah_williams",
            "    • Quiet student      → emma_brown  (empty shelf)",
            "",
        ])
        if skipped_shelf:
            lines.append("  (Bookshelf seeding was skipped — run seed_books, then re-run.)")
        else:
            lines.append("  Full walkthrough: docs/DEMO_SCRIPT.md")
        lines.append("=" * 60)

        self.stdout.write(self.style.SUCCESS("\n".join(lines)))

    @staticmethod
    def _student_username(student_data):
        return f"{student_data['first_name'].lower()}_{student_data['last_name'].lower()}"
