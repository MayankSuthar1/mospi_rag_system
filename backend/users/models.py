from django.db import models
from django.contrib.auth.models import AbstractUser
import uuid


class User(AbstractUser):
    """
    Custom User model that extends Django's AbstractUser.
    Uses email as the username field and adds role field.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=50, default='user')
    created_at = models.DateTimeField(auto_now_add=True)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'first_name', 'last_name']
    
    def __str__(self):
        return self.email
    
    @property
    def name(self):
        """Return full name or username if full name is not set"""
        if self.first_name or self.last_name:
            return f"{self.first_name} {self.last_name}".strip()
        return self.username


class UserPreference(models.Model):
    """
    Model to store user preferences like theme, view mode, etc.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='preferences')
    theme = models.CharField(max_length=50, default='light')
    chat_settings = models.JSONField(default=dict)
    view_mode = models.CharField(max_length=50, default='list')
    
    def __str__(self):
        return f'{self.user.email} preferences'
