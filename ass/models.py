from django.db import models
from django.urls import reverse
from django.utils.text import slugify
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericRelation


# ---- General Models ---- #
class BoardOfDirector(models.Model):
    name = models.CharField(max_length=200)
    position = models.CharField(max_length=200)
    bio = models.CharField(max_length=150)
    image = models.ImageField(upload_to='directors/')

    def __str__(self):
        return self.name

class ManagementTeam(models.Model):
    name = models.CharField(max_length=200)
    position = models.CharField(max_length=200)
    bio = models.CharField(max_length=150)
    image = models.ImageField(upload_to='management_team/')

    def __str__(self):
        return self.name

class Employee(models.Model):
    name = models.CharField(max_length=200)
    position = models.CharField(max_length=200)
    bio = models.CharField(max_length=150)
    image = models.ImageField(upload_to='employees/')

    def __str__(self):
        return self.name

# ---- Product Category ---- #
class Category(models.Model):
    name = models.CharField(max_length=150, unique=True)
    slug = models.SlugField(unique=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

# ---- Abstract Product Model ---- #
class Product(models.Model):
    category = models.ForeignKey(
        Category,
        on_delete=models.CASCADE,
        related_name="%(class)s_products"  # Dynamic related name
    )
    name = models.CharField(max_length=255)
    brand = models.CharField(max_length=100, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    image = models.ImageField(upload_to='products/', blank=True, null=True)
    slug = models.SlugField(unique=True, blank=True)
    parts = GenericRelation('ProductParts')

    class Meta:
        abstract = True

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def get_absolute_url(self):
        return reverse("product_detail", kwargs={
            "category_slug": self.category.slug,
            "slug": self.slug
        })

    def __str__(self):
        return self.name

# ---- Category-Specific Models ---- #
class MiniTiller(Product):
    displacement_capacity = models.CharField(max_length=100, blank=True, null=True)
    speed = models.CharField(max_length=100, blank=True, null=True)
    type_is = models.CharField(max_length=100, blank=True, null=True)
    power = models.CharField(max_length=100, blank=True, null=True)
    rated_power = models.CharField(max_length=100, blank=True, null=True)
    starting_system = models.CharField(max_length=100, blank=True, null=True)
    cooling_system = models.CharField(max_length=100, blank=True, null=True)
    gear_box = models.CharField(max_length=100, blank=True, null=True)
    gear = models.CharField(max_length=100, blank=True, null=True)
    handle_bar = models.CharField(max_length=100, blank=True, null=True)
    headlight = models.CharField(max_length=100, blank=True, null=True)
    tyre = models.CharField(max_length=100, blank=True, null=True)
    certification = models.CharField(max_length=100, blank=True, null=True)

class MillingMachine(Product):
    production_capacity = models.CharField(max_length=100, blank=True, null=True)
    power = models.CharField(max_length=100, blank=True, null=True)
    weight = models.CharField(max_length=100, blank=True, null=True)
    model = models.CharField(max_length=100, blank=True, null=True)
    power_required = models.CharField(max_length=100, blank=True, null=True)
    power_consumption = models.CharField(max_length=100, blank=True, null=True)
    voltage = models.CharField(max_length=100, blank=True, null=True)
    operation_type = models.CharField(max_length=100, blank=True, null=True)
    usage = models.CharField(max_length=100, blank=True, null=True)

class HarvestingMachine(Product):
    power_required = models.CharField(max_length=100, blank=True, null=True)
    capacity = models.CharField(max_length=100, blank=True, null=True)
    fuel_consumption = models.CharField(max_length=100, blank=True, null=True)
    weight = models.CharField(max_length=100, blank=True, null=True)
    usage = models.CharField(max_length=100, blank=True, null=True)

class PlantingSowingMachine(Product):
    operation_type = models.CharField(max_length=100, blank=True, null=True)
    usage = models.CharField(max_length=100, blank=True, null=True)
    number_of_transplanting_rows = models.IntegerField(blank=True, null=True)

class ThreshingMachine(Product):
    loop_wire_diameter = models.CharField(max_length=100, blank=True, null=True)
    number_of_wire_loop = models.CharField(max_length=100, blank=True, null=True)
    usage = models.CharField(max_length=100, blank=True, null=True)

class WeedingMachine(Product):
    engine = models.CharField(max_length=100, blank=True, null=True)
    displacement = models.CharField(max_length=100, blank=True, null=True)
    working_width = models.CharField(max_length=100, blank=True, null=True)
    working_depth = models.CharField(max_length=100, blank=True, null=True)
    gross_weight = models.CharField(max_length=100, blank=True, null=True)
    back_pack = models.CharField(max_length=100, blank=True, null=True)
    certification = models.CharField(max_length=100, blank=True, null=True)
    usage = models.CharField(max_length=100, blank=True, null=True)

class IrrigationMachine(Product):
    variant = models.CharField(max_length=100, blank=True, null=True)
    key_features = models.CharField(max_length=100, blank=True, null=True)
    flow_rate = models.CharField(max_length=100, blank=True, null=True)
    certification = models.CharField(max_length=100, blank=True, null=True)
    recommended_filtration = models.CharField(max_length=1000, blank=True, null=True)
    outlet_type = models.CharField(max_length=100, blank=True, null=True)
    usage = models.CharField(max_length=100, blank=True, null=True)

class OtherMachine(Product):
    operation_mode = models.CharField(max_length=100, blank=True, null=True)
    capacity = models.CharField(max_length=100, blank=True, null=True)
    shelling_rate = models.CharField(max_length=100, blank=True, null=True)
    power_required = models.CharField(max_length=100, blank=True, null=True)
    usage = models.CharField(max_length=100, blank=True, null=True)

# ---- Product Parts ---- #
class ProductParts(models.Model):
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    product = GenericForeignKey('content_type', 'object_id')
    image = models.ImageField(upload_to='products/parts/')

    def __str__(self):
        return f'Part of {self.content_type} - {self.object_id}'

# ---- Other General Models ---- #
class Website(models.Model):
    name = models.CharField(max_length=100)
    url = models.URLField()

    def __str__(self):
        return self.name

class Carousel(models.Model):
    image = models.ImageField(upload_to='carousel_images/')
    uploaded_to = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Carousel Image {self.id}'
    

class PaddyThresherVideo(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    video = models.FileField(upload_to='paddy_thresher_videos/')  # Use FileField for local or URLField for YouTube links
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
