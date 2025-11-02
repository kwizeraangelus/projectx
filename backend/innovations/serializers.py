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