
from django.urls import path
from . import views

urlpatterns = [
   path('upload/', views.UploadCreateView.as_view()),
    path('my-uploads/', views.MyUploadsView.as_view()),
    path('book/<int:pk>/', views.book_detail, name='book-detail'),
]