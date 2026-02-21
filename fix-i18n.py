import json

# Load both files
with open('client/src/i18n/locales/en.json', 'r') as f:
    en = json.load(f)
with open('client/src/i18n/locales/zh.json', 'r') as f:
    zh = json.load(f)

# The correct English translations for the broken products keys
# Based on the Chinese translations in zh.json
fixes = {
    "title": "Sacred Jewelry",
    "subtitle": "Curated blessed jewelry, inheriting ancient wisdom, protecting your life journey",
    "viewAll": "View All Products",
    "all_products": "All Products",
    "search_placeholder": "Search products...",
    "select_category": "Select Category",
    "all_categories": "All Categories",
    "sort_newest": "Newest",
    "sort_price_low": "Price: Low to High",
    "sort_price_high": "Price: High to Low",
    "sort_popular": "Most Popular",
    "total_count": "{{count}} products",
    "search_label": "Search",
    "sale_badge": "Sale",
    "sold_out": "Sold Out",
    "stock_low": "Only {{count}} left",
    "no_products": "No products available",
    "try_other_filters": "Try different search criteria",
}

# Apply fixes to en.json products section
for key, value in fixes.items():
    if key in en['products']:
        old = en['products'][key]
        en['products'][key] = value
        print(f"Fixed: products.{key}: {type(old).__name__} -> str = '{value}'")

# Also remove the slug-based product entries that are dicts (fortune-energy-analysis-report etc.)
# These should not be in the i18n file as UI strings
slug_keys_to_remove = []
for k, v in en['products'].items():
    if isinstance(v, dict) and not k.isdigit() and k not in fixes:
        slug_keys_to_remove.append(k)

for k in slug_keys_to_remove:
    print(f"Removing slug product entry: products.{k}")
    del en['products'][k]

# Save
with open('client/src/i18n/locales/en.json', 'w') as f:
    json.dump(en, f, ensure_ascii=False, indent=2)

print("\nDone! en.json fixed.")
