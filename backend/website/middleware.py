import jwt
import os
from django.utils.deprecation import MiddlewareMixin
from django.contrib.auth.models import User
from user_management.models import User
from django.http import JsonResponse
from django.contrib.auth import get_user_model
from django.contrib.auth import logout
from django.http import HttpResponseRedirect
from auth_2FA.jwt import set_cookie_jwt_access, logout_jwt_error
import logging
from django.utils import timezone

logger = logging.getLogger(__name__)

SECRET_KEY = os.environ.get("JWT_SECRET_KEY")

class CustomMiddlewareJWT(MiddlewareMixin):
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        return response
    
    def process_view(self, request, view_func, view_args, view_kwargs):
        User = get_user_model()    
        token = request.COOKIES.get('jwt_access', '')

        if token:
            try:
                payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
                user_jwt = User.objects.get(id=payload['sub'])
                request.user = user_jwt
                return None
            except User.DoesNotExist:
                response = logout_jwt_error(request)
                return response
            except jwt.ExpiredSignatureError:
                response = set_cookie_jwt_access(request)
                if response is None:
                    logout(request)
                    response = logout_jwt_error(request)
                return response
            except (jwt.DecodeError, jwt.InvalidTokenError, jwt.InvalidIssuedAtError):
                logout(request)
                response = logout_jwt_error(request)
                return response
            except Exception as e:
                return JsonResponse(f"error: {e}")
        else:
            response = set_cookie_jwt_access(request)
            if response:
                return response
            else:
                user = request.user
                if user:
                    if user.is_authenticated:
                        logout(request)
                        response = logout_jwt_error(request)
                        return response
            return None

class   UpdateLastActiveMiddleware(MiddlewareMixin):
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if request.user.is_authenticated:
            request.user.last_active_at = timezone.now()
            request.user.save(update_fields=['last_active_at'])
        response = self.get_response(request)
        return response