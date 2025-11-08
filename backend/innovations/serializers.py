# uploads/serializers.py
from rest_framework import serializers
from .models import Upload

class UploadSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField()
    cover_url = serializers.SerializerMethodField()
    

    class Meta:
        model = Upload
        fields = '__all__'
        read_only_fields = ['user', 'status', 'uploaded_at']

    def get_file_url(self, obj): return obj.file.url
    def get_cover_url(self, obj): return obj.cover_image.url






class BookDetailSerializer(serializers.ModelSerializer):
    cover_image = serializers.SerializerMethodField()
    file_url = serializers.SerializerMethodField()

    class Meta:
        model = Upload
        fields = [
            'id', 'title', 'authors', 'year', 'description',
            'cover_image', 'file_url',
            'submission_type', 'university'
        ]

    def get_cover_image(self, obj):
        if obj.cover_image:
            return self.context['request'].build_absolute_uri(obj.cover_image.url)
        return None

    def get_file_url(self, obj):
        if obj.file:
            return self.context['request'].build_absolute_uri(obj.file.url)
        return None