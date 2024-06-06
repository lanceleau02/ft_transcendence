from django.shortcuts import render
from user_management.forms import LoginForm, AvatarForm, UpdateUsername, CustomPasswordChangeForm, MatchForm
from user_management.models import User, Friend_Request, Match
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
import logging
""" from django.utils.translation import activate """

def home(request):
	user = request.user
	return render(request, "index.html", {'user': user})

def batpong(request):
	form = MatchForm()
	if request.method == 'POST':
		form = MatchForm(request.POST)
		if form.is_valid():
			form.save()
			last_match = Match.objects.last()
			username = last_match.winner.username if last_match.winner else "guest"
			username2 = last_match.loser.username if last_match.loser else "guest"
			return JsonResponse({'MatchForm': True, 
				'winner': username,
				'loser': username2,
				'score': last_match.score
			})
		else:
			errors = form.errors.as_json()
			return JsonResponse({'success': False, 'errors': errors})
	else:
		if request.GET.get('Valid') == "true":
			return render(request, "views/batpong.html", {'MatchForm':MatchForm})
	return render(request, "index.html")

def batcave(request):
	if request.GET.get('Valid') == "true":
		if request.user.is_authenticated == False:
			form = LoginForm()
			return render(request, 'views/signin.html', context={'form': form})
		user = request.user
		return render(request, "views/batcave.html", {'user': user})
	return render(request, "index.html")

def batprofile(request):
	if request.GET.get('Valid') == "true":
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
				new_username = formUsername.cleaned_data['username']
				formUsername.save()
				data = {'formUsername': True, 'username': new_username}
				return JsonResponse(data)
			if formPassword.is_valid():
				formPassword.save()
				return JsonResponse({'formPassword': True})
			if 'avatar' in request.FILES and formAvatar.is_valid():
				user.avatar = formAvatar.cleaned_data['avatar']
				user.save()
				return JsonResponse({'formAvatar': True, 'avatar': user.avatar.url})
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

logger = logging.getLogger(__name__)

from django.utils.translation import activate

def update_language(request):
	if request.method == "POST":
		language = request.POST.get("language")
		if language in ["en", "fr", "es"]:
			if request.user.is_authenticated:
				request.user.language = language
				request.user.save()
				return JsonResponse({"status": "success"})
		else:
			return JsonResponse({"status": "error"})
	return JsonResponse({"status": "not POST"})

def custom_404_view(request, exception):
	return render(request, 'index.html', status=404)

def custom_500_view(request, exception):
	return render(request, 'index.html', status=500)
