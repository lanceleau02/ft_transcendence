from django import forms

class LoginForm(forms.Form):
	email = forms.CharField(max_length=50, label='Email')
	username = forms.CharField(max_length=12, label='Username')
	password = forms.CharField(max_length=15, widget=forms.PasswordInput, label='Password')