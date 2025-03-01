from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (
    UserRegistrationView,
    LogoutView,
    UserProfileView,
    UserPreferenceView,
    ChangePasswordView,
    UserListView,
    UserDetailView
)

urlpatterns = [
    # Authentication endpoints
    path('login/', TokenObtainPairView.as_view(), name='login'),  # Use JWT token view for login
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', UserRegistrationView.as_view(), name='register'),
    path('logout/', LogoutView.as_view(), name='logout'),
    
    # User management endpoints
    path('profile/', UserProfileView.as_view(), name='profile'),
    path('preferences/', UserPreferenceView.as_view(), name='preferences'),
    path('change-password/', ChangePasswordView.as_view(), name='change-password'),
    path('users/', UserListView.as_view(), name='user-list'),
    path('users/<uuid:pk>/', UserDetailView.as_view(), name='user-detail'),
]
