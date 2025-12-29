# 🧪 Test Strategy & Execution Plan

This document outlines the testing strategy for the Kubernetes Shopping project, covering Backend, Frontend, and Infrastructure layers.

## 1. 🏗️ Backend Testing (Spring Boot)

### ✅ Completed
- **Smoke Testing**: Validated server startup for `admin-api` (8081) and `shop-api` (8082).
- **Core API Scenarios**: Verified via `api_test_script.py`.
    - [x] Super Admin Signup/Login (JWT Token generation)
    - [x] User Signup/Login
    - [x] Vendor Signup (Pending State)
    - [x] Vendor Approval (Admin API)
    - [x] Product Creation (Vendor API)
    - [x] Platform Product Management (Admin API)
    - [x] **System Report API** (Native Query verification & DB column mapping fix)
- **Unit Testing**:
    - [x] `MemberService` (Business logic for vendor creation rules)
    - [x] `OrderService` (Stock deduction and status updates)
- **Controller Tests**:
    - [x] `AuthController` (Signup/Login)
    - [x] `ProductController` (Creation validation)
    - [x] `OrderController` (Order flow)

### 📋 To-Do (Next Steps)
- **Integration Tests**:
    - [ ] DB Integration tests using Testcontainers (Optional but recommended for CI)
- **Admin API Tests**:
    - [ ] `AdminVendorService` and `AdminVendorController` tests


---

## 2. 🎨 Frontend Testing (React)

### 📋 To-Do
- **Unit/Component Testing** (Vitest + React Testing Library):
    - [ ] Common Components (`Button`, `Input`, `Card`)
    - [ ] Authentication Forms (Login/Signup validation)
- **Integration Testing**:
    - [ ] Protected Route logic (Redirection for unauthenticated users)
    - [ ] State Management (Zustand store updates)

---

## 3. ☸️ Infrastructure & E2E Testing

### ✅ Completed
- **Docker Compose**:
    - [x] Verified full stack startup for backend and DB (`docker compose up -d`).
    - [x] Verified API connectivity within Docker environment using `api_test_script.py`.
- **E2E Scenario**:
    - [x] Full flow (Signup -> Approval -> Product Creation -> Admin Management) verified in containerized environment.

### 📋 To-Do
- **Kubernetes (Minikube/Local)**:
    - [ ] Install `kubectl` (if environment permits) or verify on a system with Kubernetes.
    - [ ] Deployment Manifest validation.
    - [ ] Service & Ingress connectivity.
    - [ ] Database persistence (PVC) verification.


---

## 4. 🚀 CI/CD Pipeline

### ✅ Completed
- **GitHub Actions**:
    - [x] Backend test automation (Gradle).
    - [x] Frontend test automation (Vitest).
    - [x] Docker image build validation.
    - [x] Integration testing using `docker-compose` within CI.
- **Branching Strategy Integration**:
    - CI는 `main`, `develop` 브랜치 푸시 및 `main` 대상 PR 발생 시 트리거됩니다.
    - 개별 기능 브랜치(`feature/*`)에서의 잦은 푸시는 CI를 발생시키지 않아 효율적인 작업이 가능합니다.

## 5. Test Execution Log
*   **2025-12-29**: Executed `api_test_script.py`. All Core API scenarios **PASSED**. Fixed DTO field name mismatch (`accessToken` -> `token`) and API method mismatch (`PATCH` -> `POST` for vendor approval).