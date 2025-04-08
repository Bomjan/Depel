from django.shortcuts import render, redirect
from django.http import Http404
from ass.models import Product, Carousel, Employee, BoardOfDirector, ManagementTeam
from django.contrib.auth import authenticate, login as auth_login
from django.contrib import messages

from django.shortcuts import render, get_object_or_404
from ass.models import Category, Product

from ass.models import (
    MiniTiller,
    MillingMachine,
    HarvestingMachine,
    ThreshingMachine,
    PlantingSowingMachine,
    
    OtherMachine,
    WeedingMachine,
)
# this global variables are made to be ascessible to all views
minitillers = MiniTiller.objects.all()
milling_machines = MillingMachine.objects.all()
harvesting_machines = HarvestingMachine.objects.all()
planting_machines = PlantingSowingMachine.objects.all()
threshing_machines = ThreshingMachine.objects.all()
weeding_machines = WeedingMachine.objects.all()
other_machines = OtherMachine.objects.all()

nav = {
        'minitillers': minitillers,
        'milling_machines': milling_machines,
        'harvesting_machines': harvesting_machines,
        'planting_machines': planting_machines,
        'threshing_machines': threshing_machines,
        'weeding_machines': weeding_machines,
        'other_machines': other_machines,
    }
cats = [MiniTiller,
    MillingMachine,
    HarvestingMachine,
    PlantingSowingMachine,
    ThreshingMachine,
    WeedingMachine,
    # IrrigationMachine
    OtherMachine
    ]
category_slugs = [i.slug for i in Category.objects.all()]
mapped = {}
for x in range(0, len(cats)):
    mapped[category_slugs[x]] = cats[x]

# Create your views here.
def index(request):
    carousel_images = Carousel.objects.all()
    serve = {}
    # categories = [ i for i in Category.objects.all()]
    serve['nav'] = nav
    serve['carousel'] = {'carousel_images': carousel_images}
    serve['mapped'] = mapped
    # serve = nav | {'carousel_images': carousel_images} | { 'categories': categories} | mapped 
    return render( request, 'face/index.html ', serve )
    #return render(request, 'face/index.html', {'carousel_images':carousel_images})


def login(request):
    if request.method == "POST":
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)
        
        if user is not None:
            auth_login(request, user)
            return redirect("ass:dashboard")  # Redirect to your dashboard
        else:
            messages.error(request, "Invalid username or password. If you are not the right person, please do not try. Else the cops will be there within 3 mins.")

    return render(request, "face/login.html")

def info(request):
    employees = Employee.objects.all()
    board_members = BoardOfDirector.objects.all()
    management_team = ManagementTeam.objects.all()

    context = { 
        'employees' : employees, 
        'board_members': board_members, 
        'management_team' : management_team,
    }
    serve = context | nav
    return render(request, 'face/info.html',serve)


def people(request):
    board_of_directors = BoardOfDirector.objects.all()
    management_team = ManagementTeam.objects.all()
    employees = Employee.objects.all()
    context = {
        'board_of_directors': board_of_directors,
        'management_team': management_team,
        'employees': employees
    }

    serve = context | nav
    return render(request, 'face/people.html', serve)



def product_detail(request, category_slug, product_slug):
    CATEGORY_MODEL_MAP = {
        'minitillers': MiniTiller,
        'milling_machines': MillingMachine,
        'harvesting_machines': HarvestingMachine,
        'planting_machines': PlantingSowingMachine,
        'threshing_machines': ThreshingMachine,
        'weeding_machines': WeedingMachine,
        'other_machines': OtherMachine,
    }
    category = get_object_or_404(Category, slug = category_slug)
    model_class = CATEGORY_MODEL_MAP.get(category.slug)
    if not model_class:
        raise Http404("Sorry, Something has gone worng, gong mathey")
    
    product = get_object_or_404(model_class, slug = product_slug, category = category)
    filtered_attributes = {
        field.verbose_name: getattr(product, field.name)
        for field in product._meta.fields
        if getattr(product, field.name) not in [None, "", "other"]
    }

    context = {
        "category": category,
        "product": product,
        "attributes": filtered_attributes,
    }
    return render(request, 'face/product_detail.html', nav | context)

def catalogue(request):
    pass