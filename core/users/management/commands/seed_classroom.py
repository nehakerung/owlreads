from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

User = get_user_model()

SHARED_PASSWORD = "Password123!"

TEACHER = {
    "username": "teacher_smith",
    "email": "smith@school.com",
    "first_name": "Jane",
    "last_name": "Smith",
    "classname": "Class 4B",
    "teachername": "Mrs Smith",
}

STUDENTS = [
    {"first_name": "Alice",   "last_name": "Adams"},
    {"first_name": "Bob",     "last_name": "Baker"},
    {"first_name": "Charlie", "last_name": "Clark"},
    {"first_name": "Diana",   "last_name": "Davis"},
    {"first_name": "Ethan",   "last_name": "Evans"},
    {"first_name": "Fiona",   "last_name": "Fisher"},
    {"first_name": "George",  "last_name": "Green"},
    {"first_name": "Hannah",  "last_name": "Hill"},
    {"first_name": "Ivan",    "last_name": "Ingram"},
    {"first_name": "Julia",   "last_name": "Jones"},
    {"first_name": "Kevin",   "last_name": "King"},
    {"first_name": "Laura",   "last_name": "Lewis"},
    {"first_name": "Marcus",  "last_name": "Moore"},
    {"first_name": "Nina",    "last_name": "Nash"},
    {"first_name": "Oliver",  "last_name": "Owen"},
    {"first_name": "Petra",   "last_name": "Price"},
    {"first_name": "Quinn",   "last_name": "Quinn"},
    {"first_name": "Rachel",  "last_name": "Reed"},
    {"first_name": "Samuel",  "last_name": "Scott"},
    {"first_name": "Tina",    "last_name": "Taylor"},
    {"first_name": "Uma",     "last_name": "Underwood"},
    {"first_name": "Victor",  "last_name": "Vance"},
    {"first_name": "Wendy",   "last_name": "Walsh"},
    {"first_name": "Xander",  "last_name": "Cross"},
    {"first_name": "Yasmin",  "last_name": "Young"},
]


class Command(BaseCommand):
    help = "Seeds a teacher account and 25 student accounts linked to that teacher."

    def add_arguments(self, parser):
        parser.add_argument(
            "--clear",
            action="store_true",
            help="Delete all existing seeded users before re-seeding.",
        )

    def handle(self, *args, **options):
        if options["clear"]:
            self._clear_seeded_users()

        teacher = self._create_teacher()
        self._create_students(teacher)

        self.stdout.write(self.style.SUCCESS(
            f"\n✅ Done! Teacher '{teacher.username}' + {len(STUDENTS)} students created."
            f"\n   Shared password: {SHARED_PASSWORD}"
        ))

    def _clear_seeded_users(self):
        """Remove users whose usernames match the seeder pattern."""
        teacher_deleted, _ = User.objects.filter(
            username=TEACHER["username"]
        ).delete()

        student_usernames = [self._make_username(s) for s in STUDENTS]
        students_deleted, _ = User.objects.filter(
            username__in=student_usernames
        ).delete()

        self.stdout.write(self.style.WARNING(
            f"🗑  Cleared {teacher_deleted} teacher(s) and {students_deleted} student(s)."
        ))

    def _create_teacher(self):
        username = TEACHER["username"]

        if User.objects.filter(username=username).exists():
            teacher = User.objects.get(username=username)
            self.stdout.write(f"  ⚠️  Teacher '{username}' already exists — skipping creation.")
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

        self.stdout.write(f"  👩‍🏫 Created teacher: {teacher.username} ({teacher.email})")
        return teacher

    def _create_students(self, teacher):
        for index, student_data in enumerate(STUDENTS, start=1):
            username = self._make_username(student_data)
            student_id = self._make_student_id(index)

            if User.objects.filter(username=username).exists():
                self.stdout.write(f"  ⚠️  Student '{username}' already exists — skipping.")
                continue

            student = User.objects.create_user(
                username=username,
                email="",           # Students have no email
                password=SHARED_PASSWORD,
                first_name=student_data["first_name"],
                last_name=student_data["last_name"],
                role="student",
                classname=teacher.classname,
                teachername=teacher.teachername,
                teacher=teacher,
                student_id=student_id,
            )

            self.stdout.write(
                f"  🎒 Created student [{student_id}]: {student.get_full_name()} ({student.username})"
            )

    @staticmethod
    def _make_username(student_data):
        """e.g. 'alice_adams'"""
        return f"{student_data['first_name'].lower()}_{student_data['last_name'].lower()}"

    @staticmethod
    def _make_student_id(index):
        """e.g. 'STU001'"""
        return f"STU{index:03d}"