import json
from django.shortcuts import render
from django.http import HttpResponse
from django.core import serializers
from .models import Favorite


# Create your views here.


def search_map(request):
    return render(request, "map/search_map.html")


def favorites(request):
    return render(request, "map/favorites.html")


def add_favorite(request):
    title = request.POST.get("title")
    address = request.POST.get("address")
    jibun = request.POST.get("jibun")
    link = request.POST.get("link")
    lat = request.POST.get("lat")
    lng = request.POST.get("lng")

    try:
        my_fav = Favorite.objects.get(title=title)
        my_fav.delete()
        result = {"text": "☆", "color": "black"}
    except Favorite.DoesNotExist:
        fav = Favorite.objects.create(
            title=title, address=address, jibun=jibun, link=link, lat=lat, lng=lng
        )
        result = {"text": "★", "color": "yellow"}

    return HttpResponse(json.dumps(result), content_type="application/json")


def update_favorite(request):
    title = request.POST.get("title")

    try:
        my_fav = Favorite.objects.get(title=title)
        result = {"text": "★", "color": "yellow"}
    except Favorite.DoesNotExist:
        result = {"text": "☆", "color": "black"}

    return HttpResponse(json.dumps(result), content_type="application/json")


def get_favorite(request):
    favs = serializers.serialize("json", Favorite.objects.all())
    return HttpResponse(favs, content_type="application/json")
