from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.contenttypes.models import ContentType
from .models import Product
from .models import (
    # people
    BoardOfDirector,
    ManagementTeam,
    Employee,

    # products
    Category, 
    ProductParts,
    MiniTiller, # 1
    HarvestingMachine, # 2
    PlantingSowingMachine, # 3
    ThreshingMachine, # 4
    WeedingMachine, # 5
    OtherMachine, # 6
    MillingMachine, # 7
    IrrigationMachine, # 8

    # websites
    Website,

    # carousels
    Carousel
)

from .forms import (
    MiniTillerForm, 
    MillingMachineForm, 
    HarvestingMachineForm,
    PlantingSowingMachineForm, 
    ThreshingMachineForm,
    WeedingMachineForm, 
    IrrigationMachineForm,
    OtherMachineForm
)

from .forms import (BoardOfDirectorForm, ManagementTeamForm, EmployeeForm, WebsiteForm, CarouselForm)
from django.contrib.auth.decorators import login_required

@login_required
def dashboard(request):
    # Handling form submissions for adding, editing, and deleting members
    if request.method == 'POST':
        # Add or Edit Board Member
        if 'add_board_member' in request.POST or 'edit_board_member' in request.POST:
            if 'edit_board_member' in request.POST:
                member_id = request.POST.get('edit_board_member')
                member = BoardOfDirector.objects.get(id=member_id)
                form = BoardOfDirectorForm(request.POST, request.FILES, instance=member)
            else:
                form = BoardOfDirectorForm(request.POST, request.FILES)
            
            if form.is_valid():
                form.save()
                return redirect('ass:dashboard')
        
        # Add or Edit Management Team Member
        elif 'add_management_member' in request.POST or 'edit_management_member' in request.POST:
            if 'edit_management_member' in request.POST:
                member_id = request.POST.get('edit_management_member')
                member = ManagementTeam.objects.get(id=member_id)
                form = ManagementTeamForm(request.POST, request.FILES, instance=member)
            else:
                form = ManagementTeamForm(request.POST, request.FILES)
            
            if form.is_valid():
                form.save()
                return redirect('ass:dashboard')

        # Add or Edit Employee
        elif 'add_employee' in request.POST or 'edit_employee' in request.POST:
            if 'edit_employee' in request.POST:
                member_id = request.POST.get('edit_employee')
                member = Employee.objects.get(id=member_id)
                form = EmployeeForm(request.POST, request.FILES, instance=member)
            else:
                form = EmployeeForm(request.POST, request.FILES)
            
            if form.is_valid():
                form.save()
                return redirect('ass:dashboard')
        
        # Handle Deleting Board Member
        elif 'delete_board_member' in request.POST:
            member_id = request.POST.get('delete_board_member')
            member = BoardOfDirector.objects.get(id=member_id)
            member.delete()
            return redirect('ass:dashboard')

        # Handle Deleting Management Team Member
        elif 'delete_management_member' in request.POST:
            member_id = request.POST.get('delete_management_member')
            member = ManagementTeam.objects.get(id=member_id)
            member.delete()
            return redirect('ass:dashboard')

        # Handle Deleting Employee
        elif 'delete_employee' in request.POST:
            member_id = request.POST.get('delete_employee')
            member = Employee.objects.get(id=member_id)
            member.delete()
            return redirect('ass:dashboard')

    else:
        board_members = BoardOfDirector.objects.all()
        management_team = ManagementTeam.objects.all()
        employees = Employee.objects.all()

        # Forms for adding new members
        board_member_form = BoardOfDirectorForm()
        management_member_form = ManagementTeamForm()
        employee_form = EmployeeForm()

        context = {
            'board_members': board_members,
            'management_team': management_team,
            'employees': employees,
            'board_member_form': board_member_form,
            'management_member_form': management_member_form,
            'employee_form': employee_form
        }

        return render(request, 'ass/dashboard.html', context)



def create_default_categories():
    category_names = [
        "MiniTillers",
        "Milling Machines",
        "Harvesting Machines",
        "Planting and Sowing Machines",
        "Threshing Machines",
        "Weeding Machines",
        "Irrigation Machines",
        "Other Machines",
    ]
    for name in category_names:
        Category.objects.get_or_create(name=name)

@login_required
def products_services(request):
    # Create default categories if they don't exist
    create_default_categories()

    # Category to form/model mapping
    PRODUCT_MAP = {
        'MiniTillers': (MiniTiller, MiniTillerForm),
        'Milling Machines': (MillingMachine, MillingMachineForm),
        'Harvesting Machines': (HarvestingMachine, HarvestingMachineForm),
        'Planting and Sowing Machines': (PlantingSowingMachine, PlantingSowingMachineForm),
        'Threshing Machines': (ThreshingMachine, ThreshingMachineForm),
        'Weeding Machines': (WeedingMachine, WeedingMachineForm),
        'Irrigation Machines': (IrrigationMachine, IrrigationMachineForm),
        'Other Machines': (OtherMachine, OtherMachineForm),
    }

    categories = Category.objects.all()
    selected_category = None
    products_services = {}
    form = None

    # Handle category selection
    if 'category' in request.GET:
        selected_category = get_object_or_404(Category, id=request.GET['category'])
        model_class, form_class = PRODUCT_MAP.get(selected_category.name, (None, None))
        
        if model_class and form_class:
            products = model_class.objects.filter(category=selected_category).prefetch_related('parts')
            products_services[selected_category] = products
            form = form_class()

    # Handle form submissions
    if request.method == 'POST':
        # Add new product/service
        if 'add_product_service' in request.POST:
            category_id = request.POST.get('category')
            selected_category = get_object_or_404(Category, id=category_id)
            model_class, form_class = PRODUCT_MAP.get(selected_category.name, (None, None))
            
            if model_class and form_class:
                form = form_class(request.POST, request.FILES)
                if form.is_valid():
                    product = form.save(commit=False)
                    product.category = selected_category
                    product.save()
                    
                    # Handle multiple images using generic relations
                    for image in request.FILES.getlist('images'):
                        ProductParts.objects.create(
                            content_object=product,
                            image=image
                        )
                    return redirect(f'/ass/products-services/')

        # Delete product/service
        elif 'delete_product_service' in request.POST:
            content_type_id = request.POST.get('content_type')
            object_id = request.POST.get('object_id')
            content_type = ContentType.objects.get_for_id(content_type_id)
            product = content_type.get_object_for_this_type(pk=object_id)
            product.delete()
            return redirect(request.META.get('HTTP_REFERER', '/ass/products-services/'))

    context = {
        'categories': categories,
        'selected_category': selected_category,
        'products_services': products_services,
        'product_service_form': form,
    }
    return render(request, 'ass/products_services.html', context)

@login_required
def website_list(request):
    websites = Website.objects.all()

    if request.method == 'POST':
        if 'add_website' in request.POST:
            form = WebsiteForm(request.POST)
            if form.is_valid():
                form.save()
                return redirect('ass:website_list')

        elif 'edit_website' in request.POST:
            website_id = request.POST.get('edit_website')
            website = Website.objects.get(id=website_id)
            form = WebsiteForm(request.POST, instance=website)
            if form.is_valid():
                form.save()
                return redirect('ass:website_list')

        elif 'delete_website' in request.POST:
            website_id = request.POST.get('delete_website')
            Website.objects.filter(id=website_id).delete()
            return redirect('ass:website_list')

    else:
        form = WebsiteForm()

    return render(request, 'ass/website_list.html', {'websites': websites, 'form': form})


@login_required
def manage_carousel(request):
    if request.method == "POST":
        if "delete_image" in request.POST:
            image_id = request.POST.get("delete_image")
            image = get_object_or_404(Carousel, id=image_id)
            image.delete()
            return redirect("ass:manage_carousel")

        form = CarouselForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            return redirect("ass:manage_carousel")

    images = Carousel.objects.all()
    form = CarouselForm()
    return render(request, "ass/manage_carousel.html", {"images": images, "form": form})

