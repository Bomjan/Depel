from django.views.generic import ListView, CreateView, UpdateView, DeleteView
from django.urls import reverse_lazy
from ass.models import BoardOfDirector, ManagementTeam, Employee
from ass.forms import BoardOfDirectorForm, ManagementTeamForm, EmployeeForm

# Board of Directors
class BoardOfDirectorListView(ListView):
    model = BoardOfDirector
    template_name = 'crud/people_list.html'
    context_object_name = 'people'
    extra_context = {'title': 'Board of Directors'}

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

# Management Team
class ManagementTeamListView(ListView):
    model = ManagementTeam
    template_name = 'crud/people_list.html'
    context_object_name = 'people'
    extra_context = {'title': 'Management Team'}

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

# Employees
class EmployeeListView(ListView):
    model = Employee
    template_name = 'crud/people_list.html'
    context_object_name = 'people'
    extra_context = {'title': 'Employees'}

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