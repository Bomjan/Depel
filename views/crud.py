from django.views.generic import ListView, CreateView, UpdateView, DeleteView, FormView
from django.urls import reverse_lazy
from django.shortcuts import get_object_or_404
from django.contrib.contenttypes.models import ContentType
from .models import (
    BoardOfDirector, ManagementTeam, Employee,
    Category, MiniTiller, MillingMachine, HarvestingMachine,
    PlantingSowingMachine, ThreshingMachine, WeedingMachine,
    OtherMachine, ProductParts, Website, Carousel
)
from ass.forms import (
    BoardOfDirectorForm, ManagementTeamForm, EmployeeForm,
    CategoryForm, MiniTillerForm, MillingMachineForm,
    HarvestingMachineForm, PlantingSowingMachineForm,
    ThreshingMachineForm, WeedingMachineForm, OtherMachineForm,
    ProductPartsForm, WebsiteForm, CarouselForm
)

# ==================== People CRUD Views ==================== #
class BoardOfDirectorListView(ListView):
    model = BoardOfDirector
    template_name = 'crud/boardofdirector_list.html'
    context_object_name = 'directors'

class BoardOfDirectorCreateView(CreateView):
    model = BoardOfDirector
    form_class = BoardOfDirectorForm
    template_name = 'crud/generic_form.html'
    success_url = reverse_lazy('boardofdirector_list')

class BoardOfDirectorUpdateView(UpdateView):
    model = BoardOfDirector
    form_class = BoardOfDirectorForm
    template_name = 'crud/generic_form.html'
    success_url = reverse_lazy('boardofdirector_list')

class BoardOfDirectorDeleteView(DeleteView):
    model = BoardOfDirector
    template_name = 'crud/generic_confirm_delete.html'
    success_url = reverse_lazy('boardofdirector_list')

class ManagementTeamListView(ListView):
    model = ManagementTeam
    template_name = 'crud/managementteam_list.html'
    context_object_name = 'managers'

class ManagementTeamCreateView(CreateView):
    model = ManagementTeam
    form_class = ManagementTeamForm
    template_name = 'crud/generic_form.html'
    success_url = reverse_lazy('managementteam_list')

class ManagementTeamUpdateView(UpdateView):
    model = ManagementTeam
    form_class = ManagementTeamForm
    template_name = 'crud/generic_form.html'
    success_url = reverse_lazy('managementteam_list')

class ManagementTeamDeleteView(DeleteView):
    model = ManagementTeam
    template_name = 'crud/generic_confirm_delete.html'
    success_url = reverse_lazy('managementteam_list')

class EmployeeListView(ListView):
    model = Employee
    template_name = 'crud/employee_list.html'
    context_object_name = 'employees'

class EmployeeCreateView(CreateView):
    model = Employee
    form_class = EmployeeForm
    template_name = 'crud/generic_form.html'
    success_url = reverse_lazy('employee_list')

class EmployeeUpdateView(UpdateView):
    model = Employee
    form_class = EmployeeForm
    template_name = 'crud/generic_form.html'
    success_url = reverse_lazy('employee_list')

class EmployeeDeleteView(DeleteView):
    model = Employee
    template_name = 'crud/generic_confirm_delete.html'
    success_url = reverse_lazy('employee_list')

# ==================== Category CRUD ==================== #
class CategoryListView(ListView):
    model = Category
    template_name = 'crud/category_list.html'
    context_object_name = 'categories'

class CategoryCreateView(CreateView):
    model = Category
    form_class = CategoryForm
    template_name = 'crud/generic_form.html'
    success_url = reverse_lazy('category_list')

class CategoryUpdateView(UpdateView):
    model = Category
    form_class = CategoryForm
    template_name = 'crud/generic_form.html'
    success_url = reverse_lazy('category_list')

class CategoryDeleteView(DeleteView):
    model = Category
    template_name = 'crud/generic_confirm_delete.html'
    success_url = reverse_lazy('category_list')

# ==================== Product CRUD Base Classes ==================== #
class ProductCreateView(CreateView):
    template_name = 'crud/product_form.html'
    
    def form_valid(self, form):
        category = get_object_or_404(Category, name=self.category_name)
        form.instance.category = category
        return super().form_valid(form)

class ProductUpdateView(UpdateView):
    template_name = 'crud/product_form.html'

# ==================== Product Type CRUD Views ==================== #
# Mini Tiller
class MiniTillerCreateView(ProductCreateView):
    model = MiniTiller
    form_class = MiniTillerForm
    category_name = "Mini Tillers"
    success_url = reverse_lazy('minitiller_list')

class MiniTillerListView(ListView):
    model = MiniTiller
    template_name = 'crud/product_list.html'
    context_object_name = 'products'

class MiniTillerUpdateView(ProductUpdateView):
    model = MiniTiller
    form_class = MiniTillerForm
    success_url = reverse_lazy('minitiller_list')

class MiniTillerDeleteView(DeleteView):
    model = MiniTiller
    template_name = 'crud/generic_confirm_delete.html'
    success_url = reverse_lazy('minitiller_list')

# Milling Machine
class MillingMachineCreateView(ProductCreateView):
    model = MillingMachine
    form_class = MillingMachineForm
    category_name = "Milling Machines"
    success_url = reverse_lazy('millingmachine_list')

class MillingMachineListView(ListView):
    model = MillingMachine
    template_name = 'crud/product_list.html'
    context_object_name = 'products'

class MillingMachineUpdateView(ProductUpdateView):
    model = MillingMachine
    form_class = MillingMachineForm
    success_url = reverse_lazy('millingmachine_list')

class MillingMachineDeleteView(DeleteView):
    model = MillingMachine
    template_name = 'crud/generic_confirm_delete.html'
    success_url = reverse_lazy('millingmachine_list')

# Harvesting Machine
class HarvestingMachineCreateView(ProductCreateView):
    model = HarvestingMachine
    form_class = HarvestingMachineForm
    category_name = "Harvesting Machines"
    success_url = reverse_lazy('harvestingmachine_list')

class HarvestingMachineListView(ListView):
    model = HarvestingMachine
    template_name = 'crud/product_list.html'
    context_object_name = 'products'

class HarvestingMachineUpdateView(ProductUpdateView):
    model = HarvestingMachine
    form_class = HarvestingMachineForm
    success_url = reverse_lazy('harvestingmachine_list')

class HarvestingMachineDeleteView(DeleteView):
    model = HarvestingMachine
    template_name = 'crud/generic_confirm_delete.html'
    success_url = reverse_lazy('harvestingmachine_list')

# Planting/Sowing Machine
class PlantingSowingMachineCreateView(ProductCreateView):
    model = PlantingSowingMachine
    form_class = PlantingSowingMachineForm
    category_name = "Planting/Sowing Machines"
    success_url = reverse_lazy('plantingsowingmachine_list')

class PlantingSowingMachineListView(ListView):
    model = PlantingSowingMachine
    template_name = 'crud/product_list.html'
    context_object_name = 'products'

class PlantingSowingMachineUpdateView(ProductUpdateView):
    model = PlantingSowingMachine
    form_class = PlantingSowingMachineForm
    success_url = reverse_lazy('plantingsowingmachine_list')

class PlantingSowingMachineDeleteView(DeleteView):
    model = PlantingSowingMachine
    template_name = 'crud/generic_confirm_delete.html'
    success_url = reverse_lazy('plantingsowingmachine_list')

# Threshing Machine
class ThreshingMachineCreateView(ProductCreateView):
    model = ThreshingMachine
    form_class = ThreshingMachineForm
    category_name = "Threshing Machines"
    success_url = reverse_lazy('threshingmachine_list')

class ThreshingMachineListView(ListView):
    model = ThreshingMachine
    template_name = 'crud/product_list.html'
    context_object_name = 'products'

class ThreshingMachineUpdateView(ProductUpdateView):
    model = ThreshingMachine
    form_class = ThreshingMachineForm
    success_url = reverse_lazy('threshingmachine_list')

class ThreshingMachineDeleteView(DeleteView):
    model = ThreshingMachine
    template_name = 'crud/generic_confirm_delete.html'
    success_url = reverse_lazy('threshingmachine_list')

# Weeding Machine
class WeedingMachineCreateView(ProductCreateView):
    model = WeedingMachine
    form_class = WeedingMachineForm
    category_name = "Weeding Machines"
    success_url = reverse_lazy('weedingmachine_list')

class WeedingMachineListView(ListView):
    model = WeedingMachine
    template_name = 'crud/product_list.html'
    context_object_name = 'products'

class WeedingMachineUpdateView(ProductUpdateView):
    model = WeedingMachine
    form_class = WeedingMachineForm
    success_url = reverse_lazy('weedingmachine_list')

class WeedingMachineDeleteView(DeleteView):
    model = WeedingMachine
    template_name = 'crud/generic_confirm_delete.html'
    success_url = reverse_lazy('weedingmachine_list')

# Other Machine
class OtherMachineCreateView(ProductCreateView):
    model = OtherMachine
    form_class = OtherMachineForm
    category_name = "Other Machines"
    success_url = reverse_lazy('othermachine_list')

class OtherMachineListView(ListView):
    model = OtherMachine
    template_name = 'crud/product_list.html'
    context_object_name = 'products'

class OtherMachineUpdateView(ProductUpdateView):
    model = OtherMachine
    form_class = OtherMachineForm
    success_url = reverse_lazy('othermachine_list')

class OtherMachineDeleteView(DeleteView):
    model = OtherMachine
    template_name = 'crud/generic_confirm_delete.html'
    success_url = reverse_lazy('othermachine_list')

# ==================== Product Parts ==================== #
class ProductPartCreateView(FormView):
    form_class = ProductPartsForm
    template_name = 'crud/productpart_form.html'

    def setup(self, request, *args, **kwargs):
        self.content_type = get_object_or_404(
            ContentType, 
            model=kwargs['model_name']
        )
        self.product = get_object_or_404(
            self.content_type.model_class(),
            pk=kwargs['object_id']
        )
        return super().setup(request, *args, **kwargs)

    def form_valid(self, form):
        for image in self.request.FILES.getlist('images'):
            ProductParts.objects.create(
                content_type=self.content_type,
                object_id=self.product.pk,
                image=image
            )
        return super().form_valid(form)

    def get_success_url(self):
        return self.product.get_absolute_url()

# ==================== Website CRUD ==================== #
class WebsiteListView(ListView):
    model = Website
    template_name = 'crud/website_list.html'
    context_object_name = 'websites'

class WebsiteCreateView(CreateView):
    model = Website
    form_class = WebsiteForm
    template_name = 'crud/generic_form.html'
    success_url = reverse_lazy('website_list')

class WebsiteUpdateView(UpdateView):
    model = Website
    form_class = WebsiteForm
    template_name = 'crud/generic_form.html'
    success_url = reverse_lazy('website_list')

class WebsiteDeleteView(DeleteView):
    model = Website
    template_name = 'crud/generic_confirm_delete.html'
    success_url = reverse_lazy('website_list')

# ==================== Carousel CRUD ==================== #
class CarouselListView(ListView):
    model = Carousel
    template_name = 'crud/carousel_list.html'
    context_object_name = 'carousels'

class CarouselCreateView(CreateView):
    model = Carousel
    form_class = CarouselForm
    template_name = 'crud/generic_form.html'
    success_url = reverse_lazy('carousel_list')

class CarouselUpdateView(UpdateView):
    model = Carousel
    form_class = CarouselForm
    template_name = 'crud/generic_form.html'
    success_url = reverse_lazy('carousel_list')

class CarouselDeleteView(DeleteView):
    model = Carousel
    template_name = 'crud/generic_confirm_delete.html'
    success_url = reverse_lazy('carousel_list')