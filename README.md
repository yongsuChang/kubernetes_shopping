# Kubernetes Shopping Project

이 프로젝트는 Spring Boot 기반의 백엔드와 React 기반의 프론트엔드로 구성된 마이크로서비스 아키텍처 쇼핑몰 애플리케이션입니다.

온프레미스 Kubernetes 클러스터 운영을 목표로 하며, 개발 편의를 위해 Docker Compose 환경도 제공합니다.

---

## 📖 프로젝트 문서 (Documentation)

- **[🏗️ 통합 설치 가이드 (Zero-to-Hero)](./docs/guides/FULL_INSTALLATION.md)**: OS 설치부터 클러스터 구축까지의 전 과정
- **[🚑 장애 복구 가이드 (Disaster Recovery)](./docs/guides/DISASTER_RECOVERY.md)**: 마스터 노드 장애 및 데이터 손상 시 복구 절차
- **[☸️ 인프라 아키텍처 상세](./k8s/README.md)**: Kubernetes 클러스터 및 네트워크 구성 상세 설명
- **[📝 프로젝트 진행 현황](./PROGRESS.md)**: 주요 기능 구현 및 TODO 리스트

---

## 🏗️ 인프라 아키텍처 (Infrastructure Overview)

본 프로젝트는 실무 환경과 유사한 **Hybrid On-premise** 구조로 설계되었습니다.
- **K8s Cluster**: 1-Master, 3-Worker 노드로 구성된 고가용성 환경
- **Networking**: MetalLB(L4) 및 NGINX Ingress(L7)를 통한 정교한 트래픽 제어
- **Monitoring**: **PLG Stack** (Prometheus, Loki, Grafana) 기반의 통합 모니터링 (4GB RAM 최적화)
- **Database**: Standalone MySQL Master와 K8s 내부 Slave 간의 실시간 복제망
- **Storage**: NFS Server를 활용한 데이터 영속성 및 공유 저장소 확보

---

## 📂 프로젝트 구조 (Project Structure)



```text

kubernetes_shopping/

├── config/             # 로컬 및 서버 공통 설정 템플릿 (.vimrc, ssh_config 등)

├── dns/                # 내부 도메인 관리를 위한 BIND9 설정 (db.mall.internal 등)

├── docs/               # 프로젝트 문서 (기획, 가이드, 아키텍처)

├── k8s/                # Kubernetes 배포 매니페스트 (상세 설계: [k8s/README.md](./k8s/README.md))

├── logs/               # 애플리케이션 및 시스템 로그 보관

├── responsive-react-app/ # Frontend (React + TypeScript + Vite)

├── scripts/            # 운영 및 관리를 위한 자동화 스크립트 (deploy, cleanup, db)

├── shopping-backend/     # Backend (Spring Boot Multi-module: admin, shop, common)

├── uploads/            # 상품 이미지 등 영구 저장 파일 (NFS 연동)

├── docker-compose.yaml   # 로컬 개발용 통합 실행 환경

└── api_test_script.py    # API 기능 테스트 스크립트

```





## 📜 자동화 스크립트 (Utility Scripts)



프로젝트 관리를 위한 스크립트들이 `scripts/` 디렉토리에 정리되어 있습니다.



- **배포 (Deployment)**

    - `./scripts/deploy/deploy_k8s.sh`: Kubernetes 전체 리소스 배포

- **삭제 및 초기화 (Cleanup)**

    - `./scripts/cleanup/cleanup_k8s.sh`: Kubernetes 리소스 전체 삭제

    - `./scripts/cleanup/cleanup_docker.sh`: 로컬 Docker Compose 환경 정리

- **데이터베이스 (DB)**

    - `./scripts/db/seed_full.sh`: 초기 데이터 시딩

    - `./scripts/db/fix_seed.sh`: 시드 데이터 보정





## 🚀 빠른 시작 (Local Development)

로컬 개발 및 테스트를 위한 두 가지 실행 환경을 제공합니다.

### 1. 로컬 개발 환경 (작업 중인 코드 즉시 반영)
현재 PC의 소스 코드를 빌드하여 컨테이너를 실행합니다.
```bash
# 1. 백엔드 빌드 (JAR 생성)
cd shopping-backend && ./gradlew clean bootJar && cd ..

# 2. 로컬 빌드 및 실행
docker compose up -d --build
```

### 2. 통합 테스트 환경 (Docker Hub의 :test 이미지 사용)
`develop` 브랜치에서 CI를 통과하여 Docker Hub에 배포된 최신 `:test` 태그 이미지를 사용하여 실행합니다. (로컬 소스 무시)
```bash
# 최신 테스트 이미지로 실행
docker compose -f docker-compose.test.yaml up -d
```

---

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
