from django.core.management.base import BaseCommand
from api.models.models import SKU, Note, SalesActivity, ReturnActivity, ContentScoreActivity
from django.utils import timezone
import random

class Command(BaseCommand):
    help = 'Populates the database with test data'

    def handle(self, *args, **kwargs):
        self.stdout.write('Creating test data...')

        # Create SKUs
        sku_names = ['T-Shirt Basic', 'Hoodie Premium', 'Cap Classic', 'Mug Ceramic', 'Sticker Pack']
        skus = []
        
        for name in sku_names:
            sku = SKU.objects.create(
                name=name,
                sales=random.randint(100, 1000),
                return_percentage=random.uniform(0, 15),
                content_score=random.uniform(0, 100)
            )
            skus.append(sku)
            self.stdout.write(f'Created SKU: {name}')

        # Create Notes for each SKU
        note_texts = [
            'Great product, high demand',
            'Consider increasing stock',
            'Customer feedback positive',
            'Need to improve packaging',
            'Seasonal item, plan accordingly'
        ]
        
        for sku in skus:
            note = Note.objects.create(
                sku=sku,
                content=random.choice(note_texts)
            )
            self.stdout.write(f'Created Note for {sku.name}')

        # Create Sales Activities
        for sku in skus:
            for _ in range(3):  # Create 3 sales activities per SKU
                sales_activity = SalesActivity.objects.create(
                    sku=sku,
                    quantity=random.randint(10, 100),
                    date=timezone.now().date()
                )
                self.stdout.write(f'Created Sales Activity for {sku.name}')

        # Create Return Activities
        for sku in skus:
            for _ in range(2):  # Create 2 return activities per SKU
                return_activity = ReturnActivity.objects.create(
                    sku=sku,
                    quantity=random.randint(1, 20),
                    date=timezone.now().date()
                )
                self.stdout.write(f'Created Return Activity for {sku.name}')

        # Create Content Score Activities
        for sku in skus:
            for _ in range(2):  # Create 2 content score activities per SKU
                content_score_activity = ContentScoreActivity.objects.create(
                    sku=sku,
                    score=random.uniform(0, 100),
                    date=timezone.now().date()
                )
                self.stdout.write(f'Created Content Score Activity for {sku.name}')

        self.stdout.write(self.style.SUCCESS('Successfully created test data')) 