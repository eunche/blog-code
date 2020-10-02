from django.shortcuts import render

# Create your views here.


def search_map(request):
    return render(request, "map/search_map.html")


def my_map(request):
    return render(request, "map/my_map.html")
