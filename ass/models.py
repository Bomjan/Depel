from django.db import models

# Create your models here.
from django.db import models

class BoardOfDirector(models.Model):
    name = models.CharField(max_length=200)
    position = models.CharField(max_length=200)
    bio = models.CharField(max_length=150)
    image = models.ImageField(upload_to='directors/')  # Path where images will be stored

    def __str__(self):
        return self.name

class ManagementTeam(models.Model):
    name = models.CharField(max_length=200)
    position = models.CharField(max_length=200)
    bio = models.CharField(max_length=150)
    image = models.ImageField(upload_to='management_team/')  # Path where images will be stored

    def __str__(self):
        return self.name

class Employee(models.Model):
    name = models.CharField(max_length=200)
    position = models.CharField(max_length=200)
    bio = models.CharField(max_length=150)
    image = models.ImageField(upload_to='employees/')  # Path where images will be stored

    def __str__(self):
        return self.name


class MiniTiller(models.Model):
    name = models.CharField(max_length=255)
    brand = models.CharField(max_length=100)
    type_is = models.CharField(max_length=100) #because 'type' is a keyword and can't be used as variable. 
    displacement_capacity = models.CharField(max_length=100)
    speed = models.CharField(max_length=100)
    power = models.CharField(max_length=100)
    starting_system = models.CharField(max_length=100)
    fuel_tank_capacity = models.CharField(max_length=100)
    fuel = models.CharField(max_length=100)
    fuel_consumption = models.CharField(max_length=100)
    gear_box = models.CharField(max_length=100)
    handle_bar = models.CharField(max_length=100)
    headlight = models.CharField(max_length=100)
    tyre = models.CharField(max_length=100)
    certification = models.CharField(max_length=100)
    usage = models.CharField(max_length=100)
    gross_weight = models.CharField(max_length=100)
    image = models.ImageField(upload_to='products/')  # Main image

    def __str__(self):
        return self.name

class ProductParts(models.Model):
    product = models.ForeignKey(MiniTiller, on_delete=models.CASCADE, related_name='parts')
    image = models.ImageField(upload_to='products/parts/')

    def __str__(self):
        return f'Part of {self.product.name}'

class Website(models.Model):
    name = models.CharField(max_length=100)
    url = models.URLField()

    def __str__(self):
        return self.name

class Carousel(models.Model):
    image = models.ImageField(upload_to='carousel_images/')
    uploaded_to = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Carousel Image{self.id}'