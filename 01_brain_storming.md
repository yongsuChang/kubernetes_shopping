# 1. 개요 (Overview)
- **프로젝트명**: Kubernetes 기반 쇼핑몰 플랫폼
- **목표**: 입점형 쇼핑몰 플랫폼을 구축하여, 관리자, 입점 업체, 고객이 각자의 역할을 수행할 수 있는 환경을 제공합니다.

# 2. 사용자 시나리오 및 역할 (User Scenarios & Roles)
- **전체 관리자**: 시스템의 모든 기능을 관리합니다. (회원, 업체, 상품, 주문 등)
- **입점 업체 관리자**: 자신의 업체 정보, 상품, 주문을 관리합니다.
- **고객**: 상품을 검색하고, 주문하며, 리뷰를 작성하는 등 쇼핑 활동을 합니다.

# 3. 애플리케이션 설계 (Application Design)
### 3.1. 기능 명세 (Features)
- **관리자**: 전체 시스템 관리 (회원, 업체, 상품, 주문)
- **입점 업체 관리자**: 업체 정보, 상품, 주문 관리
- **고객**: 상품 조회, 검색, 주문, 리뷰 작성

### 3.2. 페이지 명세 (Pages)
- **관리자 페이지**
    - 회원 관리
    - 업체 관리
    - 상품 관리
    - 주문 관리
    - (Optional) 통계, 모니터링
- **입점 업체 관리자 페이지**
    - 업체 정보 관리
    - 상품 관리
    - 주문 관리
- **고객 페이지**
    - 상품 조회/검색
    - 상품 주문
    - 마이 페이지
    - 리뷰 작성
    - (Optional) 장바구니

# 4. 시스템 아키텍처 (System Architecture)
### 4.1. 기술 스택 (Tech Stack)
- **인프라**: Kubernetes Cluster, Docker, NFS, Bind9
- **데이터베이스**: MySQL
- **백엔드**: Python - FastAPI
- **프론트엔드**: React.js (TypeScript)
- **인증**: JWT

### 4.2. 백엔드 아키텍처 (Backend Architecture)
- **서비스 분리**: 초기에는 관리 복잡성 및 리소스 효율성을 고려하여 단일 통합 서비스(Monolithic)로 개발합니다.
    - Admin Service, Vendor Admin Service, Customer Service를 하나의 FastAPI 프로젝트 내에서 구현합니다.
- **인증 서버**: 인증 또한 백엔드 서비스 내에 통합하여 구현합니다.

### 4.3. 인증 (Authentication)
- **JWT Claims**
    - `sub`: 사용자 고유 식별자 (Member.UUID)
    - `name`: 사용자 이름 (Member.name)
    - `role`: 사용자 역할 (Member.role)
    - `iat`: 토큰 발급 시간
    - `exp`: 토큰 만료 시간

### 4.4. 인프라 (Infrastructure)
- **Kubernetes Resources**
    - **Nginx (2 replica)**: Ingress Controller 역할
        - Namespace, PV/PVC, Deployment, Service
    - **FastAPI Service (2 replica)**
        - Namespace, ConfigMap, Secret, PV/PVC, Deployment, Service
    - **MySQL (1 master + 1 slave)**
        - Namespace, ConfigMap, Secret, PV/PVC, Deployment, Service

# 5. 데이터 모델 (Data Model)
- **Tables**
    - 회원(Member), 업체(Vendor), 상품(Product), 배송지(Address), 주문(Order), 리뷰(Review)

### 5.1. Member
- `id` (bigint, PK)
- `name` (varchar)
- `password` (varchar, hashed)
- `UUID` (varchar, UNIQUE)
- `role` (enum: ADMIN, VENDOR_ADMIN, CUSTOMER)
- `email` (varchar, UNIQUE)
- `phone` (varchar)
- `date_of_birth` (date)
- `gender`
- `status` (enum: ACTIVE, INACTIVE, SUSPENDED)
- `profile_picture_url` (varchar)
- `created_at` (timestamp)
- `updated_at` (timestamp)
- `is_deleted` (tinyint)

### 5.2. Vendor
- `id` (bigint, PK)
- `name` (varchar)
- `description` (text)
- `owner_member_id` (bigint, FK -> Member.id)
- `status` (enum: ACTIVE, INACTIVE, PENDING, SUSPENDED)
- `contact_email` (varchar)
- `contact_phone` (varchar)
- `address` (text)
- `logo_url` (varchar)
- `website_url` (varchar)
- `social_media_links` (text)
- `created_at` (timestamp)
- `updated_at` (timestamp)
- `is_deleted` (tinyint)

### 5.3. Product
- `id` (bigint, PK)
- `vendor_id` (bigint, FK -> Vendor.id)
- `name` (varchar)
- `description` (text)
- `price` (decimal)
- `stock_quantity` (int)
- `status` (enum: AVAILABLE, OUT_OF_STOCK, DISCONTINUED)
- `category` (varchar)
- `created_at` (timestamp)
- `updated_at` (timestamp)
- `is_deleted` (tinyint)

### 5.4. Address
- `id` (bigint, PK)
- `member_id` (bigint, FK -> Member.id)
- `street` (varchar)
- `city` (varchar)
- `state` (varchar)
- `zip_code` (varchar)
- `country` (varchar)
- `created_at` (timestamp)
- `updated_at` (timestamp)
- `is_deleted` (tinyint)

### 5.5. Order
- `id` (bigint, PK)
- `member_id` (bigint, FK -> Member.id)
- `vendor_id` (bigint, FK -> Vendor.id)
- `product_id` (bigint, FK -> Product.id)
- `address_id` (bigint, FK -> Address.id)
- `quantity` (int)
- `price_per_unit` (decimal)
- `total_amount` (decimal)
- `status` (enum: PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED)
- `created_at` (timestamp)
- `updated_at` (timestamp)
- `is_deleted` (tinyint)

### 5.6. Review
- `id` (bigint, PK)
- `member_id` (bigint, FK -> Member.id)
- `product_id` (bigint, FK -> Product.id)
- `order_id` (bigint, FK -> Order.id)
- `rating` (int)
- `comment` (text)
- `created_at` (timestamp)
- `updated_at` (timestamp)
- `is_deleted` (tinyint)

# 6. 미결정 사항 (Open Questions)
- **백엔드 서비스 분리 시점**: 프로젝트가 성장하고 기능이 복잡해지면 마이크로서비스로 전환을 고려할 수 있습니다.
- **인증 서버 분리 시점**: 사용자 및 인증 요구사항이 복잡해지면 별도의 인증 서버(예: Keycloak) 도입을 검토합니다.

# 7. 참고 자료 (Resources)
- [Kubernetes 아이콘](https://github.com/kubernetes/community/tree/master/icons)
