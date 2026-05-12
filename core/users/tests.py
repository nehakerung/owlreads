from django.apps import apps
from django.test import TestCase


class UsersAppTests(TestCase):
    def test_app_label(self):
        self.assertIn("users", apps.app_configs)
