"""
Tests for API views.
"""
from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from ..models.models import SKU, Note
from ..constants.choices import STATUS_CHOICES

class SKUViewSetTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.sku = SKU.objects.create(
            name="Test SKU",
            sales=100,
            return_percentage=5.0,
            content_score=85.0
        )
        self.url = reverse('sku-list')

    def test_list_skus(self):
        """Test retrieving list of SKUs."""
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_create_sku(self):
        """Test creating a new SKU."""
        data = {
            'name': 'New SKU',
            'sales': 200,
            'return_percentage': 3.0,
            'content_score': 90.0
        }
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(SKU.objects.count(), 2)
        self.assertEqual(SKU.objects.get(name='New SKU').sales, 200) 