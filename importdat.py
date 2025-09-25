import os
import django
import pandas as pd
from django.utils.text import slugify

# Set up Django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "Web.settings")  # Replace "Web" with your project name if different
django.setup()

from ass.models import (
    Category,
    MiniTiller, MillingMachine, HarvestingMachine, PlantingSowingMachine,
    ThreshingMachine, WeedingMachine, IrrigationMachine, OtherMachine
)

# Map sheet names to model classes
PRODUCT_MODEL_MAP = {
    'MiniTiller': MiniTiller,
    'MillingMachine': MillingMachine,
    'HarvestingMachine': HarvestingMachine,
    'PlantingSowingMachine': PlantingSowingMachine,
    'ThreshingMachine': ThreshingMachine,
    'WeedingMachine': WeedingMachine,
    'IrrigationMachine': IrrigationMachine,
    'OtherMachine': OtherMachine,
}

# Map sheet names to real category names
SHEET_TO_CATEGORY = {
    'MiniTiller': 'MiniTillers',
    'MillingMachine': 'Milling Machines',
    'HarvestingMachine': 'Harvesting Machines',
    'PlantingSowingMachine': 'Planting and Sowing Machines',
    'ThreshingMachine': 'Threshing Machines',
    'WeedingMachine': 'Weeding Machines',
    'IrrigationMachine': 'Irrigation Machines',
    'OtherMachine': 'Other Machines',
}

file_path = r"C:\\Users\Dell\\OneDrive\\Desktop\\dpp.xlsx"

def import_products_from_excel(file_path):
    try:
        xls = pd.ExcelFile(file_path, engine='openpyxl')
    except Exception as e:
        print(f"❌ Failed to load Excel file: {e}")
        return

    for sheet_name, model in PRODUCT_MODEL_MAP.items():
        if sheet_name not in xls.sheet_names:
            print(f"⚠️ Sheet '{sheet_name}' not found in Excel. Skipping...")
            continue

        df = pd.read_excel(xls, sheet_name)
        df.columns = [col.strip().lower() for col in df.columns]  # Normalize column names

        print(f"\n📦 Importing products for: {sheet_name}")
        for index, row in df.iterrows():
            try:
                name = row.get('name')
                if not name:
                    print(f"⚠️ Row {index + 2}: Missing product name. Skipping.")
                    continue

                # Determine the correct category name
                raw_category = row.get('category')
                if raw_category and str(raw_category).strip():
                    category_name = str(raw_category).strip()
                else:
                    category_name = SHEET_TO_CATEGORY.get(sheet_name)
                    if not category_name:
                        print(f"❌ Sheet '{sheet_name}' is not mapped to a category. Skipping row {index + 2}.")
                        continue

                # Get or create the correct category
                category, _ = Category.objects.get_or_create(
                    name=category_name,
                    defaults={'slug': slugify(category_name)}
                )

                product_data = {
                    'category': category,
                    'name': name,
                    'brand': row.get('brand'),
                    'description': row.get('description'),
                    'slug': slugify(name),
                }

                # Add additional fields if present
                for field in model._meta.get_fields():
                    if field.auto_created or field.is_relation or field.name in product_data:
                        continue
                    field_name = field.name.lower()
                    if field_name in row:
                        product_data[field.name] = row[field_name]

                obj, created = model.objects.get_or_create(
                    name=name,
                    category=category,
                    defaults=product_data
                )
                print(f"✅ {'Created' if created else 'Exists'}: {name}")

            except Exception as e:
                print(f"❌ Error in {sheet_name} row {index + 2}: {e}")

# Run when script is executed directly
if __name__ == "__main__":
    import_products_from_excel(file_path)