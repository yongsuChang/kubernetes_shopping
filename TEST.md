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
    - [x] Common Components (`Button`, `Input`, `Card`)
    - [x] Authentication Forms (Login/Signup validation)
- **Integration Testing**:
    - [x] Protected Route logic (Redirection for unauthenticated users)
    - [x] State Management (Zustand store updates)

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
    *   **Fixed Critical Issues**: 
        *   Resolved **Hibernate Proxy Serialization Error (400 Bad Request)** by implementing DTOs.
        *   Resolved **Vendor Dashboard "Restricted" Access** by optimizing security filters and role prefix handling.
        *   Resolved **Swagger UI Resource Loading (403 Forbidden)** by implementing cookie-based authentication and URL token hiding via redirect.

## 6. Known Issues & Troubleshooting
### [Resolved] Vendor Dashboard "Restricted" Access
- **원인**: `VendorAccessFilter`의 경로 예외 처리 미흡 및 Spring Security의 `ROLE_` 접두사 중복 문제.
- **조치**: 필터 예외 경로 확대, `JwtAuthenticationFilter` 내 접두사 보장 로직 추가, 쿠키 기반 인증 지원.

### [Resolved] Hibernate Proxy Serialization Error (400 Bad Request)
- **원인**: 엔티티 직접 반환 시 지연 로딩(Lazy Loading) 객체의 직렬화 실패.
- **조치**: 모든 컨트롤러에 DTO(`ProductResponse`, `OrderResponse` 등) 적용 완료.

### [Resolved] Swagger UI Resource Loading (403 Forbidden)
- **원인**: 정적 자원(JS/CSS) 요청 시 인증 헤더 누락.
- **조치**: URL 파라미터 기반 인증 후 쿠키 발급 및 자동 리다이렉트 로직 구현.
