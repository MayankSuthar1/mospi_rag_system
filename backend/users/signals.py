from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from .models import UserPreference

User = get_user_model()

@receiver(post_save, sender=User)
def create_user_preferences(sender, instance, created, **kwargs):
    """
    Create UserPreference when a new User is created
    """
    if created:
        UserPreference.objects.get_or_create(user=instance)
