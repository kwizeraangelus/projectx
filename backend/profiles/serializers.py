# profile/serializers.py
from rest_framework import serializers
from .models import ResearcherProfile
from django.contrib.auth.models import User
from users.models import CustomUser

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'user_category', 'is_staff']

class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    profile_image = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = ResearcherProfile
<<<<<<< HEAD
        fields = '__all__'
=======
        fields = [
            'id', 'user', 'national_id', 'age', 'phone', 
            'degree', 'university', 'profile_image', 
            'profile_complete'
        ]
>>>>>>> 5a20e0c6e01095d588952b8cca9e49ee2071e1f4
        read_only_fields = ['profile_complete']