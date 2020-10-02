from django.urls import path
from . import views

app_name = "map"

urlpatterns = [
    path("", views.search_map, name="search"),
    path("favorites/", views.favorites, name="favorites"),
]
