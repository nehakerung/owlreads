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

    @property
    def is_teacher(self):
        return self.role == "teacher"

    @property
    def is_student(self):
        return self.role == "student"
