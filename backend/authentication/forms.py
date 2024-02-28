from django import forms
from django.contrib.auth import get_user_model
from django.contrib.auth.forms import UserCreationForm

class LoginForm(forms.Form):
	email = forms.CharField(max_length=50, label='Email')
	username = forms.CharField(max_length=50, label='Username')
	password = forms.CharField(max_length=15, widget=forms.PasswordInput, label='Password')

class SignupForm(UserCreationForm):
	class Meta(UserCreationForm.Meta):
		model = get_user_model()
		fields = ('username', 'email')