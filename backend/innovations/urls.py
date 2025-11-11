
from django.urls import path
from . import views

urlpatterns = [
   path('upload/', views.UploadCreateView.as_view()),
    path('my-uploads/', views.MyUploadsView.as_view()),
   
   path('innovations/public-list/',views.PublicationListAPIView.as_view()),
]