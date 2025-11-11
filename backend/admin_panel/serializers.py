from rest_framework import serializers
from innovations.models import Upload

from events.models import Event
from django.contrib.auth import get_user_model

User = get_user_model()

class AdminUploadSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='user.username', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = Upload
        fields = [
            'id', 'title', 'author_name', 'submission_type',
            'status', 'status_display', 'feedback'
        ]




class UserSerializer(serializers.ModelSerializer):
      class Meta:
        model = User
        fields = ['id', 'username', 'email', 'date_joined']

class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ['id', 'title', 'description', 'date', 'location','link']




User = get_user_model()

class AdminUserSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'phone_number',
            'user_category', 'university_name',
            'password', 'confirm_password'
        ]
        extra_kwargs = {
            'password': {'write_only': True},
        }

    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError("Passwords do not match")
        return data

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user