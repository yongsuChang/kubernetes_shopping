# 프로젝트 진행 현황 (Project Progress Tracking)

> **⚠️ Urgent**: 현재 입점사 권한 시스템에 간헐적 이슈가 발생하고 있습니다. [TEST.md](./TEST.md)의 **Known Issues**를 최우선으로 처리한 뒤 로드맵을 진행하세요.
> **Note**: 프로젝트 아키텍처, 데이터 모델, 구현 상세에 대한 심층 분석 내용은 [04_architecture_and_analysis.md](./04_architecture_and_analysis.md) 파일을 참고하세요.
> **Test**: 상세 통합 테스트 시나리오는 [TEST_SCENARIOS.md](./TEST_SCENARIOS.md)를, 전반적인 테스트 전략은 [TEST.md](./TEST.md)를 참고하세요.

## 🌿 개발 프로세스 및 브랜치 전략
- **main**: 프로덕션 배포용 최상위 브랜치.
- **develop**: 개발 통합 브랜치. 모든 기능 구현은 이곳을 향합니다.
- **feature/*, fix/***: 각 기능 구현 및 버그 수정을 위한 개별 작업 브랜치.
- **Workflow**: `feature/*` 브랜치에서 작업 -> `develop` 브랜치로 PR 및 병합 -> 안정화 후 `main`으로 최종 병합.

## 🏗️ 백엔드 (Java Spring Boot)

### ✅ 완료된 작업
- [x] **멀티 모듈 프로젝트 설정 (Gradle Kotlin DSL)**
    - `common`: 공통 엔티티, 보안 유틸리티, 열거형(Enums)
    - `admin-api`: 전체 관리자 API (Port 8081)
    - `shop-api`: 입점 업체 및 고객 API (Port 8082)
- [x] **빌드 시스템 최적화**
    - 모듈별 의존성 분리 및 리팩토링
    - Gradle Wrapper 적용
- [x] **데이터베이스 구성**
    - MySQL 8 연동
    - JPA/Hibernate 기반 Soft Delete(논리 삭제) 구현
- [x] **보안 및 인증 (Spring Security 3.x)**
    - JWT (jjwt 0.12.3) 기반 인증 구현
    - 역할 기반 접근 제어 (SUPER_ADMIN, SHOP_ADMIN, USER)
    - CORS 필터 설정 (Vite 개발 환경 대응)
    - **Health Check API 보안 강화**: 전체 관리자 전용으로 제한
    - **AdminAccessFilter 구현**: 전체 관리자 2차 검증 및 IP 화이트리스트 기반 마련
- [x] **핵심 도메인 및 비즈니스 로직**
    - 회원가입/로그인 (shop-api)
    - 업체 등록 및 승인 프로세스 (shop/admin-api 연동)
    - 상품 CRUD 및 주문 관리 기초 로직
- [x] **API 문서화 및 공통 기능**
    - Swagger (SpringDoc OpenAPI) 통합
    - 전역 예외 처리기(Global Exception Handler) 구현
- [x] **통합 테스트 시나리오 정의**
    - ROLE 기반 엔드투엔드 시나리오 구축 ([TEST_SCENARIOS.md](./TEST_SCENARIOS.md))

---

## 🎨 프론트엔드 (React + TypeScript)

### ✅ 완료된 작업
- [x] **프로젝트 초기화 (Vite)**
- [x] **UI 컴포넌트 라이브러리 구축** (25개 이상의 공통 컴포넌트)
- [x] **상태 관리 및 API 연동**
    - Zustand 기반 인증 상태 관리
    - Axios 인터셉터를 활용한 토큰 처리
- [x] **역할 기반 동적 UI/UX**
    - 비로그인 유저: 상품 둘러보기 허용
    - 로그인 유저(USER): '마이페이지' 버튼 활성화
    - 입점 업체(SHOP_ADMIN): '업체 관리' 버튼 활성화
    - 전체 관리자(SUPER_ADMIN): '관리자 대시보드' 버튼 활성화
- [x] **보안 라우팅 (Protected Routes)**
    - 페이지 진입 전 토큰 및 권한 선검증 로직 적용
    - 검증 시 로딩 스피너 적용으로 UX 개선
- [x] **주요 페이지 구현**
    - 로그인/회원가입
    - 상품 목록 조회
    - 전체 관리자: 업체 승인 관리 페이지

---

## 🚀 향후 로드맵 및 미완료 작업

### 🎨 UI/UX 개선 및 레이아웃 (우선 과제)

- [x] **웹 전용 레이아웃 최적화**: 넓은 화면(Web)에서 전체 폭을 활용하도록 개선 완료

- [x] **메인 페이지 고도화**:

    - 모든 권한 접근 가능 및 최신 등록 상품 그리드 뷰 구현

    - 카테고리 필터 및 검색 기능 구현 완료



### 👤 고객 기능 (ROLE_USER)

- [x] **주문 현황 상세 조회**: 주문 상태 변경 이력(History)을 타임라인 형태로 확인 가능 (OrderStatusHistory 구현 완료)

- [x] **마이페이지**: 프로필 조회 및 주문 내역 확인 기능 구현

- [x] **장바구니**: 상품 담기, 수량 조절 및 삭제 기능 구현 (Zustand 기반)

- [x] **주문/결제**: 배송지 등록/선택 및 최종 주문 생성 프로세스 완성

- [x] **리뷰 시스템**: 상품 리뷰 작성 및 관리 기능 구현 완료



### 🏪 입점 업체 기능 (ROLE_SHOP_ADMIN)

- [x] **업체 권한 제한**: 최초 가입 시 기능 사용 불가 -> 전체 관리자 승인 후 대시보드 및 상품 관리 활성화 (VendorAccessFilter 구현 완료)

- [x] **업체 대시보드**: 판매 통계 및 요약 정보 시각화 구현 완료

- [x] **상품 관리 고도화**: 프론트엔드 상품 등록/수정/삭제 UI 및 백엔드 CRUD API 완성

- [x] **주문 이행 관리**: 들어온 주문 확인 및 배송 상태 업데이트 기능 구현 완료



### 👑 전체 관리자 기능 (ROLE_SUPER_ADMIN)

- [x] **입점 업체 승인 관리**: 가입된 업체 목록 조회 및 서비스 이용 허가(승인) 기능 구현 완료

- [x] **업체 상세 제어**: 업체 정지(Suspend) 및 활성화(Activate) 기능 구현 완료

- [x] **사용자 관리**: 전체 회원 목록 조회 및 상태(정지 등) 관리 기능 구현 완료

- [x] **시스템 리포트**: 플랫폼 전체 매출 및 가입 통계 대시보드 완료

- [x] **상품 관리 (Platform Product Management)**: 전체 등록 상품 조회 및 숨김 처리(Toggle Status) 기능 구현 완료



### 🛠️ 데이터베이스 및 백엔드

- [x] **주문 상태 이력(Order History) 테이블 추가**: 상태 변경 시점과 내용을 기록하는 히스토리 관리 로직 구현 완료

- [x] **검색 및 필터**: 상품 이름 검색 및 카테고리별 필터링 API 구현 완료



### 🛠️ 인프라 및 보안 (Infrastructure)

- [x] **Dockerization**: 모든 API 모듈의 멀티 스테이지 빌드 Dockerfile 작성

- [x] **Kubernetes 설정**: MySQL, API 서버 배포용 Manifest 작성 완료

- [x] **IP 화이트리스트 강제화**: `AdminAccessFilter` 내 실제 차단 로직 활성화 완료



- [x] **CI/CD 파이프라인**: GitHub Actions를 이용한 자동 빌드/배포 구축 완료 (CI 기본 설정)



---



## 📝 별도 TODO (추후 검토)

- [ ] **모니터링 시스템 구축**: 로깅(ELK) 및 메트릭 수집(Prometheus, Grafana) 시스템 통합



---

*최종 업데이트: 2025-12-23*
