from django.contrib.auth.models import AbstractBaseUser, UserManager
from django.db import models

class User(AbstractBaseUser):
	email = models.EmailField(max_length=50, unique=True, null=False)
	username = models.CharField(max_length=50, unique=True, null=True)
	avatar = models.ImageField(default='default.png')

	USERNAME_FIELD = 'username'
	REQUIRED_FIELDS = ['email']

	objects = UserManager()
