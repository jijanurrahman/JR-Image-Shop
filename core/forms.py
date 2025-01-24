from django import forms
from .models import Contact, CustomUser
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm

class RegistrationForm(UserCreationForm):
    class Meta:
        model = CustomUser
        fields = ['profile_picture', 'first_name', 'last_name', 'email', 
                 'profession', 'address', 'password1', 'password2']
        widgets = {
            'profile_picture': forms.FileInput(attrs={
                'class': 'form-control d-none',  # Hide the default file input
                'accept': 'image/*',
                'id': 'profilePictureInput'
            }),
            'first_name': forms.TextInput(attrs={'class': 'form-control'}),
            'last_name': forms.TextInput(attrs={'class': 'form-control'}),
            'email': forms.EmailInput(attrs={'class': 'form-control'}),
            'profession': forms.Select(attrs={'class': 'form-control'}),
            'address': forms.Textarea(attrs={'class': 'form-control', 'rows': 3}),
        }

class CustomLoginForm(AuthenticationForm):
    username = forms.EmailField(widget=forms.EmailInput(attrs={'class': 'form-control'}))
    password = forms.CharField(widget=forms.PasswordInput(attrs={'class': 'form-control'}))

class ContactForm(forms.ModelForm):
    class Meta:
        model = Contact
        fields = ['name', 'email', 'subject', 'message']
        widgets = {
            'name': forms.TextInput(attrs={'class': 'form-control'}),
            'email': forms.EmailInput(attrs={'class': 'form-control'}),
            'subject': forms.TextInput(attrs={'class': 'form-control'}),
            'message': forms.Textarea(attrs={'class': 'form-control', 'rows': 5}),
        }