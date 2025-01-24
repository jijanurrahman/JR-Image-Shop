from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('image/<int:pk>/', views.image_detail, name='image_detail'),
    path('contact/', views.contact, name='contact'),
    path('register/', views.register, name='register'),
    path('login/', views.user_login, name='login'),
    path('logout/', views.user_logout, name='logout'),
]