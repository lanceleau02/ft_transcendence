from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from authentication.models import User

def home(request):
	return render(request, "index.html")

@login_required
def batcave(request):
	user = request.user
	return render(request, "views/batcave.html", {'user': user})

@login_required
def batprofile(request):
	return render(request, "views/batprofile.html")

def batpong(request):
	return render(request, "views/batpong.html")