from django.shortcuts import render, redirect

from .models import BoardOfDirector, ManagementTeam, Employee
from .forms import BoardOfDirectorForm, ManagementTeamForm, EmployeeForm

from .models import MiniTiller, ProductParts
from .forms import MiniTillerForm, ProductPartsForm

from .models import Website  
from .forms import WebsiteForm 

from .models import Carousel
from .forms import CarouselForm

from django.contrib.auth.decorators import login_required
@login_required
def dashboard(request):
    # Handling form submissions for adding new members
    if request.method == 'POST':
        # Add new Board Member
        if 'add_board_member' in request.POST:
            form = BoardOfDirectorForm(request.POST, request.FILES)
            if form.is_valid():
                form.save()
                return redirect('ass:dashboard')
        
        # Add new Management Team member
        elif 'add_management_member' in request.POST:
            form = ManagementTeamForm(request.POST, request.FILES)
            if form.is_valid():
                form.save()
                return redirect('ass:dashboard')

        # Add new Employee
        elif 'add_employee' in request.POST:
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
    

@login_required
def products_services(request):
    products_services = MiniTiller.objects.all().prefetch_related('parts')
    product_service_form = MiniTillerForm()
    parts_form = ProductPartsForm()  # Use the updated non-ModelForm

    if request.method == "POST":
        if "add_product_service" in request.POST:
            product_form = ProductServiceForm(request.POST, request.FILES)
            parts_form = ProductPartsForm(request.POST, request.FILES)

            if product_form.is_valid():
                product = product_form.save()

                # Handle multiple parts images
                if parts_form.is_valid():
                    for img in request.FILES.getlist('images'):
                        ProductParts.objects.create(product=product, image=img)

                return redirect('ass:products_services')

        elif "delete_product_service" in request.POST:
            product_id = request.POST.get("delete_product_service")
            
            try:
                product = MiniTiller.objects.get(id=product_id)
                
                # Delete all related ProductParts first
                product.parts.all().delete()
                
                # Delete the ProductService itself
                product.delete()
                
            except MiniTiller.DoesNotExist:
                pass  # If product not found, do nothing

            return redirect('ass:products_services')

    return render(request, 'ass/products_services.html', {
        "products_services": products_services,
        "product_service_form": product_service_form,
        "parts_form": parts_form,
    })

    return render(request, 'ass/products_services.html', {
        "products_services": products_services,
        "product_service_form": product_service_form,
        "parts_form": parts_form,
    })

@login_required
def website_list(request):
    websites = Website.objects.all()  # Fetch all websites

    # Handle adding a new website
    if request.method == 'POST':
        if 'add_website' in request.POST:
            form = WebsiteForm(request.POST)
            if form.is_valid():
                form.save()
                return redirect('ass:website_list')

        elif 'delete_website' in request.POST:  # Handle delete request
            website_id = request.POST.get('delete_website')
            Website.objects.filter(id=website_id).delete()
            return redirect('ass:website_list')

    else:
        form = WebsiteForm()

    return render(request, 'ass/website_list.html', {'websites': websites, 'form': form})

@login_required
def manage_carousel(request):
    if request.method == "POST":
        if "delete_image" in request.POST:  # Delete image
            image_id = request.POST.get("delete_image")
            Carousel.objects.filter(id=image_id).delete()
            return redirect("ass:manage_carousel")

        form = CarouselForm(request.POST, request.FILES)  # Upload image
        if form.is_valid():
            form.save()
            return redirect("ass:manage_carousel")

    images = Carousel.objects.all()
    form = CarouselForm()
    return render(request, "ass/manage_carousel.html", {"images": images, "form": form})

def create_product(request):
    if request.method == 'POST':
        product_form = ProductServiceForm(request.POST, request.FILES)
        parts_form = ProductPartsForm(request.POST, request.FILES)
        
        if product_form.is_valid():
            product = product_form.save()
            if parts_form.is_valid():
                parts_form.save(product=product)
            return redirect('success_url')
    else:
        product_form = ProductServiceForm()
        parts_form = ProductPartsForm()

    return render(request, 'create_product.html', {
        'product_form': product_form,
        'parts_form': parts_form
    })