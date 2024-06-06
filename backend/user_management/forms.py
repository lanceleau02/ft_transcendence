from django import forms
from .models import User, Match
from django.contrib.auth import get_user_model
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.forms import PasswordChangeForm

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

    def clean_username(self):
        username = self.cleaned_data.get('username')
        if get_user_model().objects.filter(username=username).exists():
            raise ValidationError("This username is already taken. Please chose another one.")
        return username

class UpdateUsername(forms.ModelForm):
    class Meta:
        model = get_user_model()
        fields = ['username']
        labels = {
            'username': 'New Username',
        }
    
    def clean_username(self):
        username = self.cleaned_data.get('username')
        if get_user_model().objects.filter(username=username).exists():
            raise ValidationError("This username is already taken. Please chose another one.")
        return username

class AvatarForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ['avatar']
        labels = {
            'avatar': 'Select an image:'
        }

class MatchForm(forms.ModelForm):
    class Meta:
        model = Match
        fields = ['winner', 'loser', 'score', 'score_w', 'score_l', 'rival']

    def __init__(self, *args, **kwargs):
        super(MatchForm, self).__init__(*args, **kwargs)
        self.fields['winner'].queryset = User.objects.all()
        self.fields['loser'].queryset = User.objects.all()

        self.fields['winner'].required = False
        self.fields['loser'].required = False

    def clean(self):
        cleaned_data = super().clean()
        winner = cleaned_data.get('winner')
        loser = cleaned_data.get('loser')

        # Replace 'null' strings with None
        if winner == '':
            cleaned_data['winner'] = None
        if loser == '':
            cleaned_data['loser'] = None

        return cleaned_data

class CustomPasswordChangeForm(PasswordChangeForm):
    old_password = forms.CharField(
        widget=forms.PasswordInput(attrs={'class': 'form-control', 'type':'password'}),
        required=True,
        label="Current password"
    )
    new_password1 = forms.CharField(
        max_length=100,
        widget=forms.PasswordInput(attrs={'class': 'form-control', 'type':'password'}),
        required=True,
        label="New password"
    )
    new_password2 = forms.CharField(
        max_length=100,
        widget=forms.PasswordInput(attrs={'class': 'form-control', 'type':'password'}),
        required=True,
        label="Confirm new password"
    )

    def clean(self):
        cleaned_data = super().clean()
        user = self.user
        old_password = cleaned_data.get("old_password")
        new_password1 = cleaned_data.get("new_password1")
        new_password2 = cleaned_data.get("new_password2")

        if new_password1 and new_password2 and new_password1 != new_password2:
            raise forms.ValidationError("The passwords do not match.")

        if old_password and not user.check_password(old_password):
            self.add_error('old_password', "The old password is incorrect.")

        return cleaned_data

    def save(self, commit=True):
        user = super().save(commit=False)
        if self.cleaned_data["new_password1"]:
            user.set_password(self.cleaned_data["new_password1"])
            if commit:
                user.save()
        return user