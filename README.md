# Kubernetes Shopping Project

이 프로젝트는 Spring Boot 기반의 백엔드와 React 기반의 프론트엔드로 구성된 쇼핑몰 애플리케이션입니다.

## 🚀 빠른 시작 (Docker Compose)

모든 서비스를 한 번에 빌드하고 실행하려면 아래 명령어를 사용하세요.

### 전체 빌드 및 배포
```bash
cd shopping-backend && ./gradlew clean bootJar && cd .. && \
docker build -t yongsuchang/shopping-admin-api:test ./shopping-backend/admin-api && \
docker build -t yongsuchang/shopping-shop-api:test ./shopping-backend/shop-api && \
docker build -t yongsuchang/shopping-frontend:test ./responsive-react-app && \
docker compose up -d
```

## 🛠️ 부분 빌드 및 배포

### 백엔드만 빌드/배포
```bash
cd shopping-backend && ./gradlew :shop-api:bootJar :admin-api:bootJar && cd .. && \
docker build -t yongsuchang/shopping-admin-api:test ./shopping-backend/admin-api && \
docker build -t yongsuchang/shopping-shop-api:test ./shopping-backend/shop-api && \
docker compose up -d admin-api shop-api
```

### 프론트엔드만 빌드/배포
```bash
docker build -t yongsuchang/shopping-frontend:test ./responsive-react-app && \
docker compose up -d frontend
```

## 📂 프로젝트 구조
- `shopping-backend/`: Spring Boot 기반 멀티 모듈 백엔드
- `responsive-react-app/`: React + TypeScript + Vite 프론트엔드
- `k8s/`: Kubernetes 배포 매니페스트 (진행 중)
- `docker-compose.yaml`: 로컬 개발 및 테스트를 위한 환경 설정

## 🧪 테스트 시나리오
상세한 통합 테스트 시나리오는 [TEST_SCENARIOS.md](./TEST_SCENARIOS.md)를 참고하세요.
현재 진행 중인 이슈 및 해결 현황은 [TEST.md](./TEST.md)에서 확인 가능합니다.