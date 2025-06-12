"""
Constants and choices used throughout the application.
"""

# Status choices
STATUS_CHOICES = (
    ('active', 'Active'),
    ('inactive', 'Inactive'),
    ('pending', 'Pending'),
)

# Content score thresholds
CONTENT_SCORE_THRESHOLDS = {
    'excellent': 90,
    'good': 70,
    'fair': 50,
    'poor': 30,
}

# Return rate thresholds
RETURN_RATE_THRESHOLDS = {
    'low': 10,
    'medium': 20,
    'high': 30,
} 