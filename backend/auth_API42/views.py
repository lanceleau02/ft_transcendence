import logging
import os
import requests
from django.shortcuts import render, redirect
from django.contrib.auth import login, authenticate
from user_management.models import User
from requests_oauthlib import OAuth2Session
from django.http import JsonResponse
from django.core.files.base import ContentFile
from django.core.files.uploadedfile import InMemoryUploadedFile
from auth_2FA.jwt import set_all_cookies_jwt
from django.http import HttpResponseRedirect, HttpResponse

logger = logging.getLogger(__name__)

def get_cursus_and_users(request):
    UID = os.environ.get("UID_CLIENT")
    SECRET = os.environ.get("SECRET_CLIENT")
    redirect_uri = "https://localhost:8000/callback"

    client = OAuth2Session(UID, redirect_uri=redirect_uri)
    authorization_url, state = client.authorization_url('https://api.intra.42.fr/oauth/authorize')

    request.session['oauth_state'] = state
    request.session.save()
    
    return JsonResponse({
        'authorization_url': authorization_url,
        'state': state
    })
    
def callback(request):
    state = request.GET.get('state')
    stored = request.session.get('oauth_state')
    UID = os.environ.get("UID_CLIENT")
    redirect_uri = "https://localhost:8000/callback"

    code = request.GET.get('code')
    if not code:
        return JsonResponse({'error': 'No authorization code'}, status=400)
    if state != stored:
        return JsonResponse({'error': 'Invalid state parameter'}, status=400)
 
    user_info = get_token(request, UID, code, redirect_uri)
    if user_info is None:
        return JsonResponse({'error': 'Invalid data user'}, status=400)
    
    username = user_info.get('login')
    if username is None:
        return JsonResponse({'error': 'Invalid username'}, status=400)
    
    email = user_info.get('email')
    if email is None:
        return JsonResponse({'error': 'Invalid email'}, status=400)

    image = user_info.get('image', {}).get('versions', {}).get('medium')   
    avatar = get_avatar(request, image)

    users = User.objects.filter(username=username)
    if not users.exists():
        users = User.objects.filter(email=email)
        if not users.exists():
            user = User.objects.create_user(username=username, email=email, password=None, avatar=avatar, log42api=True)
            exist = User.objects.filter(username=username).exists()
            if not exist:
                return JsonResponse({'loginForm': False})
        else:
            user = users.first()
    else:
        user = users.first()
  
    token = request.session.get('oauth_token')
    user.access_token = token['access_token']
    user.refresh_token = token.get('refresh_token')
    user.save()

    if user.log2fa is True:
        if hasattr(user, 'two_factor_auth_data'):
            request.session['user_id'] = user.id
            response = redirect('signin')
            response.set_cookie('otp_callback_42', 'true')
            return response

    login(request, user, backend='allauth.account.auth_backends.AuthenticationBackend')

    response = HttpResponseRedirect('/batpong/')
    response = set_all_cookies_jwt(request, response, user)
    return response

def callback_otp(request):
    response = JsonResponse({'OTPEnabled': True})
    response.delete_cookie('otp_callback_42')
    return response

def get_avatar(request, image):
    response = requests.get(image)
    image_content = response.content

    uploaded_file = InMemoryUploadedFile(
        file=ContentFile(image_content),
        field_name='avatar',
        name="image.jpg",
        content_type='image/jpeg',
        size=len(image_content),
        charset=None
    )
    return uploaded_file

def get_token(request, client_id, code, redirect_uri):
    token_url = 'https://api.intra.42.fr/oauth/token'
    user_info_url = 'https://api.intra.42.fr/v2/me'
    client_secret = os.environ.get("SECRET_CLIENT")
    
    oauth = OAuth2Session(client_id, redirect_uri=redirect_uri)

    token = oauth.fetch_token(token_url=token_url, client_secret=client_secret, code=code)
    
    request.session['oauth_token'] = token
    response = oauth.get(user_info_url)
    if response.status_code == 200:
        user_info = response.json()
    else:
        return None
    return user_info