
from django.urls import path
from . import views

urlpatterns = [
   path('upload/', views.UploadCreateView.as_view()),
    path('my-uploads/', views.MyUploadsView.as_view()),
<<<<<<< HEAD
   
   path('innovations/public-list/',views.PublicationListAPIView.as_view()),
=======
    path('book/<int:pk>/', views.book_detail, name='book-detail'),
>>>>>>> 5a20e0c6e01095d588952b8cca9e49ee2071e1f4
]