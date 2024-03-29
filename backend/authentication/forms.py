from django import forms
from django.contrib.auth import get_user_model
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.forms import PasswordChangeForm
from .models import User

class LoginForm(forms.Form):
	username = forms.CharField(max_length=50, label='Username')
	password = forms.CharField(max_length=15, widget=forms.PasswordInput, label='Password')

class SignupForm(UserCreationForm):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['password2'].help_text = None

    class Meta(UserCreationForm.Meta):
        model = get_user_model()
        fields = ('username', 'email')

class UpdateUsername(forms.ModelForm):
    class Meta:
        model = get_user_model()
        fields = ['username']

class AvatarForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ['avatar']
       # avatar = forms.ImageField(label='Choose an avatar', required=False)

from django import forms
from django.contrib.auth.forms import PasswordChangeForm

class CustomPasswordChangeForm(PasswordChangeForm):
    old_password = forms.CharField(
        widget=forms.PasswordInput(attrs={'class': 'form-control', 'type':'password'}),
        required=False
    )
    new_password1 = forms.CharField(
        max_length=100,
        widget=forms.PasswordInput(attrs={'class': 'form-control', 'type':'password'}),
        required=False
    )
    new_password2 = forms.CharField(
        max_length=100,
        widget=forms.PasswordInput(attrs={'class': 'form-control', 'type':'password'}),
        required=False
    )

    def clean(self):
        cleaned_data = super().clean()
        old_password = cleaned_data.get("old_password")
        new_password1 = cleaned_data.get("new_password1")
        new_password2 = cleaned_data.get("new_password2")

        if new_password1 and new_password2 and new_password1 != new_password2:
            raise forms.ValidationError("Les nouveaux mots de passe ne correspondent pas.")

        if not old_password:
            del self._errors["old_password"]

        return cleaned_data

    def save(self, commit=True):
        user = super().save(commit=False)
        if self.cleaned_data["new_password1"]:
            user.set_password(self.cleaned_data["new_password1"])
            if commit:
                user.save()
        return user