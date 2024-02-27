# authentication/views.py
from django.shortcuts import render

from . import forms

def signup(request):
    return render(request, 'views/signup.html')