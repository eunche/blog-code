from django.urls import path
from . import views

app_name = "map"

urlpatterns = [
    path("", views.search_map, name="search"),
    path("favorites/", views.favorites, name="favorites"),
    path("api/map/1", views.add_favorite, name="add_favorite"),
    path("api/map/2", views.update_favorite, name="update_favorite"),
    path("api/map/3", views.get_favorite, name="get_favorite"),
]
