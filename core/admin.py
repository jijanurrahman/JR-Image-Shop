from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.utils.html import format_html
from .models import Slider, Image, Contact, CustomUser

@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    list_display = ('email', 'first_name', 'last_name', 'profession', 'profile_picture_preview', 'date_joined')
    list_filter = ('is_active', 'profession', 'date_joined')
    search_fields = ('email', 'first_name', 'last_name', 'address')
    ordering = ('-date_joined',)
    
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name', 'profile_picture', 'profession', 'address')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2', 'first_name', 'last_name', 
                      'profile_picture', 'profession', 'address'),
        }),
    )

    def profile_picture_preview(self, obj):
        if obj.profile_picture:
            return format_html('<img src="{}" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;">', 
                             obj.profile_picture.url)
        return "No picture"
    profile_picture_preview.short_description = 'Profile Picture'

@admin.register(Slider)
class SliderAdmin(admin.ModelAdmin):
    list_display = ('title', 'order', 'is_active')
    list_editable = ['order', 'is_active']

@admin.register(Image)
class ImageAdmin(admin.ModelAdmin):
    list_display = ('title', 'created_at')
    search_fields = ('title', 'description')

@admin.register(Contact)
class ContactAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'subject', 'created_at')
    readonly_fields = ('created_at',)