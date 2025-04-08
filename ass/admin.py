from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import BoardOfDirector, ManagementTeam, Employee

class BoardOfDirectorAdmin(admin.ModelAdmin):
    list_display = ('name', 'position', 'image')

class ManagementTeamAdmin(admin.ModelAdmin):
    list_display = ('name', 'position', 'image')

class EmployeeAdmin(admin.ModelAdmin):
    list_display = ('name', 'position', 'image')

admin.site.register(BoardOfDirector, BoardOfDirectorAdmin)
admin.site.register(ManagementTeam, ManagementTeamAdmin)
admin.site.register(Employee, EmployeeAdmin)

from .models import Category, MiniTiller, MillingMachine, HarvestingMachine, PlantingSowingMachine, ThreshingMachine, WeedingMachine, IrrigationMachine, OtherMachine, ProductParts

admin.site.register(Category)
admin.site.register(MiniTiller)
admin.site.register(MillingMachine)
admin.site.register(HarvestingMachine)
admin.site.register(PlantingSowingMachine)
admin.site.register(ThreshingMachine)
admin.site.register(WeedingMachine)
admin.site.register(OtherMachine)
admin.site.register(IrrigationMachine)
admin.site.register(ProductParts)
