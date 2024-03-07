from django import forms
from django.contrib.auth import get_user_model
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.forms import PasswordChangeForm

class LoginForm(forms.Form):
	username = forms.CharField(max_length=50, label='Username')
	password = forms.CharField(max_length=15, widget=forms.PasswordInput, label='Password')

class SignupForm(UserCreationForm):
	class Meta(UserCreationForm.Meta):
		model = get_user_model()
		fields = ('username', 'email')

class UpdateUsername(forms.ModelForm):
    class Meta:
        model = get_user_model()
        fields = ['username']

class AvatarForm(forms.Form):
    avatar = forms.ImageField(label='Choose an avatar', required=False)

class CustomPasswordChangeForm(PasswordChangeForm):
    new_password1 = forms.CharField(label="New password", strip=False, widget=forms.PasswordInput, required=False)
    new_password2 = forms.CharField(label="Confirm new password", strip=False, widget=forms.PasswordInput, required=False)

    def __init__(self, user, *args, **kwargs):
        super().__init__(user, *args, **kwargs)
        self.fields['new_password1'].required = False
        self.fields['new_password2'].required = False

    def clean_new_password1(self):
        password1 = self.cleaned_data.get('new_password1')
        if password1 and len(password1) < 8:
            raise forms.ValidationError("Password must be at least 8 characters long.")
        return password1

    def clean_new_password2(self):
        password1 = self.cleaned_data.get('new_password1')
        password2 = self.cleaned_data.get('new_password2')
        if password1 and password2 and password1 != password2:
            raise forms.ValidationError("The two password fields didn't match.")
        return password2

    def clean(self):
        cleaned_data = super().clean()
        password1 = cleaned_data.get('new_password1')
        password2 = cleaned_data.get('new_password2')
        if password1 or password2:
            if not password1:
                raise forms.ValidationError("New password is required.")
            if not password2:
                raise forms.ValidationError("Confirm new password is required.")
            if password1 != password2:
                raise forms.ValidationError("The two password fields didn't match.")
        return cleaned_data