#!/bin/bash
BASE_URL_SHOP="http://localhost:8082/api/v1"
BASE_URL_ADMIN="http://localhost:8081/api/v1"

# 1. Login Admin
ADMIN_TOKEN=$(curl -s -X POST $BASE_URL_SHOP/auth/login -H "Content-Type: application/json" -d '{"email":"admin@mall.com", "password":"password123"}' | grep -o '"token":"[^"].*' | cut -d'"' -f4)

# 2. Approve ALL Pending Vendors
echo "Approving all pending vendors..."
PENDING_IDS=$(curl -s -X GET $BASE_URL_ADMIN/admin/vendors -H "Authorization: Bearer $ADMIN_TOKEN" | grep -o '"id":[0-9]*' | cut -d':' -f2)

for vid in $PENDING_IDS; do
  echo "Approving Vendor ID: $vid"
  curl -s -X POST $BASE_URL_ADMIN/admin/vendors/$vid/approve -H "Authorization: Bearer $ADMIN_TOKEN"
done

# 3. Login Vendor (Gadget Store owner: vendor1@mall.com)
VENDOR_TOKEN=$(curl -s -X POST $BASE_URL_SHOP/auth/login -H "Content-Type: application/json" -d '{"email":"vendor1@mall.com", "password":"password123"}' | grep -o '"token":"[^"].*' | cut -d'"' -f4)

# 4. Get Vendor ID for Gadget Store
MY_VENDOR_ID=2 # We saw it was 2 in DB check

# 5. Seed Products
echo "Seeding Products for Vendor 2..."
products=("Gaming Laptop:1200:Electronics" "Wireless Mouse:25:Electronics" "Mechanical Keyboard:150:Electronics" "USB-C Hub:40:Electronics" "Monitor 27 inch:300:Electronics")

for item in "${products[@]}"; do
  IFS=':' read -r name price cat <<< "$item"
  curl -s -X POST $BASE_URL_SHOP/shop-admin/vendors/$MY_VENDOR_ID/products \
    -H "Authorization: Bearer $VENDOR_TOKEN" \
    -H "Content-Type: application/json" \
    -d "{\"name\":\"$name\", \"price\":$price, \"category\":\"$cat\", \"description\":\"Premium $name\", \"stockQuantity\":100, \"status\":\"AVAILABLE\"}"
done
echo "Seed Complete"
