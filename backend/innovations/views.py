# uploads/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Upload
from .serializers import UploadSerializer
from profiles.models import ResearcherProfile

class UploadCreateView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        try:
            profile = request.user.researcher_profile
        except ResearcherProfile.DoesNotExist:
            return Response({'error': 'Complete your profile first'}, status=403)

        if not profile.profile_complete:
            return Response({'error': 'Complete your profile first'}, status=403)

        data = request.data.copy()
        data['user'] = request.user.id

        submission_type = data.get('submission_type')
        if submission_type in ['thesis', 'masters', 'bachelor']:
            if not data.get('university'):
                return Response({'university': ['Required.']}, status=400)

        serializer = UploadSerializer(data=data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

class MyUploadsView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        uploads = Upload.objects.filter(user=request.user).order_by('-uploaded_at')
        return Response(UploadSerializer(uploads, many=True).data)