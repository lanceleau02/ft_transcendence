from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from authentication.models import User
from authentication.forms import UpdateUsername
from authentication.forms import CustomPasswordChangeForm
from authentication.forms import AvatarForm

def home(request):
	return render(request, "index.html")

@login_required
def batcave(request):
	user = request.user
	return render(request, "views/batcave.html", {'user': user})

@login_required
def batprofile(request):
	user = request.user
	avatar_url = user.avatar.url if user.avatar else None
	if request.method == 'POST':
		formUsername = UpdateUsername(request.POST, instance=request.user)
		formPassword = CustomPasswordChangeForm(request.user, request.POST)
		formAvatar = AvatarForm(request.POST, request.FILES)
		if formUsername.is_valid():
			formUsername.save()
			return render(request, 'index.html')
		if formPassword.is_valid():
			formPassword.save()
			return render(request, 'index.html')
		if formAvatar.is_valid():
			user.avatar = formAvatar.cleaned_data['avatar']
			user.save()
			avatar_url = user.avatar.url if user.avatar else None
			return render(request, 'index.html')
	else:
		formUsername = UpdateUsername()
		formPassword = CustomPasswordChangeForm(request.user, request.POST)
		formAvatar = AvatarForm()
		return render(request, 'views/batprofile.html', {
			'formUsername': formUsername, 
			'user': user, 'formPassword':formPassword, 
			'formAvatar':formAvatar,
			'avatar_url':avatar_url
		})

def batpong(request):
	return render(request, "views/batpong.html")