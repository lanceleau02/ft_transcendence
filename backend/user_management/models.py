import pyotp
import qrcode
import qrcode.image.svg
from django.contrib.auth.models import AbstractBaseUser, UserManager
from django.db import models
from django.http import JsonResponse
from typing import Optional
from django.conf import settings
from django_otp.plugins.otp_totp.models import TOTPDevice
import logging

logger = logging.getLogger(__name__)

class User(AbstractBaseUser):
	email = models.EmailField(max_length=50, unique=True, null=False)
	username = models.CharField(max_length=20, unique=True, null=True)
	avatar = models.ImageField(default='default.jpg')
	friends = models.ManyToManyField("self", blank=True)
	is_active = models.BooleanField(default=True)
	is_staff = models.BooleanField(default=False)
	is_superuser = models.BooleanField(default=False)
	log2fa = models.BooleanField(default=False)
	log42api = models.BooleanField(default=False)
	is_online = models.BooleanField(default=False)
	language = models.CharField(max_length=2, null=False, default="en")
	last_active_at = models.DateTimeField(null=True, blank=True)

	USERNAME_FIELD = 'username'
	REQUIRED_FIELDS = ['email']

	objects = UserManager()

	def last_three_matches(self):
		return Match.objects.filter(models.Q(winner=self) | models.Q(loser=self)).order_by('-match_date')[:3]
	
	def total_matches_played(self):
		return Match.objects.filter(models.Q(winner=self) | models.Q(loser=self)).count()

	def total_wins(self):
		return Match.objects.filter(winner=self).count()

	def total_losses(self):
		return Match.objects.filter(loser=self).count()
	
	def win_rate(self):
		if self.total_matches_played() > 0:
			win_rate = (self.total_wins() / self.total_matches_played()) * 100
			return round(win_rate, 0)
		return 0
	
	def user_score(self):
		matches = Match.objects.filter(models.Q(winner=self) | models.Q(loser=self)).order_by('-match_date')[:10]
		match_info = []
		for match in matches:
			score_parts = match.score.split('-')
			if match.winner == self:
				user_score = int(score_parts[0])
			else:
				user_score = int(score_parts[1])
			match_info.append(user_score)
		return match_info

class Friend_Request(models.Model):
	from_user = models.ForeignKey(User, related_name='from_user', on_delete=models.CASCADE)
	to_user = models.ForeignKey(User, related_name='to_user', on_delete=models.CASCADE)

class Match(models.Model):
	winner = models.ForeignKey(User, related_name='won_matches', on_delete=models.CASCADE, null=True)
	loser = models.ForeignKey(User, related_name='lost_matches', on_delete=models.CASCADE, null=True)
	rival = models.CharField(max_length=50, default='Guest')
	score = models.CharField(max_length=50)
	score_w = models.CharField(max_length=50, default='0')
	score_l = models.CharField(max_length=50, default='0')
	match_date = models.DateTimeField(auto_now_add=True)

	def to_dict(self):
		return {
			'id': self.pk,
			'winner': self.winner.username if self.winner else None,
    	    'loser': self.loser.username if self.loser else None,
    	    'score': self.score,
			'score_w': self.score_w,
			'score_l': self.score_l,
			'rival' : self.rival,
    	    'date': self.match_date.strftime('%Y-%m-%d %H:%M:%S'), 
		}

class UserTwoFactorAuthData(models.Model):
	user = models.OneToOneField(
		settings.AUTH_USER_MODEL,
		related_name='two_factor_auth_data',
		on_delete=models.CASCADE
	)

	otp_secret = models.CharField(max_length=255)

	def generate_qr_code(self, name: Optional[str] = None) -> str:
		totp = pyotp.TOTP(self.otp_secret, interval=30)
		uri = totp.provisioning_uri(
			name=name,
			issuer_name='Batpong 2fa'
		)
		qr_code_image = qrcode.make(uri)	
		return qr_code_image

	def validate_otp(self, otp: str) -> bool:
		totp = pyotp.TOTP(self.otp_secret)
		is_valid = totp.verify(otp)
			
		if is_valid:
			return True
		else:
			return False