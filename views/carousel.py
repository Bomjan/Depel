from django.views.generic import ListView, CreateView, UpdateView, DeleteView
from django.urls import reverse_lazy
from ass.models import Carousel
from ass.forms import CarouselForm

class CarouselListView(ListView):
    model = Carousel
    template_name = 'crud/carousel_list.html'
    context_object_name = 'carousels'
    ordering = ['-uploaded_at']

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