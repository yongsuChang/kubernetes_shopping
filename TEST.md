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
    - [x] **상세 통합 테스트 시나리오 정의 완료**: [TEST_SCENARIOS.md](./TEST_SCENARIOS.md)

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
*   **2025-12-29**: 
    *   Executed `api_test_script.py`. All Core API scenarios **PASSED**.
    *   **Ongoing Issue**: 입점사 승인(`ACTIVE`) 후에도 대시보드 진입 시 간헐적으로 `Restricted` 화면이 표시되거나 로그인 페이지로 리다이렉트되는 현상 발생. 
    *   **Status**: 보안 필터(`VendorAccessFilter`) 경로 예외 확장 및 `ProtectedRoute` 딜레이 제거 등 1차 조치 완료. 추가 모니터링 필요.

## 6. Known Issues & Troubleshooting
### [Critical] Vendor Dashboard "Restricted" Access
- **현상**: `ROLE_SHOP_ADMIN` 계정으로 로그인 후 `/vendor` 진입 시 403 에러 또는 리다이렉트 발생.
- **원인 추정**: 
    1. Spring Security의 `ROLE_` 접두사 처리 불일치.
    2. 커스텀 필터(`VendorAccessFilter`)의 자동 등록(`@Component`)으로 인한 순서 꼬임.
    3. 프론트엔드 라우팅 보호 로직의 타이밍 이슈.
- **조치 사항**: 
    - `JwtAuthenticationFilter`에서 접두사 보장 로직 추가.
    - `VendorAccessFilter` 예외 경로 확대 (`/shop-admin/vendors/**`).
    - `GlobalExceptionHandler` 보강으로 정확한 에러 원인 추적 환경 구축.