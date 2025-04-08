from django.urls import path 
from . import views

app_name = 'face'
urlpatterns = [
    path('', views.index, name='index'),
    path('login/', views.login, name='login'),
    path('info/', views.info, name='info'),
    path('people/', views.people, name='people'),
    path('catalogue/', views.catalogue, name='catalogue'),
    # path('<slug:category_slug>/<slug:product_slug>/', views.product_detail, name='product_detail'),
    path("product_detail/<slug:category_slug>/<slug:product_slug>/", views.product_detail, name="product_detail"),
]