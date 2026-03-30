from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    ROLE_CHOICES = (
        ('teacher', 'Teacher'),
        ('student', 'Student'),
    )

    classname = models.CharField(max_length=150, null=True, blank=True)
    teachername = models.CharField(max_length=150, null=True, blank=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    teacher = models.ForeignKey(
        'self',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='students'
    )
    student_id = models.CharField(max_length=20, null=True, blank=True, unique=True)
    updated_at = models.DateTimeField(auto_now=True)

    @property
    def is_teacher(self):
        return self.role == "teacher"

    @property
    def is_student(self):
        return self.role == "student"

    @property
    def last_shelf_update(self):
        """Get the most recent BookShelfEntry update for this user"""
        latest = self.shelf_entries.first()
        return latest.updated_at if latest else None

    @property
    def books_read_count(self):
        """Count books marked as read in the user's shelf"""
        return self.shelf_entries.filter(status='read').count()

    @property
    def books_to_read_count(self):
        """Count books marked as to_read in the user's shelf"""
        return self.shelf_entries.filter(status='to_read').count()

    @property
    def books_reading_count(self):
        """Count books marked as reading in the user's shelf"""
        return self.shelf_entries.filter(status='reading').count()

    def reset_password(self):
        """Reset the user's password to the default used for teacher-initiated resets."""
        self.set_password("password")
        self.save()
