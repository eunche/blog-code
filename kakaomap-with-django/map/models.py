from django.db import models

# Create your models here.


class Favorite(models.Model):
    title = models.CharField(max_length=100, blank=True, null=True)
    address = models.CharField(max_length=100, blank=True, null=True)
    jibun = models.CharField(max_length=100, blank=True, null=True)
    link = models.CharField(max_length=100, blank=True, null=True)
    lat = models.FloatField(blank=True, null=True)
    lng = models.FloatField(blank=True, null=True)

    def __str__(self):
        return self.title
