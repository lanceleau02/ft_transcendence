from django.contrib.auth.models import AbstractBaseUser, UserManager
from django.db import models

class User(AbstractBaseUser):
	email = models.EmailField(max_length=50, unique=True, null=False)
	username = models.CharField(max_length=50, unique=True, null=True)
	avatar = models.ImageField(default='default.png')
	friends = models.ManyToManyField('self', blank=True)
	is_staff = models.BooleanField(default=False)
	is_superuser = models.BooleanField(default=False)

	USERNAME_FIELD = 'username'
	REQUIRED_FIELDS = ['email']

	objects = UserManager()

class Friend_Request(models.Model):
	from_user = models.ForeignKey(
		User, related_name='from_user', on_delete=models.CASCADE)
	to_user = models.ForeignKey(
		User, related_name='to_user', on_delete=models.CASCADE)