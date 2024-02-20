from django.shortcuts import render

def home(request):
	return render(request, "index.html")

def batcave(request):
	return render(request, "views/batcave.html")

def batprofile(request):
	return render(request, "views/batprofile.html")

def batpong(request):
	return render(request, "views/batpong.html")