from django import forms
from .models import BoardOfDirector, ManagementTeam, Employee
from .models import ProductService, ProductParts
from .models import Website
from .models import Carousel

class BoardOfDirectorForm(forms.ModelForm):
    class Meta:
        model = BoardOfDirector
        fields = ['name', 'position', 'image']

class ManagementTeamForm(forms.ModelForm):
    class Meta:
        model = ManagementTeam
        fields = ['name', 'position', 'image']

class EmployeeForm(forms.ModelForm):
    class Meta:
        model = Employee
        fields = ['name', 'position', 'image']


# Main product form
class ProductServiceForm(forms.ModelForm):
    class Meta:
        model = ProductService
        fields = '__all__'

#this is custom widget for multiple image parts reception. 
from django import forms

class MultipleFileInput(forms.widgets.Input):
    input_type = 'file'
    template_name = 'django/forms/widgets/file.html'
    
    def __init__(self, attrs=None):
        attrs = attrs or {}
        attrs['multiple'] = True
        super().__init__(attrs=attrs)

    def value_from_datadict(self, data, files, name):
        return files.getlist(name)

class ProductPartsForm(forms.Form):
    images = forms.FileField(
        widget=MultipleFileInput(),
        required=False,
        help_text='Select multiple files'
    )
    
class WebsiteForm(forms.ModelForm):
    class Meta:
        model = Website
        fields = ['name', 'url']

class CarouselForm(forms.ModelForm):
    class Meta:
        model = Carousel 
        fields = ['image']
