from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _

class CustomUser(AbstractUser):
    PROFESSION_CHOICES = [
        ('designer', 'Designer'),
        ('photographer', 'Photographer'),
        ('developer', 'Developer'),
        ('other', 'Other'),
    ]
    
    # Make email required and unique
    email = models.EmailField(_('email address'), unique=True)
    profile_picture = models.ImageField(
    upload_to='profile_pictures/',
    null=True,
    blank=True,
    default='default-avatar.png'
    )
    profession = models.CharField(max_length=20, choices=PROFESSION_CHOICES)
    address = models.TextField()
    
    # Use email as username
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'first_name', 'last_name']

    def save(self, *args, **kwargs):
        if not self.username:
            self.username = self.email
        super().save(*args, **kwargs)

    def __str__(self):
        return self.email

class Slider(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to='slider/')
    video = models.FileField(upload_to='slider/videos/', null=True, blank=True)
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return self.title

class Image(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    image = models.ImageField(upload_to='images/')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

class Contact(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    subject = models.CharField(max_length=200)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.subject}"