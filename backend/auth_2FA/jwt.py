import jwt
import os
import time
from user_management.models import User
from datetime import timedelta, datetime
from django.http import JsonResponse
from django.http import HttpResponseRedirect
from django.middleware import csrf
import logging

logger = logging.getLogger(__name__)

SECRET_KEY = os.environ.get("JWT_SECRET_KEY")

def generate_JWTS(user):
    payload = {
        'sub': user.pk,
        'username': user.username,
        'token_type': 'access_token',
        'iat': int(time.time()),
        'exp': datetime.utcnow() + timedelta(minutes=5)
    }
    access_token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")

    payload_refresh = {
        'sub': user.pk,
        'token_type': 'refresh_token',
        'iat': int(time.time()),
        'exp': datetime.utcnow() + timedelta(days=1)
    }
    refresh_token = jwt.encode(payload_refresh, SECRET_KEY, algorithm="HS256")

    return access_token, refresh_token

def generate_refresh_JWT(request):
    refresh_token = request.COOKIES.get('jwt_refresh')
    if refresh_token:
        try:
            payload = jwt.decode(refresh_token, SECRET_KEY, algorithms=['HS256'])
            user = User.objects.get(id=payload['sub'])
            access_token, _ = generate_JWTS(user)
            return access_token
        except jwt.ExpiredSignatureError:
            return None
        except User.DoesNotExist:
            return None
    return None

def set_all_cookies_jwt(request, response, user):
    token = request.COOKIES.get('jwt_access')
    if not token:
        access_token, refresh_token = generate_JWTS(user)
        response.set_cookie(
            key='jwt_access',
            value=access_token,
            httponly=True,
            secure=True,
            samesite='Lax',
        )
        response.set_cookie(
            key='jwt_refresh',
            value=refresh_token,
            httponly=True,
            secure=True,
            samesite='Lax',
        )
    csrf.get_token(request)
    user.is_online = True
    user.save()
    return response


def set_cookie_jwt_access(request):
    refresh_token = request.COOKIES.get('jwt_refresh', '')
      
    if refresh_token:
        access_token = generate_refresh_JWT(request)
        if access_token is None:
            return None
        
        current_url = request.get_full_path()
        response = HttpResponseRedirect(current_url)
        response.set_cookie(
            key='jwt_access', 
            value=access_token,
            httponly=True,
            secure=True,
            samesite='Lax'
        )
        return response
    return None

def logout_jwt_error(request):
    current_url = request.get_full_path()
    response = HttpResponseRedirect(current_url)
    response.delete_cookie('jwt_access', path='/', domain='localhost')
    response.delete_cookie('jwt_refresh', path='/', domain='localhost')
    response.set_cookie('logout_status', 'true')
    return response