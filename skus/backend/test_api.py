from django.test import TestCase
import pytest
from django.urls import reverse
from rest_framework.test import APIClient
from backend.models import SKU, Note, SalesActivity, ReturnActivity, ContentScoreActivity
import uuid
from datetime import datetime, timedelta

# Create your tests here.

# Tests for SKU and Note API endpoints will go here.
# You should test listing SKUs, retrieving SKU details (with notes), and adding notes to SKUs.

@pytest.mark.django_db
def test_create_and_list_sku():
    client = APIClient()
    sku_data = {"name": "Test Product"}
    response = client.post(reverse('sku-list'), sku_data, format='json')
    assert response.status_code == 201
    response = client.get(reverse('sku-list'))
    assert response.status_code == 200
    assert response.data[0]['name'] == "Test Product"

@pytest.mark.django_db
def test_sku_detail_and_add_note():
    client = APIClient()
    sku = SKU.objects.create(name="Detail Product")
    response = client.get(reverse('sku-detail', args=[sku.id]))
    assert response.status_code == 200
    assert response.data['name'] == "Detail Product"
    assert response.data['notes'] == []
    note_data = {"sku": sku.id, "text": "Follow up needed."}
    response = client.post(reverse('note-list'), note_data, format='json')
    assert response.status_code == 201
    response = client.get(reverse('sku-detail', args=[sku.id]))
    assert len(response.data['notes']) == 1
    assert response.data['notes'][0]['text'] == "Follow up needed."

@pytest.mark.django_db
def test_sales_activity_crud():
    client = APIClient()
    sku = SKU.objects.create(name="Sales SKU")
    sales_data = {"sku": sku.id, "quantity": 5, "date": datetime.now().isoformat()}
    response = client.post(reverse('salesactivity-list'), sales_data, format='json')
    assert response.status_code == 201
    response = client.get(reverse('salesactivity-list') + f'?sku={sku.id}')
    assert response.status_code == 200
    assert response.data[0]['quantity'] == 5

@pytest.mark.django_db
def test_return_activity_validation():
    client = APIClient()
    sku = SKU.objects.create(name="Return SKU")
    # Add sales first
    sales = SalesActivity.objects.create(sku=sku, quantity=10, date=datetime.now())
    # Valid return
    return_data = {"sku": sku.id, "quantity": 5, "date": datetime.now().isoformat()}
    response = client.post(reverse('returnactivity-list'), return_data, format='json')
    assert response.status_code == 201
    # Invalid return (exceeds sales)
    return_data = {"sku": sku.id, "quantity": 20, "date": datetime.now().isoformat()}
    response = client.post(reverse('returnactivity-list'), return_data, format='json')
    assert response.status_code == 400
    assert 'Return quantity cannot exceed total sales.' in str(response.data)

@pytest.mark.django_db
def test_content_score_activity_and_average():
    client = APIClient()
    sku = SKU.objects.create(name="Score SKU")
    now = datetime.now()
    # Add content scores
    for score in [7, 8, 9]:
        ContentScoreActivity.objects.create(sku=sku, score=score, date=now)
    response = client.get(reverse('sku-detail', args=[sku.id]))
    assert response.status_code == 200
    assert response.data['content_score'] == 8.0

@pytest.mark.django_db
def test_sku_filters():
    client = APIClient()
    sku1 = SKU.objects.create(name="High Return")
    sku2 = SKU.objects.create(name="Low Content")
    SalesActivity.objects.create(sku=sku1, quantity=10, date=datetime.now())
    ReturnActivity.objects.create(sku=sku1, quantity=5, date=datetime.now())
    ContentScoreActivity.objects.create(sku=sku2, score=50, date=datetime.now())
    # High return filter
    response = client.get(reverse('sku-list') + '?return_high=true')
    assert any(s['name'] == "High Return" for s in response.data)
    # Low content filter
    response = client.get(reverse('sku-list') + '?low_content=true')
    assert any(s['name'] == "Low Content" for s in response.data)

@pytest.mark.django_db
def test_note_delete_and_cascade():
    sku = SKU.objects.create(name="Cascade SKU")
    note = Note.objects.create(sku=sku, text="To be deleted")
    sku.delete()
    assert Note.objects.count() == 0

@pytest.mark.django_db
def test_sales_return_contentscore_delete_cascade():
    sku = SKU.objects.create(name="Cascade SKU2")
    SalesActivity.objects.create(sku=sku, quantity=1, date=datetime.now())
    ReturnActivity.objects.create(sku=sku, quantity=1, date=datetime.now())
    ContentScoreActivity.objects.create(sku=sku, score=5, date=datetime.now())
    sku.delete()
    assert SalesActivity.objects.count() == 0
    assert ReturnActivity.objects.count() == 0
    assert ContentScoreActivity.objects.count() == 0
