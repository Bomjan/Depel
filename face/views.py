from django.shortcuts import render, redirect
from ass.models import Carousel, Employee, BoardOfDirector, ManagementTeam
from django.contrib.auth import authenticate, login as auth_login
from django.contrib import messages


# Create your views here.
def index(request):
    carousel_images = Carousel.objects.all()
    return render(request, 'face/index.html', {'carousel_images':carousel_images})


def login(request):
    if request.method == "POST":
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)
        
        if user is not None:
            auth_login(request, user)
            return redirect("ass:dashboard")  # Redirect to your dashboard
        else:
            messages.error(request, "Invalid username or password. If you are not the right person, please do not try. Else the cops will be there within 3 mins.")

    return render(request, "face/login.html")

def info(request):
    employees = Employee.objects.all()
    board_members = BoardOfDirector.objects.all()
    management_team = ManagementTeam.objects.all()

    context = { 
        'employees' : employees, 
        'board_members': board_members, 
        'management_team' : management_team,
    }
    return render(request, 'face/info.html',context)


def people(request):
    board_of_directors = BoardOfDirector.objects.all()
    management_team = ManagementTeam.objects.all()
    employees = Employee.objects.all()
    
    return render(request, 'face/people.html', {
        'board_of_directors': board_of_directors,
        'management_team': management_team,
        'employees': employees
    })
