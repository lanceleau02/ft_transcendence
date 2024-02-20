from django.shortcuts import render

def home(request):
	return render(request, "frontend/index.html")

def batcave(request):
	return render(request, "frontend/views/batcave.html")

def batprofile(request):
	return render(request, "frontend/views/batprofile.html")

def batpong(request):
	return render(request, "frontend/views/batpong.html")