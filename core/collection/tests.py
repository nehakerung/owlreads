from django.apps import apps
from django.test import TestCase


class CollectionAppTests(TestCase):
    def test_app_label(self):
        self.assertIn("collection", apps.app_configs)
