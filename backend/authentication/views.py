# authentication/views.py
from django.shortcuts import render

from . import forms

def signup(request):
    form = forms.LoginForm()
    if request.method == 'POST':
        form = forms.LoginForm(request.POST)
        if form.is_valid():
            pass
    return render(request, 'views/signup.html', context={'form': form})