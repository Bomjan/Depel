from ass.models import Category

def navbar_categories(request):
    """Fetch all categories with related products for the navbar."""
    categories = Category.objects.prefetch_related("products").all()
    return {"categories": categories}
