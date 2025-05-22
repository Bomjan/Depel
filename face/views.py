from django.shortcuts import render, redirect
from django.http import Http404
from ass.models import Product, Carousel, Employee, BoardOfDirector, ManagementTeam
from django.contrib.auth import authenticate, login as auth_login
from django.contrib import messages

from django.core.mail import send_mail
from ass.forms import ContactForm
from django.conf import settings

from django.shortcuts import render, get_object_or_404
from ass.models import Category, Product

from ass.models import (
    MiniTiller,
    MillingMachine,
    HarvestingMachine,
    ThreshingMachine,
    PlantingSowingMachine,
    IrrigationMachine,
    OtherMachine,
    WeedingMachine,
)


def get_nav_context():
    return {
        'minitillers': MiniTiller.objects.all(),
        'milling_machines': MillingMachine.objects.all(),
        'harvesting_machines': HarvestingMachine.objects.all(),
        'planting_machines': PlantingSowingMachine.objects.all(),
        'threshing_machines': ThreshingMachine.objects.all(),
        'weeding_machines': WeedingMachine.objects.all(),
        'irrigation_machines': IrrigationMachine.objects.all(),
        'other_machines': OtherMachine.objects.all(),
    }


def get_slug_model_map():
    cats = [
        MiniTiller,
        MillingMachine,
        HarvestingMachine,
        PlantingSowingMachine,
        ThreshingMachine,
        WeedingMachine,
        IrrigationMachine,
        OtherMachine,
    ]
    categories = Category.objects.all()
    return {
        category.slug: cats[i] for i, category in enumerate(categories) if i < len(cats)
    }

def index(request):
    nav = get_nav_context()
    slug_cat_mapped = get_slug_model_map()
    carousel_images = Carousel.objects.all()

    context = {
        'nav': nav,
        'carousel': {'carousel_images': carousel_images},
        'mapped': slug_cat_mapped,
    }
    return render(request, 'face/index.html', context)


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
    nav = get_nav_context()
    slug_cat_mapped = get_slug_model_map()
    employees = Employee.objects.all()
    board_members = BoardOfDirector.objects.all()
    management_team = ManagementTeam.objects.all()

    context = { 
        'nav': nav,
        'mapped': slug_cat_mapped,
        'employees' : employees, 
        'board_members': board_members, 
        'management_team' : management_team,
    }
    return render(request, 'face/info.html',context)


def people(request):
    board_of_directors = BoardOfDirector.objects.all()
    management_team = ManagementTeam.objects.all()
    employees = Employee.objects.all()
    nav = get_nav_context()
    slug_cat_mapped = get_slug_model_map()
    context = {
        'nav': nav,
        'mapped': slug_cat_mapped,
        'board_of_directors': board_of_directors,
        'management_team': management_team,
        'employees': employees
    }
    nav = get_nav_context()
    serve = context | nav
    return render(request, 'face/people.html', serve)



def product_detail(request, category_slug, product_slug):
    CATEGORY_MODEL_MAP = {
        'minitillers': MiniTiller,
        'milling_machines': MillingMachine,
        'harvesting_machines': HarvestingMachine,
        'planting_and_sowing_-machines': PlantingSowingMachine,
        'threshing_machines': ThreshingMachine,
        'weeding_machines': WeedingMachine,
        'irrigation_machines' : IrrigationMachine,
        'other_machines': OtherMachine,
    }
    category = get_object_or_404(Category, slug = category_slug)
    model_class = CATEGORY_MODEL_MAP.get(category_slug.replace('-', '_'))
    if not model_class:
        raise Http404(f"No model found for category '{category_slug}'")

    
    product = get_object_or_404(model_class, slug = product_slug, category = category)
    part_images = product.part_images.all()

    filtered_attributes = {
        field.verbose_name: getattr(product, field.name)
        for field in product._meta.fields
        if getattr(product, field.name) not in [None, "", "other", "nan"]
    }

    nav = get_nav_context()
    slug_cat_mapped = get_slug_model_map()

    context = {
        'nav' : nav,
        'mapped' : slug_cat_mapped,
        "category": category,
        "product": product,
        "attributes": filtered_attributes,
        'part_images': part_images,
    }
    return render(request, 'face/product_detail.html',  context)

def catalog(request):
    return render(request, 'face/catalog.html')

from ass.models import PaddyThresherVideo

def rnd(request):
    nav = get_nav_context()
    slug_cat_mapped = get_slug_model_map()
    videos = PaddyThresherVideo.objects.all()
    context = {
        'nav': nav,
        'mapped': slug_cat_mapped,
        'videos': videos,
    }
    return render(request, 'face/rnd.html', context)




def contact_us(request):
    form = ContactForm()
    success = False
    # success = False
    # if request.method == 'POST':
    #     form = ContactForm(request.POST)
    #     if form.is_valid():
    #         # Email sending logic (optional)
    #         send_mail(
    #             subject=form.cleaned_data['subject'],
    #             message=f"From: {form.cleaned_data['full_name']} <{form.cleaned_data['email']}>\n\n{form.cleaned_data['message']}",
    #             from_email=settings.DEFAULT_FROM_EMAIL,
    #             recipient_list=[settings.DEFAULT_FROM_EMAIL],  # or any recipient
    #         )
    #         success = True
    #         form = ContactForm()  # Reset the form
    # else:
    #     form = ContactForm()
    
    nav = get_nav_context()
    slug_cat_mapped = get_slug_model_map()
    context = {
        'nav': nav,
        'mapped': slug_cat_mapped,
        'form': form,
        'success': success,
    }
    return render(request, 'face/contact_us.html', context)
