from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from authentication.models import User
from authentication.forms import UpdateUsername
from authentication.forms import UpdatePassword

def home(request):
	return render(request, "index.html")

@login_required
def batcave(request):
	user = request.user
	return render(request, "views/batcave.html", {'user': user})

@login_required
def batprofile(request):
	user = request.user
	if request.method == 'POST':
		formUsername = UpdateUsername(request.POST, instance=request.user)
		formPassword = UpdatePassword(request.POST, instance=request.user)
		# Upadate username
		if formUsername.is_valid():
			formUsername.save()
			return render(request, 'index.html')
		if formPassword.is_valid():
			formPassword.save()
			return render(request, 'index.html')
	else:
		formUsername = UpdateUsername()
		formPassword = UpdatePassword()
		return render(request, 'views/batprofile.html', {'formUsername': formUsername, 'user': user, 'formPassword':formPassword})

def batpong(request):
	return render(request, "views/batpong.html")