import base64
import io
from .utils import user_two_factor_auth_data_create
from .jwt import set_all_cookies_jwt
from django.http import JsonResponse
from django.http import HttpResponse
from django.contrib.auth.decorators import login_required
from user_management.models import User, UserTwoFactorAuthData
from django.contrib.auth import login
import logging

logger = logging.getLogger(__name__)

@login_required
def on_model_2fa(request):
    user = request.user
    two_factor_auth_data = user_two_factor_auth_data_create(user=user)
    if two_factor_auth_data:
        qr_code = two_factor_auth_data.generate_qr_code(name=user.username)
        buffer = io.BytesIO()
        qr_code.save(buffer, format='PNG')
        qr_code_base64 = base64.b64encode(buffer.getvalue()).decode()
        response = JsonResponse({
            'success': True,
            'qr_code': qr_code_base64
        })
    return response

@login_required
def off_model_2fa(request):
    user = request.user
    two_factor_auth_data = UserTwoFactorAuthData.objects.filter(user=user).first()
    if two_factor_auth_data:
        user.two_factor_auth_data.delete()
        user.log2fa = False
        user.save()
        return JsonResponse({'success': True})
    user.log2fa = False
    user.save()
    return JsonResponse({'success': False})

@login_required
def view_qrcode(request):
    user = request.user
    two_factor_auth_data = UserTwoFactorAuthData.objects.filter(user=user).first()
    if two_factor_auth_data:
        qr_code = two_factor_auth_data.generate_qr_code(name=user.username)
        response = HttpResponse(content_type="image/png")
        qr_code.save(response, "PNG")
        return response

@login_required
def verify_2fa(request):
    if request.method == 'POST':
        otp = request.POST.get('otp')
        user = request.user
        two_factor_auth_data = UserTwoFactorAuthData.objects.filter(user=user).first()
        
        if two_factor_auth_data is None:
            return JsonResponse({'success': False})
        
        if two_factor_auth_data.validate_otp(otp) is False:
            return JsonResponse({'success': False})
        
        user.log2fa = True
        user.save()
        return JsonResponse({'success': True})

def otp_login_check(request):
    if request.method == 'POST':
        otp = request.POST.get('otp')
        user_id = request.session.get('user_id')
        if user_id:
            user = User.objects.get(id=user_id)
        else:
            return JsonResponse({'loginForm': False})

        two_factor_auth_data = UserTwoFactorAuthData.objects.filter(user=user).first()

        if two_factor_auth_data is None:
            return JsonResponse({'success': False})
        if two_factor_auth_data.validate_otp(otp) is False:
            return JsonResponse({'success': False})
  
        if user.log42api is True:
            login(request, user, backend='allauth.account.auth_backends.AuthenticationBackend')
        else:
            login(request, user, backend='django.contrib.auth.backends.ModelBackend')
        
        response = JsonResponse({'loginForm': True})
        response = set_all_cookies_jwt(request, response, user)
        return response
        