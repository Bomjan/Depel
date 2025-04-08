from django import template

register = template.Library()

@register.filter
def beautify_key(value):
    return value.replace('_', ' ').title()
