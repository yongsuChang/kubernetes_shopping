# Project Progress Tracking

## Backend (Java Spring Boot)
- [x] Multi-module Project Setup (Gradle Kotlin DSL)
    - `common`: Shared entities, security utils, enums
    - `admin-api`: Root management API (Port 8081)
    - `shop-api`: Vendor & Customer API (Port 8082)
- [x] Build System Refactoring
    - Migrated dependencies to individual modules
    - Added Gradle wrapper
- [x] Database Configuration
    - MySQL 8 integration
    - JPA/Hibernate with Soft Delete support
- [x] Security & Authentication
    - Spring Security 3.x integration
    - JWT (jjwt 0.12.3) implementation
    - Role-based Access Control (SUPER_ADMIN, SHOP_ADMIN, USER)
    - Configurable CORS filter
- [x] Core Domain Implementation (Common Module)
    - Entities: Member, Vendor, Product, Address, Order, Review
    - Enums: Role, Status types
- [x] Application Scaffolding
    - [x] Main Application classes with Component Scanning
    - [x] Health Check Controllers
    - [x] Swagger (SpringDoc OpenAPI) Integration
    - [x] Global Exception Handler
    - [x] Strict Admin Security
    - Implemented `AdminAccessFilter` for secondary authorization
    - Prepared IP-based whitelist filtering policy
    - Restricted Health Check API to SUPER_ADMIN only (both modules)
- [x] Business Logic Implementation
    - [x] Authentication (Signup/Login) in `shop-api`
    - [x] Vendor Management (Registration in `shop-api` & Approval in `admin-api`)
    - [x] Product Management (CRUD for Vendors in `shop-api`)
    - [x] Order Management (Browsing & Ordering for Customers in `shop-api`)
- [x] Kubernetes Manifests
    - [x] Base resources (Namespace, Secret, ConfigMap)
    - [x] MySQL Deployment & Service
    - [x] API Module Deployments (2 Replicas each)
    - [x] Nginx Ingress Controller setup

## Frontend (React)
- [x] Project Initialization (Vite + TS)
- [x] UI Component Library (25+ components)
- [x] Responsive Layout & CSS Variables
- [x] Vitest Environment Setup & Verification
- [x] Linter & Code Style Standardization
- [x] State Management (Zustand)
- [x] Backend API Integration (Axios + Interceptors)
- [x] Core Pages Implementation (Login, Signup, Product List)
- [x] Admin Dashboard & Vendor Management
    - Implemented `AdminDashboard` and `VendorManagement` pages
    - Integrated with `admin-api` for vendor approvals
- [x] Role-based Access Control & UX Improvements
    - [x] Allow non-logged-in users to browse products
    - [x] Dynamic Navigation:
        - [x] ROLE_USER: My Page button
        - [x] ROLE_SHOP_ADMIN: Vendor Management button
        - [x] ROLE_SUPER_ADMIN: Admin Dashboard button
    - [x] Token-first Authentication Flow: Verify token on frontend before API calls
    
    ## 🚀 Pending Features & Roadmap
    
    ### 👤 User Features (ROLE_USER)
    - [ ] **My Page**: Profile management & Order history details
    - [ ] **Shopping Cart**: Add/Remove products & adjust quantities
    - [ ] **Checkout Process**: Implement order creation and mock payment flow
    - [ ] **Reviews**: Posting and managing product reviews
    
    ### 🏪 Vendor Features (ROLE_SHOP_ADMIN)
    - [ ] **Vendor Dashboard**: Sales overview and statistics
    - [ ] **Product Management (Frontend)**: UI for Creating, Updating, and Deleting products
    - [ ] **Order Fulfillment**: Management of incoming orders and status updates (Processing -> Shipped)
    
    ### 👑 Admin Features (ROLE_SUPER_ADMIN)
    - [ ] **User Management**: View all users and manage roles/status
    - [ ] **Advanced Vendor Control**: Suspend or reactivate vendors
    - [ ] **System Statistics**: Global sales and registration metrics
    
    ### 🛠 Infrastructure & Security
    - [ ] **IP Whitelist Enforcement**: Activate strict blocking in `AdminAccessFilter`
    - [ ] **CI/CD Pipeline**: Automated build and deployment (GitHub Actions)
    - [ ] **Logging & Monitoring**: Integrated logging stack (ELK or similar)
    
    ## Infrastructure
    
- [x] Dockerization
    - [x] Multi-stage Dockerfiles for all API modules
- [x] Kubernetes Configuration (Ready for deployment)
- [ ] CI/CD Pipeline
