from django.shortcuts import render

# Create your views here.


def search_map(request):
    return render(request, "map/search_map.html")


def favorites(request):
    return render(request, "map/favorites.html")
