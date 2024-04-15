import logging
import os
from django.shortcuts import render, redirect
from django.contrib.auth import login, authenticate
from authentication.models import User
from requests_oauthlib import OAuth2Session
#from django.http import HttpResponseRedirect
from django.http import JsonResponse

logger = logging.getLogger(__name__)

def get_cursus_and_users(request):
    UID = os.environ.get("UID_CLIENT")
    SECRET = os.environ.get("SECRET_CLIENT")
    redirect_uri = "https://localhost:8000/callback"

    client = OAuth2Session(UID, redirect_uri=redirect_uri)
    authorization_url, state = client.authorization_url('https://api.intra.42.fr/oauth/authorize')
    
    request.session['oauth_redirect_uri'] = redirect_uri
    request.session['oauth_state'] = state
    request.session.save()
    
    #return HttpResponseRedirect(authorization_url)
    return JsonResponse({
        'authorization_url': authorization_url,
        'state': state
    })
    
def callback(request):
    state = request.GET.get('state')
    stored = request.session.get('oauth_state')
    UID = os.environ.get("UID_CLIENT")
    redirect_uri = request.session.get('oauth_redirect_uri')

    code = request.GET.get('code')
    if not code:
        #return HttpResponseRedirect("No authorization code", status=400)
        return JsonResponse({'error': 'No authorization code'}, status=400)
    if state != stored:
        return JsonResponse({'error': 'Invalid state parameter'}, status=400)
 
    user_info = get_token(request, UID, code, redirect_uri)
    if user_info is None:
        return JsonResponse({'error': 'Invalid data user'}, status=400)
    username = user_info.get('login')
    if username is None:
        return JsonResponse({'error': 'Invalid data user'}, status=400)
    email = user_info.get('email')

    users = User.objects.filter(username=username)
    if not users.exists():
        user = User.objects.create_user(username=username, email=email, password=None)
        exist = User.objects.filter(username=username).exists()
        if not exist:
            return render(request, 'index.html')
    else:
        user = users.first()
    login(request, user, backend='allauth.account.auth_backends.AuthenticationBackend')
    
    token = request.session.get('oauth_token')
    user.access_token = token['access_token']
    user.refresh_token = token.get('refresh_token')
    user.save()

    #return redirect('batpong')
    return JsonResponse({'loginForm': True})

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