# authentication/forms.py
from django import forms
from models import User

class LoginForm(forms.Form):
    class Meta:
        model = User
        fields: '__all__'