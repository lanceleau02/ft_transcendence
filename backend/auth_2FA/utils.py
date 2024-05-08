import pyotp
from user_management.models import UserTwoFactorAuthData

def user_two_factor_auth_data_create(*, user) -> UserTwoFactorAuthData:
    if hasattr(user, 'two_factor_auth_data'):
        two_factor_auth_data = UserTwoFactorAuthData.objects.filter(user=user).first()
        return two_factor_auth_data
    
    two_factor_auth_data = UserTwoFactorAuthData.objects.create(
        user=user,
        otp_secret=pyotp.random_base32()
    )

    return two_factor_auth_data
