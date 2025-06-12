"""
Views for the SKU management API.
"""
from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied, NotFound, ValidationError
from ..models.models import SKU, Note, SalesActivity, ReturnActivity, ContentScoreActivity
from ..serializers.serializers import SKUSerializer, NoteSerializer, SalesActivitySerializer, ReturnActivitySerializer, ContentScoreActivitySerializer
from ..utils.helpers import calculate_content_score, calculate_return_rate

def update_sku_metrics(sku):
    """
    Update the metrics for a SKU based on its activities.
    """
    sku_data = {'uuid': sku.uuid}
    sku.content_score = calculate_content_score(sku_data)
    sku.return_percentage = calculate_return_rate(sku_data)
    sku.save()

class SKUViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing SKUs.
    """
    queryset = SKU.objects.all()
    serializer_class = SKUSerializer
    permission_classes = [AllowAny]
    lookup_field = 'uuid'

    def perform_create(self, serializer):
        """Calculate scores before saving."""
        instance = serializer.save()
        instance.content_score = calculate_content_score(serializer.validated_data)
        instance.return_percentage = calculate_return_rate(serializer.validated_data)
        instance.save()

class NoteViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing Notes.
    """
    queryset = Note.objects.all()
    serializer_class = NoteSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        """Filter notes by SKU UUID if provided in query params."""
        queryset = Note.objects.all()
        sku_uuid = self.request.query_params.get('sku', None)
        if sku_uuid is not None:
            queryset = queryset.filter(sku__uuid=sku_uuid)
        return queryset

class SalesActivityViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing Sales Activities.
    """
    queryset = SalesActivity.objects.all()
    serializer_class = SalesActivitySerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        """Filter sales activities by SKU UUID if provided in query params."""
        queryset = SalesActivity.objects.all()
        sku_uuid = self.request.query_params.get('sku', None)
        if sku_uuid is not None:
            queryset = queryset.filter(sku__uuid=sku_uuid)
        return queryset
    
    def perform_create(self, serializer):
        """Update SKU metrics after adding a sales activity."""
        instance = serializer.save()
        update_sku_metrics(instance.sku)

class ReturnActivityViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing Return Activities.
    """
    queryset = ReturnActivity.objects.all()
    serializer_class = ReturnActivitySerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        """Filter return activities by SKU UUID if provided in query params."""
        queryset = ReturnActivity.objects.all()
        sku_uuid = self.request.query_params.get('sku', None)
        if sku_uuid is not None:
            queryset = queryset.filter(sku__uuid=sku_uuid)
        return queryset
    
    def perform_create(self, serializer):
        """Update SKU metrics after adding a return activity."""
        instance = serializer.save()
        update_sku_metrics(instance.sku)

class ContentScoreActivityViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing Content Score Activities.
    """
    queryset = ContentScoreActivity.objects.all()
    serializer_class = ContentScoreActivitySerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        """Filter content score activities by SKU UUID if provided in query params."""
        queryset = ContentScoreActivity.objects.all()
        sku_uuid = self.request.query_params.get('sku', None)
        if sku_uuid is not None:
            queryset = queryset.filter(sku__uuid=sku_uuid)
        return queryset
    
    def perform_create(self, serializer):
        """Update SKU metrics after adding a content score activity."""
        instance = serializer.save()
        update_sku_metrics(instance.sku) 