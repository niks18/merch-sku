# Generated by Django 5.2.3 on 2025-06-12 18:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_alter_contentscoreactivity_score'),
    ]

    operations = [
        migrations.AlterField(
            model_name='sku',
            name='content_score',
            field=models.DecimalField(decimal_places=2, default=0.0, max_digits=5),
        ),
        migrations.AlterField(
            model_name='sku',
            name='return_percentage',
            field=models.DecimalField(decimal_places=2, default=0.0, max_digits=5),
        ),
    ]
