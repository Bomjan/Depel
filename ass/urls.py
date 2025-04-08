# ass/urls.py
from django.urls import path
from . import views
from face.views import product_detail as product 

app_name = 'ass'
urlpatterns = [
    path('dashboard/', views.dashboard, name='dashboard'),
    path('products_services/', views.products_services, name= 'products_services'),
    path('website-list/', views.website_list, name='website_list'),
    path("manage_carousel/", views.manage_carousel, name='manage_carousel'),
    path('products/<slug:category_slug>/<slug:product_slug>/', product, name='product_detail'),
]
