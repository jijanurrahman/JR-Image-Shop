from django.shortcuts import render, get_object_or_404, redirect
from django.contrib import messages
from .models import Slider, Image
from .forms import ContactForm, RegistrationForm, CustomLoginForm
from django.contrib.auth import login, logout
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
import logging
def register(request):
    if request.method == 'POST':
        form = RegistrationForm(request.POST, request.FILES)
        if form.is_valid():
            try:
                user = form.save(commit=False)
                user.username = user.email
                # Explicitly handle profile picture
                if 'profile_picture' in request.FILES:
                    user.profile_picture = request.FILES['profile_picture']
                user.save()
                messages.success(request, 'Registration successful! Please log in.')
                return redirect('login')
            except Exception as e:
                logging.error(f"Error during registration: {str(e)}")
                messages.error(request, 'An error occurred during registration.')
    else:
        form = RegistrationForm()
    return render(request, 'core/register.html', {'form': form})

def user_login(request):
    if request.method == 'POST':
        form = CustomLoginForm(data=request.POST)
        if form.is_valid():
            user = form.get_user()
            login(request, user)
            if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                return JsonResponse({'success': True})
            return redirect('home')
        else:
            if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                return JsonResponse({
                    'success': False,
                    'message': 'Invalid email or password.'
                })
    else:
        form = CustomLoginForm()
    return render(request, 'core/login.html', {'form': form})

def user_logout(request):
    logout(request)
    messages.success(request, 'You have been logged out.')
    return redirect('login')
def home(request):
    sliders = Slider.objects.filter(is_active=True)
    images = Image.objects.all()
    return render(request, 'core/home.html', {
        'sliders': sliders,
        'images': images
    })
@login_required
def image_detail(request, pk):
    image = get_object_or_404(Image, pk=pk)
    return render(request, 'core/image_detail.html', {'image': image})

def contact(request):
    if request.method == 'POST':
        form = ContactForm(request.POST)
        if form.is_valid():
            form.save()
            if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                return JsonResponse({
                    'success': True,
                    'message': 'Your message has been sent successfully!'
                })
            messages.success(request, 'Your message has been sent successfully!')
            return redirect('contact')
        else:
            if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                return JsonResponse({
                    'success': False,
                    'message': 'Please correct the errors below.'
                })
    else:
        form = ContactForm()
    return render(request, 'core/contact.html', {'form': form})