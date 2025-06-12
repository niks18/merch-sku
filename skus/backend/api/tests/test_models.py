"""
Tests for models.
"""
from django.test import TestCase
from api.models.models import SKU, Note

class SKUModelTest(TestCase):
    def setUp(self):
        self.sku = SKU.objects.create(
            name="Test SKU",
            sales=100,
            return_percentage=5.0,
            content_score=85.0
        )

    def test_sku_creation(self):
        self.assertEqual(self.sku.name, "Test SKU")
        self.assertEqual(self.sku.sales, 100)
        self.assertEqual(self.sku.return_percentage, 5.0)
        self.assertEqual(self.sku.content_score, 85.0) 