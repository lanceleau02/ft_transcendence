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
from django.conf.urls import handler404
from django.contrib import admin
from . import views as mainViews
from django.conf import settings
from django.urls import path, include
from django.conf.urls.static import static
from auth_API42 import views as API42Views
from user_management import views as userManagementViews
from auth_2FA import views as auth2FA

handler404 = 'website.views.custom_404_view'
""" handler500 = 'website.views.custom_500_view' """

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', mainViews.home, name='batpong'),
    path('batpong/', mainViews.batpong, name='batpong'),
    path('batcave/', mainViews.batcave, name='batcave'),
    path('batprofile/', mainViews.batprofile, name='batprofile'),
    path('signin/', userManagementViews.signin, name='signin'),
    path('signup/', userManagementViews.signup, name='signup'),
    path('cursus-and-users', API42Views.get_cursus_and_users, name='cursus_and_users'),
    path('callback', API42Views.callback, name='callback'),
    path('callback_otp/', API42Views.callback_otp, name='callback_otp'),
    path('send_friend_request/<int:userID>/', userManagementViews.send_friend_request, name='send friend request'),
    path('accept_friend_request/<int:requestID>/', userManagementViews.accept_friend_request, name='accept friend request'),
    path('decline_friend_request/<int:requestID>/', userManagementViews.decline_friend_request, name='decline friend request'),
    path('logout/', userManagementViews.CustomLogoutView.as_view(), name='logout'),
    path('verify_2fa', auth2FA.verify_2fa, name='verify_2fa'),
    path('qr_code/', auth2FA.view_qrcode, name='qr_code'),
    path('on_model_2fa/', auth2FA.on_model_2fa, name='on_2fa'),
    path('off_model_2fa/', auth2FA.off_model_2fa, name='off_2fa'),
    path('otp_login_check', auth2FA.otp_login_check, name='otp_login_check'),
    path('display_user_profil/<int:userID>/', userManagementViews.display_user_profil, name='display_user_profil'),
    path('check_activity', userManagementViews.check_activity, name='check_activity'),
    path('unload_user', userManagementViews.unload_user, name='unload_user'),
    path('update_language/', mainViews.update_language, name='update_language'),
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
