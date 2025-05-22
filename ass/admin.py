from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import BoardOfDirector, ManagementTeam, Employee, PaddyThresherVideo

from .models import (
    MiniTillerPart, MillingMachinePart, HarvestingMachinePart,
    PlantingSowingMachinePart, ThreshingMachinePart,
    WeedingMachinePart, IrrigationMachinePart, OtherMachinePart
)

class BoardOfDirectorAdmin(admin.ModelAdmin):
    list_display = ('name', 'position', 'image')

class ManagementTeamAdmin(admin.ModelAdmin):
    list_display = ('name', 'position', 'image')

class EmployeeAdmin(admin.ModelAdmin):
    list_display = ('name', 'position', 'image')

admin.site.register(BoardOfDirector, BoardOfDirectorAdmin)
admin.site.register(ManagementTeam, ManagementTeamAdmin)
admin.site.register(Employee, EmployeeAdmin)

from .models import Category, MiniTiller, MillingMachine, HarvestingMachine, PlantingSowingMachine, ThreshingMachine, WeedingMachine, IrrigationMachine, OtherMachine

admin.site.register(Category)
admin.site.register(MiniTiller)
admin.site.register(MillingMachine)
admin.site.register(HarvestingMachine)
admin.site.register(PlantingSowingMachine)
admin.site.register(ThreshingMachine)
admin.site.register(WeedingMachine)
admin.site.register(OtherMachine)
admin.site.register(IrrigationMachine)

admin.site.register(PaddyThresherVideo)



admin.site.register(MiniTillerPart)
admin.site.register(MillingMachinePart)
admin.site.register(HarvestingMachinePart)
admin.site.register(PlantingSowingMachinePart)
admin.site.register(ThreshingMachinePart)
admin.site.register(WeedingMachinePart)
admin.site.register(IrrigationMachinePart)
admin.site.register(OtherMachinePart)


