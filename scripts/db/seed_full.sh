#!/bin/bash

BASE_URL_SHOP="http://localhost:8082/api/v1"
BASE_URL_ADMIN="http://localhost:8081/api/v1"

echo "1. Creating Super Admin..."
curl -s -X POST $BASE_URL_SHOP/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Admin", "email":"admin@mall.com", "password":"password123", "role":"ROLE_SUPER_ADMIN"}'

echo -e "\n2. Logging in as Admin..."
ADMIN_TOKEN=$(curl -s -X POST $BASE_URL_SHOP/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@mall.com", "password":"password123"}' | grep -o '"token":"[^"]*' | cut -d'"' -f4)

echo "Admin Token: ${ADMIN_TOKEN:0:20}..."

echo -e "\n3. Creating Vendor..."
curl -s -X POST $BASE_URL_SHOP/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Vendor One", "email":"vendor1@mall.com", "password":"password123", "role":"ROLE_SHOP_ADMIN", "vendorName":"Gadget Store", "vendorDescription":"Best electronics"}'

echo -e "\n4. Logging in as Admin to approve vendor..."
VENDOR_ID=$(curl -s -X GET $BASE_URL_ADMIN/admin/vendors -H "Authorization: Bearer $ADMIN_TOKEN" | grep -o '"id":[0-9]*' | head -1 | cut -d':' -f2)
echo "Vendor ID to approve: $VENDOR_ID"

curl -s -X POST $BASE_URL_ADMIN/admin/vendors/$VENDOR_ID/approve -H "Authorization: Bearer $ADMIN_TOKEN"

echo -e "\n5. Logging in as Vendor..."
VENDOR_TOKEN=$(curl -s -X POST $BASE_URL_SHOP/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"vendor1@mall.com", "password":"password123"}' | grep -o '"token":"[^"]*' | cut -d'"' -f4)

echo -e "\n6. Seeding Products..."
products=("Gaming Laptop:1200:Electronics" "Wireless Mouse:25:Electronics" "Mechanical Keyboard:150:Electronics" "USB-C Hub:40:Electronics" "Monitor 27 inch:300:Electronics")

for item in "${products[@]}"; do
  IFS=':' read -r name price cat <<< "$item"
  echo "Adding $name..."
  curl -s -X POST $BASE_URL_SHOP/shop-admin/vendors/$VENDOR_ID/products \
    -H "Authorization: Bearer $VENDOR_TOKEN" \
    -H "Content-Type: application/json" \
    -d "{\"name\":\"$name\", \"price\":$price, \"category\":\"$cat\", \"description\":\"Premium $name\", \"stockQuantity\":100, \"status\":\"AVAILABLE\"}"
done

echo -e "\nSeeding Completed!"
