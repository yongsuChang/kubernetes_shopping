import requests
import json
import time
import random
import string

# Config
SHOP_API_URL = "http://localhost:8082/api/v1"
ADMIN_API_URL = "http://localhost:8081/api/v1"

def generate_random_string(length=8):
    return ''.join(random.choices(string.ascii_lowercase + string.digits, k=length))

def print_step(message):
    print(f"\n{'='*50}\n{message}\n{'='*50}")

def print_success(message):
    print(f"✅ {message}")

def print_fail(message, details=""):
    print(f"❌ {message}")
    if details:
        print(f"Details: {details}")

# 1. Create Super Admin
print_step("1. Setting up Super Admin")
admin_email = f"superadmin_{generate_random_string()}@test.com"
admin_password = "password123"
admin_name = "Super Admin Test"

payload = {
    "name": admin_name,
    "email": admin_email,
    "password": admin_password,
    "role": "ROLE_SUPER_ADMIN"
}

try:
    # Try to signup
    response = requests.post(f"{SHOP_API_URL}/auth/signup", json=payload)
    if response.status_code in [200, 201]:
        print_success("Super Admin Signed Up")
    else:
        # If already exists (unlikely with random email)
        print_fail(f"Super Admin Signup failed: {response.status_code}", response.text)
except Exception as e:
    print_fail("Super Admin Signup Exception", str(e))

# Login Super Admin
admin_token = ""
try:
    response = requests.post(f"{SHOP_API_URL}/auth/login", json={"email": admin_email, "password": admin_password})
    if response.status_code == 200:
        admin_token = response.json().get("token")
        print_success(f"Super Admin Logged In. Token: {admin_token[:10]}...")
    else:
        print_fail("Super Admin Login failed", response.text)
        exit(1)
except Exception as e:
    print_fail("Super Admin Login Exception", str(e))
    exit(1)

# 2. Create User
print_step("2. Setting up Regular User")
user_email = f"user_{generate_random_string()}@test.com"
user_password = "password123"
user_payload = {
    "name": "Regular User",
    "email": user_email,
    "password": user_password,
    "role": "ROLE_USER"
}
requests.post(f"{SHOP_API_URL}/auth/signup", json=user_payload)
# Login
user_token = ""
resp = requests.post(f"{SHOP_API_URL}/auth/login", json={"email": user_email, "password": user_password})
if resp.status_code == 200:
    user_token = resp.json().get("token")
    print_success("User Logged In")
else:
    print_fail("User Login Failed")

# 3. Create Vendor (Pending)
print_step("3. Setting up Vendor (Pending)")
vendor_email = f"vendor_{generate_random_string()}@test.com"
vendor_password = "password123"
vendor_payload = {
    "name": "Vendor Test",
    "email": vendor_email,
    "password": vendor_password,
    "role": "ROLE_SHOP_ADMIN",
    "vendorName": f"Shop_{generate_random_string()}",
    "vendorDescription": "Best Shop",
    "vendorEmail": vendor_email,
    "vendorAddress": "123 Vendor St"
}
requests.post(f"{SHOP_API_URL}/auth/signup", json=vendor_payload)
# Login
vendor_token = ""
resp = requests.post(f"{SHOP_API_URL}/auth/login", json={"email": vendor_email, "password": vendor_password})
if resp.status_code == 200:
    vendor_token = resp.json().get("token")
    print_success("Vendor Logged In (Token Acquired)")
else:
    print_fail("Vendor Login Failed")

# 4. Get Vendor ID (via Admin API) - More reliable than "me" endpoint for now
print_step("4. Retrieving Vendor ID via Admin API")
vendor_id = 0
headers_admin = {"Authorization": f"Bearer {admin_token}"}

try:
    resp = requests.get(f"{ADMIN_API_URL}/admin/vendors", headers=headers_admin)
    if resp.status_code == 200:
        vendors = resp.json()
        # Find our vendor by email
        target_vendor = next((v for v in vendors if v["contactEmail"] == vendor_email), None)
        if target_vendor:
            vendor_id = target_vendor["id"]
            print_success(f"Found Vendor ID: {vendor_id} (Status: {target_vendor['status']})")
        else:
            print_fail("Vendor not found in Admin List")
    else:
        print_fail("Failed to list vendors (Admin)", resp.text)
except Exception as e:
    print_fail("Exception listing vendors", str(e))

# 5. Approve Vendor via Admin API
print_step("5. Approving Vendor (Admin API)")
if vendor_id:
    try:
        # url: /api/v1/admin/vendors/{id}/approve
        resp = requests.post(f"{ADMIN_API_URL}/admin/vendors/{vendor_id}/approve", headers=headers_admin)
        if resp.status_code == 200:
            print_success("Vendor Approved by Admin")
        else:
            print_fail("Vendor Approval Failed", resp.text)
    except Exception as e:
        print_fail("Exception approving vendor", str(e))
else:
    print("Skipping Approval (No Vendor ID)")

# 6. Create Product as Vendor
print_step("6. Creating Product (Vendor)")
product_id = 0
if vendor_id:
    headers_vendor = {"Authorization": f"Bearer {vendor_token}"}
    product_payload = {
        "name": "Test Product",
        "description": "A great product",
        "price": 100,
        "stockQuantity": 50,
        "category": "Electronics",
        "status": "AVAILABLE"
    }
    try:
        resp = requests.post(f"{SHOP_API_URL}/shop-admin/vendors/{vendor_id}/products", json=product_payload, headers=headers_vendor)
        if resp.status_code == 200:
            print_success("Product Created")
        else:
            print_fail("Product Creation Failed", resp.text)
    except Exception as e:
        print_fail("Exception creating product", str(e))
else:
    print("Skipping Product Creation")

# 7. Platform Product Management (Admin)
print_step("7. Platform Product Management (Admin)")
try:
    # List all products
    resp = requests.get(f"{ADMIN_API_URL}/admin/products", headers=headers_admin)
    if resp.status_code == 200:
        products = resp.json()
        print_success(f"Retrieved {len(products)} products")
        if len(products) > 0:
            # Find the product we just created
            target_p = products[-1] # Assume last one
            pid = target_p['id']
            print(f"Targeting Product ID: {pid}")
            
            # Toggle Status
            print(f"Toggling status for Product ID: {pid}")
            resp_toggle = requests.patch(f"{ADMIN_API_URL}/admin/products/{pid}/toggle-status", headers=headers_admin)
            if resp_toggle.status_code == 200:
                print_success("Product Status Toggled")
            else:
                print_fail("Toggle Failed", resp_toggle.text)
    else:
        print_fail("Failed to list products", resp.text)
except Exception as e:
    print_fail("Exception listing products", str(e))

print("\nTest Complete.")