# Kubernetes Shopping Project

이 프로젝트는 Spring Boot 기반의 백엔드와 React 기반의 프론트엔드로 구성된 마이크로서비스 아키텍처 쇼핑몰 애플리케이션입니다.

온프레미스 Kubernetes 클러스터 운영을 목표로 하며, 개발 편의를 위해 Docker Compose 환경도 제공합니다.

## 📂 프로젝트 구조 (Project Structure)

```
kubernetes_shopping/
├── config/             # 로컬 및 서버 공통 설정 템플릿 (.vimrc, netplan, hosts 등)
├── docs/               # 프로젝트 문서 (기획, 가이드, 아키텍처)
│   ├── guides/         # 설치 및 테스트 가이드 (FULL_INSTALLATION.md 등)
│   └── ideation/       # 초기 기획 및 분석 문서
├── k8s/                # Kubernetes 배포 매니페스트 (Apps, Base, MySQL 등)
├── responsive-react-app/ # Frontend (React + TypeScript + Vite)
├── shopping-backend/     # Backend (Spring Boot Multi-module)
└── docker-compose.yaml   # 로컬 개발용 통합 실행 환경
```

## 🚀 빠른 시작 (Local Development)

Docker Compose를 사용하여 로컬에서 즉시 서비스를 실행해 볼 수 있습니다.

### 전체 시스템 실행
```bash
# 1. 백엔드 빌드
cd shopping-backend && ./gradlew clean bootJar && cd ..

# 2. Docker 이미지 빌드 및 실행
docker compose up -d --build
```
*   **Frontend**: http://localhost:5173
*   **Shop API**: http://localhost:8082/swagger-ui/index.html
*   **Admin API**: http://localhost:8081/swagger-ui/index.html

## 🧪 테스트 가이드 (Testing)

### 1. 통합 테스트 시나리오
주요 비즈니스 로직 검증을 위한 자동화 스크립트를 제공합니다.
- **Python Script**: `api_test_script.py`
    ```bash
    # 가상환경 설정 후 실행 권장
    python3 api_test_script.py
    ```
- **상세 시나리오 문서**: [TEST_SCENARIOS.md](./docs/guides/TEST_SCENARIOS.md)

### 2. 이슈 트래킹
현재 알려진 이슈 및 테스트 현황은 [TEST.md](./docs/guides/TEST.md)에서 확인할 수 있습니다.

## 🏗️ 운영 환경 구축 (Production Setup)

VMware 기반의 온프레미스 환경에서 **서버 OS 설정부터 Kubernetes 클러스터 구축까지**의 전체 과정은 아래 가이드를 참고하세요.

👉 **[Zero-to-Hero: 통합 설치 가이드 (FULL_INSTALLATION.md)](./docs/guides/FULL_INSTALLATION.md)**

이 가이드는 다음 내용을 포함합니다:
- **Phase 1**: Control Node (내 PC) 설정 (SSH Key, Config)
- **Phase 2**: 모든 서버 공통 설정 (Netplan, Hostname, Hosts, Swap)
- **Phase 3**: 인프라 서비스 구축 (DNS, NFS, DB)
- **Phase 4**: Kubernetes 클러스터 초기화 및 노드 조인
- **Phase 5**: 애플리케이션 배포
