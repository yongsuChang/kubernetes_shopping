# 프로젝트 아키텍처 및 분석 로그 (Architecture & Analysis Log)

*작성일: 2025-12-23*

이 문서는 프로젝트 개발 과정에서 분석된 시스템 아키텍처, 데이터 모델, 그리고 주요 기능 구현에 대한 기술적 상세 내용을 기록합니다.

---

## 1. 시스템 아키텍처 (System Architecture)

### 1.1 백엔드 (Spring Boot Multi-module)
프로젝트는 Gradle Kotlin DSL을 사용한 멀티 모듈 구조로 구성되어 있습니다.

- **common**: 모든 모듈에서 공유하는 핵심 도메인, 유틸리티, 설정을 포함합니다.
    - `entity`: JPA 엔티티 (`Member`, `Order`, `Vendor`, `Product` 등)
    - `repository`: 데이터 접근 계층
    - `enums`: `Role`, `OrderStatus`, `VendorStatus` 등 열거형
    - `security`: JWT 유틸리티 및 공통 보안 설정
    - `dto`: 통계용 `StatisticsProjection` 인터페이스 등 공통 DTO

- **admin-api (Port 8081)**: 전체 관리자(SUPER_ADMIN)를 위한 API 서버입니다.
    - `AdminMemberController`: 회원 관리
    - `AdminVendorController`: 입점 업체 승인 및 관리
    - `AdminReportController`: 시스템 통계 및 리포트 (매출, 가입자 수 등)
    - **Security**: `/api/v1/admin/**` 경로는 `SUPER_ADMIN` 권한 필수. `AdminAccessFilter`를 통한 추가 보안 계층 존재.

- **shop-api (Port 8082)**: 일반 사용자(USER) 및 입점 업체(SHOP_ADMIN)를 위한 API 서버입니다.
    - 회원가입/로그인, 상품 조회/주문, 업체별 상품/주문 관리 기능 제공.

### 1.2 프론트엔드 (React + TypeScript + Vite)
- **상태 관리**: `Zustand`를 사용하여 인증(`useAuthStore`) 및 장바구니(`useCartStore`) 상태 관리.
- **라우팅**: `react-router-dom`과 `ProtectedRoute` 컴포넌트를 사용하여 역할별(Role-based) 접근 제어 구현.
- **UI 컴포넌트**: `src/components/common` 내에 직접 구현된 재사용 가능한 컴포넌트(`Button`, `Alert`, `Grid`, `Card` 등) 사용.
- **데이터 시각화**: `recharts` 라이브러리를 사용하여 대시보드 차트 구현.

---

## 2. 데이터 모델 (Data Model)

주요 엔티티 관계 및 구조는 다음과 같습니다. 모든 엔티티는 `BaseTimeEntity`를 상속받아 `createdAt`, `updatedAt`을 자동 관리합니다.

- **Member**: 사용자 계정 정보.
    - `email`, `password`, `name`
    - `role`: `ROLE_USER`, `ROLE_SHOP_ADMIN`, `ROLE_SUPER_ADMIN`
- **Vendor**: 입점 업체 정보.
    - `name`, `description`
    - `owner`: `Member`와 1:1 관계
    - `status`: `PENDING`, `ACTIVE`, `SUSPENDED` 등 (관리자 승인 프로세스용)
- **Product**: 판매 상품.
    - `vendor`: `Vendor`와 N:1 관계
- **Order**: 주문 정보.
    - `member`: 주문자 (N:1)
    - `vendor`: 판매처 (N:1) - *주문은 벤더별로 분리되어 생성됨을 시사*
    - `totalAmount`, `status` (`PENDING`, `SHIPPED` 등)
    - `isDeleted`: Soft Delete 지원

---

## 3. 주요 기능 구현 분석

### 3.1 시스템 리포트 (System Report)
전체 관리자 대시보드에서 플랫폼 현황을 파악하기 위한 기능입니다.

*   **백엔드 전략**:
    *   대용량 데이터 조회를 고려하여 애플리케이션 레벨의 연산 대신 DB 레벨의 집계(`GROUP BY`)를 사용.
    *   `DATE(created_at)` 함수를 이용한 Native Query로 일별 통계 추출.
    *   **Repository 확장**:
        *   `OrderRepository.findDailySales()`: 일별 매출 및 건수
        *   `MemberRepository.findDailyRegistrations()`: 일별 가입자 수
        *   `VendorRepository.findDailyRegistrations()`: 일별 업체 등록 수

*   **프론트엔드 전략**:
    *   `recharts`의 `BarChart` (매출)와 `LineChart` (가입자 추이) 사용.
    *   `AdminDashboard` -> `SystemReport` 페이지로의 직관적인 네비게이션 흐름.

### 3.2 보안 및 타입 안정성 (Security & Type Safety)
*   **API 클라이언트**: `axios` 인터셉터를 통해 JWT 토큰 자동 주입 및 401 에러(토큰 만료) 시 자동 로그아웃 처리.
*   **컴포넌트**: `Button`의 `variant` 속성 확장 및 `Alert` 컴포넌트 유연성 확보를 통해 타입스크립트 에러 최소화 및 개발 생산성 향상.

---

## 4. 향후 고려 사항
*   **CI/CD**: 현재 로컬 빌드만 수행 중. GitHub Actions 도입 필요.
*   **모니터링**: 애플리케이션 로그 및 메트릭 수집 시스템(Prometheus/Grafana) 연동 필요.
*   **쿼리 최적화**: 데이터 양 증가 시 통계 쿼리의 성능 저하 가능성 있음. 추후 배치 작업(Batch)으로 통계 테이블 별도 분리 고려.
