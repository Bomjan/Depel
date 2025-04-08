from django.views.generic import ListView, CreateView, UpdateView, DeleteView
from django.urls import reverse_lazy
from ass.models import Website
from ass.forms import WebsiteForm

class WebsiteListView(ListView):
    model = Website
    template_name = 'crud/website_list.html'
    context_object_name = 'websites'
    ordering = ['-id']

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