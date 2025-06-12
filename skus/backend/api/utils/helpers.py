"""
Helper functions used throughout the application.
"""
from datetime import datetime
from typing import Dict, Any
from django.db.models import Avg

def calculate_content_score(sku_data: Dict[str, Any]) -> float:
    """
    Calculate content score based on content score activities.
    Returns the average of all content score activities for this SKU,
    or 0.0 if there are no activities.
    """
    from api.models.models import ContentScoreActivity, SKU
    
    # For new SKUs without a UUID yet
    if 'uuid' not in sku_data:
        return 0.0
    
    try:
        sku = SKU.objects.get(uuid=sku_data['uuid'])
        avg_score = ContentScoreActivity.objects.filter(sku=sku).aggregate(Avg('score'))['score__avg']
        if avg_score is not None:
            # Round to 2 decimal places
            return round(avg_score, 2)
        return 0.0
    except (SKU.DoesNotExist, KeyError):
        return 0.0

def calculate_return_rate(sku_data: Dict[str, Any]) -> float:
    """
    Calculate return rate based on sales and returns.
    Returns the percentage of returns compared to sales,
    or 0.0 if there are no sales.
    """
    from api.models.models import SalesActivity, ReturnActivity, SKU
    
    # For new SKUs without a UUID yet
    if 'uuid' not in sku_data:
        return 0.0
    
    try:
        sku = SKU.objects.get(uuid=sku_data['uuid'])
        
        # Get total sales quantity
        total_sales = SalesActivity.objects.filter(sku=sku).values_list('quantity', flat=True)
        sales_sum = sum(total_sales) if total_sales else 0
        
        # Get total returns quantity
        total_returns = ReturnActivity.objects.filter(sku=sku).values_list('quantity', flat=True)
        returns_sum = sum(total_returns) if total_returns else 0
        
        # Calculate return percentage
        if sales_sum > 0:
            return_rate = (returns_sum / sales_sum) * 100
            # Round to 2 decimal places
            return round(return_rate, 2)
        return 0.0
    except (SKU.DoesNotExist, KeyError):
        return 0.0

def format_date(date: datetime) -> str:
    """
    Format date in a consistent way across the application.
    """
    return date.strftime("%Y-%m-%d %H:%M:%S") 