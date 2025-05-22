from django import forms

from .models import (
    # people
    BoardOfDirector,
    ManagementTeam,
    Employee,

    # products
    Category, 


    MiniTiller,            # 1
    HarvestingMachine,     # 2
    PlantingSowingMachine, # 3
    ThreshingMachine,      # 4
    WeedingMachine,        # 5
    OtherMachine,          # 6
    MillingMachine,        # 7
    IrrigationMachine,     # 8

    # parts
    MillingMachinePart,
    MiniTillerPart,
    HarvestingMachinePart,
    PlantingSowingMachinePart,
    ThreshingMachinePart,
    WeedingMachinePart,
    OtherMachinePart,
    IrrigationMachinePart,

    # websites
    Website,

    # carousels
    Carousel,

    # video
    PaddyThresherVideo
)

class BoardOfDirectorForm(forms.ModelForm):
    class Meta:
        model = BoardOfDirector
        fields = ['name', 'position', 'bio', 'image']

class ManagementTeamForm(forms.ModelForm):
    class Meta:
        model = ManagementTeam
        fields = ['name', 'position', 'bio', 'image']

class EmployeeForm(forms.ModelForm):
    class Meta:
        model = Employee
        fields = ['name', 'position', 'bio', 'image']


# Main product form
class CategoryForm(forms.ModelForm):
    class Meta:
        model = Category
        fields = ['name', 'slug']
        widgets = {
            'slug': forms.TextInput(attrs={'placeholder': 'Auto-generated if empty'})
        }
        help_texts = {
            'slug': 'Leave empty to auto-generate from name'
        }

class ProductBaseForm(forms.ModelForm):
    class Meta:
        widgets = {
            'slug': forms.TextInput(attrs={'placeholder': 'Auto-generated, please keep it empty'}),
            'description': forms.Textarea(attrs={'rows': 2}),
        }
        help_texts = {
            'slug': 'Leave empty to auto-generate from product name'
        }

# ---- Product Forms ---- #
class MiniTillerForm(ProductBaseForm):
    class Meta(ProductBaseForm.Meta):
        model = MiniTiller
        fields = '__all__'
        exclude = ['slug', 'category']

class MillingMachineForm(ProductBaseForm):
    class Meta(ProductBaseForm.Meta):
        model = MillingMachine
        fields = '__all__'
        exclude = ['slug', 'category']

class HarvestingMachineForm(ProductBaseForm):
    class Meta(ProductBaseForm.Meta):
        model = HarvestingMachine
        fields = '__all__'
        exclude = ['slug', 'category']

class PlantingSowingMachineForm(ProductBaseForm):
    class Meta(ProductBaseForm.Meta):
        model = PlantingSowingMachine
        fields = '__all__'
        exclude = ['slug', 'category']

class ThreshingMachineForm(ProductBaseForm):
    class Meta(ProductBaseForm.Meta):
        model = ThreshingMachine
        fields = '__all__'
        exclude = ['slug', 'category']

class WeedingMachineForm(ProductBaseForm):
    class Meta(ProductBaseForm.Meta):
        model = WeedingMachine
        fields = '__all__'
        exclude = ['slug', 'category']

class IrrigationMachineForm(ProductBaseForm):
    class Meta(ProductBaseForm.Meta):
        model = IrrigationMachine
        fields = '__all__'
        exclude = ['slug', 'category']

class OtherMachineForm(ProductBaseForm):
    class Meta(ProductBaseForm.Meta):
        model = OtherMachine
        fields = '__all__'
        exclude = ['slug', 'category']


class MultipleFileInput(forms.widgets.Input):
    input_type = 'file'
    template_name = 'django/forms/widgets/file.html'
    
    def __init__(self, attrs=None):
        attrs = attrs or {}
        attrs['multiple'] = True
        super().__init__(attrs=attrs)

    def value_from_datadict(self, data, files, name):
        return files.getlist(name)


# class ProductPartsForm(forms.Form):
#     images = forms.FileField(
#         widget=MultipleFileInput(),
#         required=False,
#         help_text='Select multiple files'
#     )
    
#  here
class BasePartForm(forms.ModelForm):
    """Common settings: just an ImageField with multiple upload."""
    class Meta:
        fields = ['image']
        widgets = {
            'image': MultipleFileInput()
        }

class MiniTillerPartForm(BasePartForm):
    class Meta(BasePartForm.Meta):
        model = MiniTillerPart

class MillingMachinePartForm(BasePartForm):
    class Meta(BasePartForm.Meta):
        model = MillingMachinePart

class HarvestingMachinePartForm(BasePartForm):
    class Meta(BasePartForm.Meta):
        model = HarvestingMachinePart

class PlantingSowingMachinePartForm(BasePartForm):
    class Meta(BasePartForm.Meta):
        model = PlantingSowingMachinePart

class ThreshingMachinePartForm(BasePartForm):
    class Meta(BasePartForm.Meta):
        model = ThreshingMachinePart

class WeedingMachinePartForm(BasePartForm):
    class Meta(BasePartForm.Meta):
        model = WeedingMachinePart

class IrrigationMachinePartForm(BasePartForm):
    class Meta(BasePartForm.Meta):
        model = IrrigationMachinePart

class OtherMachinePartForm(BasePartForm):
    class Meta(BasePartForm.Meta):
        model = OtherMachinePart



# here



class WebsiteForm(forms.ModelForm):
    class Meta:
        model = Website
        fields = ['name', 'url']

class CarouselForm(forms.ModelForm):
    class Meta:
        model = Carousel 
        fields = ['image']

class PaddyThresherVideoForm(forms.ModelForm):
    class Meta:
        model = PaddyThresherVideo
        fields = ['title', 'description', 'video']

class ContactForm(forms.Form):
    full_name = forms.CharField(max_length=100)
    email = forms.EmailField()
    subject = forms.CharField(max_length=200)
    message = forms.CharField(widget=forms.Textarea(attrs={'rows': 4}))