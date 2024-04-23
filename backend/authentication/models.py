from django.contrib.auth.models import AbstractBaseUser, UserManager
from django.db import models

class User(AbstractBaseUser):
	email = models.EmailField(max_length=50, unique=True, null=False)
	username = models.CharField(max_length=50, unique=True, null=True)
	avatar = models.ImageField(default='default.jpg')
	friends = models.ManyToManyField("self", blank=True)
	is_active = models.BooleanField(default=True)
	is_staff = models.BooleanField(default=False)
	is_superuser = models.BooleanField(default=False)
	language = models.CharField(max_length=2, null=False, default="en")

	USERNAME_FIELD = 'username'
	REQUIRED_FIELDS = ['email']

	objects = UserManager()

	def get_last_three_matches(self):
		last_matches = Match.objects.filter(models.Q(winner=self) | models.Q(loser=self)).order_by('-match_date')[:3]
		return last_matches
	
	def total_matches_played(self):
		return Match.objects.filter(Q(winner=self) | Q(loser=self)).count()

	def total_wins(self):
		return Match.objects.filter(winner=self).count()

	def total_losses(self):
		return Match.objects.filter(loser=self).count()

class Friend_Request(models.Model):
	from_user = models.ForeignKey(User, related_name='from_user', on_delete=models.CASCADE)
	to_user = models.ForeignKey(User, related_name='to_user', on_delete=models.CASCADE)

class Match(models.Model):
	winner = models.ForeignKey(User, related_name='won_matches', on_delete=models.CASCADE)
	loser = models.ForeignKey(User, related_name='lost_matches', on_delete=models.CASCADE)
	score = models.CharField(max_length=50)
	match_date = models.DateTimeField(auto_now_add=True)
