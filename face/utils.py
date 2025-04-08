def filter_product_attributes(product):
    """
    Filters out empty fields and fields with the value 'other' from a product instance.
    """
    excluded_values = ["", None, "other"]
    product_details = {
        "name": product.name,
        "brand": product.brand,
        "description": product.description,
        "type_is": product.type_is,
        "displacement_capacity": product.displacement_capacity,
        "speed": product.speed,
        "power": product.power,
        "starting_system": product.starting_system,
        "fuel_tank_capacity": product.fuel_tank_capacity,
        "fuel": product.fuel,
        "fuel_consumption": product.fuel_consumption,
        "gear_box": product.gear_box,
        "handle_bar": product.handle_bar,
        "headlight": product.headlight,
        "tyre": product.tyre,
        "certification": product.certification,
        "usage": product.usage,
        "gross_weight": product.gross_weight,
        "image": product.image.url if product.image else None,
    }
    
    # Filter out fields with empty values or 'other'
    return {key: value for key, value in product_details.items() if value not in excluded_values}
