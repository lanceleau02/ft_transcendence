from django.shortcuts import render
from authentication.models import User
from authentication.forms import AvatarForm
from authentication.forms import UpdateUsername
from django.contrib.auth.decorators import login_required
from authentication.forms import CustomPasswordChangeForm

def home(request):
	user = request.user
	return render(request, "index.html", {'user': user})

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
		friend_id = request.POST.get('friend_id')
		action = request.POST.get('action')
		if formUsername.is_valid():
			formUsername.save()
			return render(request, 'index.html')
		if formPassword.is_valid():
			formPassword.save()
			return render(request, 'index.html')
		if formAvatar.is_valid():
			user.avatar = formAvatar.cleaned_data['avatar']
			user.save()
			return render(request, 'index.html')

		# Friends management
		if action == 'add':
			friend = User.objects.get(id=friend_id)
			user.friends.add(friend)
		elif action == 'remove':
			friend = User.objects.get(id=friend_id)
			user.friends.remove(friend)

	else:
		formUsername = UpdateUsername()
		formPassword = CustomPasswordChangeForm(request.user, request.POST)
		formAvatar = AvatarForm()
		friends = user.friends.all()
		return render(request, 'views/batprofile.html', {
			'formUsername': formUsername, 
			'user': user, 'formPassword':formPassword, 
			'formAvatar':formAvatar,
			'avatar_url':avatar_url,
			'friends':friends
		})

def batpong(request):
	return render(request, "views/batpong.html")