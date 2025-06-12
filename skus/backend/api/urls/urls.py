"""
URL configuration for the SKU management API.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from ..views.views import (
    SKUViewSet, NoteViewSet, SalesActivityViewSet,
    ReturnActivityViewSet, ContentScoreActivityViewSet
)

router = DefaultRouter()
router.register(r'skus', SKUViewSet)
router.register(r'notes', NoteViewSet)
router.register(r'sales-activities', SalesActivityViewSet)
router.register(r'return-activities', ReturnActivityViewSet)
router.register(r'content-score-activities', ContentScoreActivityViewSet)

urlpatterns = [
    path('', include(router.urls)),
] 