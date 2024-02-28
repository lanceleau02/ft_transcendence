from django.contrib.auth.models import AbstractBaseUser
from django.db import models

class User(AbstractBaseUser):
	email = models.EmailField(max_length=50, unique=True)
	username = models.CharField(max_length=12, unique=True)

	USERNAME_FIELD = 'email'
