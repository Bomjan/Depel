from django.views.generic import ListView, CreateView, UpdateView, DeleteView
from django.urls import reverse_lazy
from django.shortcuts import get_object_or_404
from ass.models import Category, MiniTiller, MillingMachine, HarvestingMachine
from ass.models import PlantingSowingMachine, ThreshingMachine, WeedingMachine, OtherMachine
from ass.forms import (
    MiniTillerForm, MillingMachineForm, HarvestingMachineForm,
    PlantingSowingMachineForm, ThreshingMachineForm,
    WeedingMachineForm, OtherMachineForm
)

class ProductCreateView(CreateView):
    template_name = 'crud/product_form.html'
    
    def form_valid(self, form):
        category = get_object_or_404(Category, name=self.category_name)
        form.instance.category = category
        return super().form_valid(form)

class ProductUpdateView(UpdateView):
    template_name = 'crud/product_form.html'

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