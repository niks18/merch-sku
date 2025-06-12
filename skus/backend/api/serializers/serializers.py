from rest_framework import serializers
from api.models.models import SKU, Note, SalesActivity, ReturnActivity, ContentScoreActivity


class NoteSerializer(serializers.ModelSerializer):
    sku = serializers.SlugRelatedField(queryset=SKU.objects.all(), slug_field='uuid')
    class Meta:
        model = Note
        fields = '__all__'
        read_only_fields = ('id', 'created_at', 'updated_at')

class SKUSerializer(serializers.ModelSerializer):
    notes = NoteSerializer(many=True, read_only=True)
    class Meta:
        model = SKU
        fields = '__all__'
        read_only_fields = ('id', 'created_at', 'updated_at')

class SalesActivitySerializer(serializers.ModelSerializer):
    sku = serializers.SlugRelatedField(queryset=SKU.objects.all(), slug_field='uuid')
    class Meta:
        model = SalesActivity
        fields = '__all__'
        read_only_fields = ('id', 'created_at', 'updated_at')

class ReturnActivitySerializer(serializers.ModelSerializer):
    sku = serializers.SlugRelatedField(queryset=SKU.objects.all(), slug_field='uuid')
    class Meta:
        model = ReturnActivity
        fields = '__all__'
        read_only_fields = ('id', 'created_at', 'updated_at')

class ContentScoreActivitySerializer(serializers.ModelSerializer):
    sku = serializers.SlugRelatedField(queryset=SKU.objects.all(), slug_field='uuid')
    class Meta:
        model = ContentScoreActivity
        fields = '__all__'
        read_only_fields = ('id', 'created_at', 'updated_at') 