"""
Models for the SKU management API.
"""
from django.db import models
from django.utils import timezone
from django.core.validators import MinValueValidator, MaxValueValidator
import uuid

class SKU(models.Model):
    """
    Model for SKU (Stock Keeping Unit).
    """
    uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    name = models.CharField(max_length=255)
    sales = models.IntegerField(default=0)
    return_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=0.0)
    content_score = models.DecimalField(max_digits=5, decimal_places=2, default=0.0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class Note(models.Model):
    """
    Model for SKU Notes.
    """
    sku = models.ForeignKey(SKU, on_delete=models.CASCADE, related_name='notes')
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Note for {self.sku.name}"

class SalesActivity(models.Model):
    """
    Model for Sales Activities.
    """
    sku = models.ForeignKey(SKU, on_delete=models.CASCADE, related_name='sales_activities')
    quantity = models.IntegerField()
    date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Sales for {self.sku.name} on {self.date}"

class ReturnActivity(models.Model):
    """
    Model for Return Activities.
    """
    sku = models.ForeignKey(SKU, on_delete=models.CASCADE, related_name='return_activities')
    quantity = models.IntegerField()
    date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Returns for {self.sku.name} on {self.date}"

class ContentScoreActivity(models.Model):
    """
    Model for Content Score Activities.
    """
    sku = models.ForeignKey(SKU, on_delete=models.CASCADE, related_name='content_score_activities')
    score = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(10)])
    date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Content score for {self.sku.name} on {self.date}" 