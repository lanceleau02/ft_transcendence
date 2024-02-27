from django.contrib.auth.models import AbstractBaseUser
from django.db import models

class User(AbstractBaseUser):
	email = models.EmailField(unique=True)
	username = models.CharField(max_length=10, blank=True, null=True)
	is_active = models.BooleanField(default=True)

	USERNAME_FIELD = 'email'
	REQUIRED_FIELDS = []
