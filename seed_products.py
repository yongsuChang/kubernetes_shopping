import requests
import json
import random

SHOP_API_URL = "http://localhost:8082/api/v1"
ADMIN_API_URL = "http://localhost:8081/api/v1"

def seed_data():
    # 1. Admin Login
    admin_login = requests.post(f"{SHOP_API_URL}/auth/login", json={"email": "admin@fixed.com", "password": "password123"})
    admin_token = admin_login.json().get("token")
    admin_headers = {"Authorization": f"Bearer {admin_token}"}

    # 2. Get Vendor ID (Assume ID 1 exists from previous tests or create new)
    vendors = requests.get(f"{ADMIN_API_URL}/admin/vendors", headers=admin_headers).json()
    if not vendors:
        print("No vendors found. Please run api_test_script.py first.")
        return
    
    vendor_id = vendors[0]['id']
    vendor_email = vendors[0]['owner']['email'] # We need the owner email to act as vendor

    # Login as Vendor Owner
    # To simplify, we'll assume we know the vendor password or use a fixed one
    vendor_login = requests.post(f"{SHOP_API_URL}/auth/login", json={"email": "int@test.com", "password": "password123"})
    vendor_token = vendor_login.json().get("token")
    vendor_headers = {"Authorization": f"Bearer {vendor_token}"}

    products_to_create = [
        {"name": "Gaming Laptop", "price": 1200, "category": "Electronics", "desc": "High performance gaming laptop"},
        {"name": "Wireless Mouse", "price": 25, "category": "Electronics", "desc": "Ergonomic wireless mouse"},
        {"name": "Cotton T-Shirt", "price": 15, "category": "Clothing", "desc": "100% pure cotton"},
        {"name": "Denim Jeans", "price": 45, "category": "Clothing", "desc": "Classic blue jeans"},
        {"name": "Coffee Maker", "price": 80, "category": "Home", "desc": "Brew fresh coffee every morning"},
        {"name": "Chef Knife", "price": 35, "category": "Home", "desc": "Professional grade stainless steel"},
        {"name": "History Book", "price": 20, "category": "Books", "desc": "World War II detailed history"},
        {"name": "Sunscreen SPF 50", "price": 12, "category": "Beauty", "desc": "Skin protection from UV rays"},
        {"name": "Yoga Mat", "price": 30, "category": "Sports", "desc": "Non-slip comfortable mat"},
        {"name": "Dumbbells (5kg)", "price": 25, "category": "Sports", "desc": "Pair of solid iron dumbbells"}
    ]

    print(f"Seeding {len(products_to_create)} products for Vendor ID: {vendor_id}")
    for p in products_to_create:
        payload = {
            "name": p["name"],
            "description": p["desc"],
            "price": p["price"],
            "stockQuantity": 100,
            "category": p["category"],
            "status": "AVAILABLE"
        }
        resp = requests.post(f"{SHOP_API_URL}/shop-admin/vendors/{vendor_id}/products", json=payload, headers=vendor_headers)
        if resp.status_code == 200:
            print(f"✅ Created: {p['name']}")
        else:
            print(f"❌ Failed: {p['name']} - {resp.text}")

if __name__ == "__main__":
    seed_data()
