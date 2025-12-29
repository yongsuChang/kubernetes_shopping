# Test Scenarios

## Overview
This document outlines the end-to-end test scenarios for the Kubernetes Shopping platform. These scenarios cover the core critical paths including user authentication, vendor approval, product management, and order placement.

## Prerequisites
- MySQL database is running.
- `admin-api` (Port 8081) is running.
- `shop-api` (Port 8082) is running.

## Scenarios

### 1. Super Admin Setup
**Goal**: Verify that the Super Admin can sign up and log in.
- **Action**: POST `/api/v1/auth/signup` (shop-api) with `ROLE_SUPER_ADMIN`.
- **Expected Result**: 200 OK, "Signup successful".
- **Action**: POST `/api/v1/auth/login` (shop-api) with admin credentials.
- **Expected Result**: 200 OK, Returns JWT Token.

### 2. User Lifecycle
**Goal**: Verify regular user registration and login.
- **Action**: POST `/api/v1/auth/signup` (shop-api) with `ROLE_USER`.
- **Expected Result**: 200 OK.
- **Action**: POST `/api/v1/auth/login`.
- **Expected Result**: 200 OK, Returns JWT Token.

### 3. Vendor Lifecycle
**Goal**: Verify vendor registration, approval by admin, and product creation.
- **Step 3.1: Vendor Signup**
    - **Action**: POST `/api/v1/auth/signup` (shop-api) with `ROLE_SHOP_ADMIN` and vendor details (name, description, etc.).
    - **Expected Result**: 200 OK.
- **Step 3.2: Vendor Login (Pre-Approval)**
    - **Action**: POST `/api/v1/auth/login`.
    - **Expected Result**: 200 OK, Returns Token (but restricted access).
- **Step 3.3: Admin Approval**
    - **Action**: GET `/api/v1/admin/vendors` (admin-api) using Admin Token.
    - **Expected Result**: List of vendors, finding the new vendor ID.
    - **Action**: POST `/api/v1/admin/vendors/{id}/approve` (admin-api).
    - **Expected Result**: 200 OK.
- **Step 3.4: Product Creation**
    - **Action**: POST `/api/v1/shop-admin/vendors/{vendorId}/products` (shop-api) using Vendor Token.
    - **Payload**: Name, Description, Price, Stock.
    - **Expected Result**: 200 OK, Product Created.

### 4. Admin Product Management
**Goal**: Verify admin can manage platform products.
- **Action**: GET `/api/v1/admin/products` (admin-api).
- **Expected Result**: List containing the created product.
- **Action**: PATCH `/api/v1/admin/products/{id}/toggle-status`.
- **Expected Result**: 200 OK, Product status changed (e.g., Hidden/Visible).

### 5. Order Flow (Future)
- **Action**: User adds product to cart.
- **Action**: User places order.
- **Action**: Vendor fulfills order.
