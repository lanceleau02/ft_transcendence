import logging
from django.shortcuts import render, redirect
from . import forms
from django.contrib.auth import login, authenticate
from django.contrib import messages

logger = logging.getLogger(__name__)

def signin(request):
    logger.debug("JE SUIS PAS ENCORE CO PUTAIN DE MERDE")
    if request.method == 'POST':
        logger.debug("JE SUIS PAS ENCORE COplusun PUTAIN DE MERDE")
        form = forms.LoginForm(request.POST)
        if form.is_valid():
                logger.debug("JE SUIS PAS ENCORE COplusdeux PUTAIN DE MERDE")
                email=form.cleaned_data['email']
                username=form.cleaned_data['username']
                password=form.cleaned_data['password']
                user = authenticate(request, email=email, username=username, password=password)
                if user is not None:
                    login(request, user)
                    return redirect('batpong')
                else:
                    message = 'Identifiants invalides.'
                    return render(request, 'views/login.html', {'form': form})
    else:
        form = forms.LoginForm()
        return render(request, 'views/login.html', context={'form': form})

def signup(request):
    try:
        form = forms.SignupForm()
        if request.method == 'POST':
            form = forms.SignupForm(request.POST)
            if form.is_valid():
                form.save()
                #login(request, user)
                return redirect('batpong')
        return render(request, 'views/signup.html', context={'form': form})
    except Exception as e:
        logger.error(f"expception occurend: {e}")

