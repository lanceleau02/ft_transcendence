from django.shortcuts import render
from authentication.forms import LoginForm, AvatarForm, UpdateUsername, CustomPasswordChangeForm
from authentication.models import User, Friend_Request
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse

def home(request):
	user = request.user
	return render(request, "index.html", {'user': user})

def batcave(request):
	if request.GET.get('Valid') == "true":
		if request.user.is_authenticated == False:
			form = LoginForm()
			return render(request, 'views/signin.html', context={'form': form})
		user = request.user
		return render(request, "views/batcave.html", {'user': user})
	return render(request, "index.html")

def batprofile(request):
	if request.user.is_authenticated == False:
		form = LoginForm()
		return render(request, 'views/signin.html', context={'form': form})
	user = request.user
	avatar_url = user.avatar.url if user.avatar else None
	if request.method == 'POST':
		formUsername = UpdateUsername(request.POST, instance=request.user)
		formPassword = CustomPasswordChangeForm(request.user, request.POST)
		formAvatar = AvatarForm(request.POST, request.FILES)
		if formUsername.is_valid():
			formUsername.save()
			return JsonResponse({'success': True})
		if formPassword.is_valid():
			formPassword.save()
			return JsonResponse({'success': True})
		if formAvatar.is_valid():
			user.avatar = formAvatar.cleaned_data['avatar']
			user.save()
			return JsonResponse({'success': True})
	else:
		formUsername = UpdateUsername()
		formPassword = CustomPasswordChangeForm(request.user)
		formAvatar = AvatarForm()
		all_users = User.objects.exclude(id=request.user.id).exclude(is_superuser=True)
		all_friend_request = Friend_Request.objects.filter(to_user=user)
		friends = user.friends.all()
		if request.GET.get('Valid') == "true":
			return render(request, "views/batprofile.html", {
				'formUsername':formUsername, 
				'user':user,
				'formPassword':formPassword,
				'formAvatar':formAvatar,
				'avatar_url':avatar_url,
				'all_users':all_users,
				'all_friend_request':all_friend_request,
				'friends':friends,
			})
	return render(request, "index.html")

def batpong(request):
	if request.GET.get('Valid') == "true":
		return render(request, "views/batpong.html")
	return render(request, "index.html")
