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
