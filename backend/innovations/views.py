# innovations/views.py (FULL ADJUSTED FILE)
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated,AllowAny
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import generics # 👈 NEW IMPORT
from .models import Upload
from .serializers import UploadSerializer
from profiles.models import ResearcherProfile
# --- Existing Views ---

class UploadCreateView(APIView):
    # ... (Your existing UploadCreateView code remains unchanged) ...
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]
    # ... (Your post method) ...
    def post(self, request):
        # ... (Your post logic) ...
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
    # ... (Your existing MyUploadsView code remains unchanged) ...
    permission_classes = [IsAuthenticated]
    def get(self, request):
        uploads = Upload.objects.filter(user=request.user).order_by('-uploaded_at')
        return Response(UploadSerializer(uploads, many=True).data)

# --- NEW Public Publications & Filtering View ---
class PublicationListAPIView(generics.ListAPIView):
    queryset = Upload.objects.all() 
    serializer_class = UploadSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = self.queryset
        # Get the 'field' query parameter from the frontend
        field = self.request.query_params.get('field', None)
        
        if field is not None:
            # Filters based on the 'field_of_study' property (case-insensitive)
            queryset = queryset.filter(field_of_study__iexact=field) 
            
        return queryset.order_by('-uploaded_at')