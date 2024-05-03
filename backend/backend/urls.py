"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from . import views as mainViews
from django.conf import settings
from django.urls import path, include
from django.conf.urls.static import static
from auth_API42 import views as API42Views
from user_management import views as userManagementViews
from django.contrib.auth.views import LogoutView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', mainViews.home, name='batpong'),
    path('batpong/', mainViews.batpong, name='batpong'),
    path('batcave/', mainViews.batcave, name='batcave'),
    path('batprofile/', mainViews.batprofile, name='batprofile'),
    path('signin/', userManagementViews.signin, name='signin'),
    path('signup/', userManagementViews.signup, name='signup'),
    #path('accounts/', include('allauth.urls')),
    path('cursus-and-users', API42Views.get_cursus_and_users, name='cursus_and_users'),
    path('callback', API42Views.callback, name='callback'),
    path('send_friend_request/<int:userID>/', userManagementViews.send_friend_request, name='send friend request'),
    path('accept_friend_request/<int:requestID>/', userManagementViews.accept_friend_request, name='accept friend request'),
    path('decline_friend_request/<int:requestID>/', userManagementViews.decline_friend_request, name='decline friend request'),
    path('logout/', LogoutView.as_view(), name='logout'),
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
