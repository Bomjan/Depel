from django.views.generic import ListView, FormView, DeleteView
from django.urls import reverse_lazy
from django.shortcuts import get_object_or_404
from django.contrib.contenttypes.models import ContentType
from ass.models import ProductParts
from ass.forms import ProductPartsForm

class ProductPartListView(ListView):
    model = ProductParts
    template_name = 'crud/productpart_list.html'
    context_object_name = 'parts'
    ordering = ['-id']

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
        return reverse_lazy('productpart_list')

class ProductPartDeleteView(DeleteView):
    model = ProductParts
    template_name = 'crud/generic_confirm_delete.html'
    success_url = reverse_lazy('productpart_list')