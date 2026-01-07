# ☸️ Kubernetes Infrastructure Architecture

> **⚠️ 중요 (Sync Note)**: 이 문서는 시스템 아키텍처 및 설계를 설명합니다. 실제 구축 절차나 스크립트 내용이 변경될 경우, 반드시 [FULL_INSTALLATION.md](../docs/guides/FULL_INSTALLATION.md) 가이드도 함께 업데이트해야 합니다.

이 디렉토리는 쇼핑몰 시스템의 Kubernetes 매니페스트와 인프라 설계 구조를 담고 있습니다. 본 프로젝트는 **Hybrid On-premise** 구조로, 클러스터 내부 서비스와 외부 전용 서버가 유기적으로 연결되어 있습니다.

---

## 🏗️ 시스템 아키텍처 (System Architecture)

```text
                                     [ External / Public ]
                                               |
                                        (Port: 80, 443)
                                               v
+------------------------------------------------------------------------------------------+
|                                     Bastion Host (172.100.100.3)                         |
|                                  (BIND9 DNS, Nginx Reverse Proxy)                        |
+------------------------------------------------------------------------------------------+
        |                                      |                                     |
        v                                      v                                     v
+-----------------------+              +-----------------------+             +-----------------------+
|  K8s Master (100.4)   |              |  NFS Storage (100.9)  |             |  MySQL Master (100.8) |
|                       |              |                       |             |                       |
|  - Control Plane      | <----------  |  - Product Images     |  <--------  |  - shopping_db        |
|  - MetalLB Controller |  (NFS Mount) |  - MySQL Slave Data   | (Replication)|  - Admin API (Option) |
+-----------------------+              +-----------------------+             +-----------------------+
        |
        +-------------------------------------------------------------+
        |                             |                               |
        v                             v                               v
+-----------------------+     +-----------------------+       +-----------------------+
|  Worker Node 1 (100.5)|     |  Worker Node 2 (100.6)|       |  Worker Node 3 (100.7)|
|                       |     |                       |       |                       |
|  - Ingress Controller |     |  - shop-api Pods      |       |  - frontend Pods      |
|  - MetalLB Speaker    |     |  - mysql-slave Pod    |       |  - metallb-speaker    |
+-----------------------+     +-----------------------+       +-----------------------+
```

---

## 🌐 네트워크 구성 (Networking)

### 1. 전용 도메인 (Internal DNS)
Bastion 서버의 BIND9을 통해 프로젝트 내부 도메인을 관리합니다.
- `shop.mall.internal`: 프론트엔드 서비스
- `api.mall.internal`: 쇼핑몰 백엔드 API
- `admin.mall.internal`: 전체 관리자 API

### 2. 부하 분산 (LoadBalancer)
- **MetalLB**: 가상 IP 대역(`172.100.100.10 - 100.20`)을 사용하여 온프레미스 환경에서 `LoadBalancer` 타입의 서비스를 제공합니다.
- **NGINX Ingress Controller**: `LoadBalancer`로부터 트래픽을 받아 도메인 기반(L7)으로 각 Namespace의 서비스로 라우팅합니다.

---

## 💾 데이터 및 저장소 (Storage & DB)

### 1. 영구 저장소 (Persistence)
- **NFS Server**: `/mnt/DATA` 경로를 외부에 공유합니다.
- **PV/PVC**: `nfs-client` 프로비저너를 사용하거나 정적 PV를 통해 `/app/uploads/images` 및 MySQL 데이터를 영구 보관합니다.

### 2. 데이터베이스 복제 (Replication)
- **Master (External)**: 모든 쓰기(Write) 작업이 발생하는 원천 DB입니다.
- **Slave (K8s Inside)**: Master로부터 실시간 복제되며, 조회(Read) 부하 분산 및 백업 역할을 수행합니다.

---

## 📂 디렉토리 구조

- `/base`: 클러스터 공통 설정 (Namespace, Ingress, StorageClass 등)
- `/apps`: 애플리케이션 워크로드 (Frontend, Shop-API, Admin-API)
- `/mysql`: MySQL Slave 배포 및 설정 (ConfigMap, Deployment)
- `/templates`: 설정 및 비밀번호 템플릿

---

## 🛡️ 보안 정책 (Security Hardening)

### 1. 호스트 방화벽 (UFW)
각 노드는 최소 권한 원칙에 따라 필요한 포트만 개방합니다.
- **Storage/DB**: K8s 워커 노드 IP에 대해서만 NFS(2049) 및 MySQL(3306) 포트 허용
- **Bastion**: 외부 포트(80, 443) 개방 및 내부망 SSH 터널링 허용

### 2. 네트워크 제한
- **NFS Exports**: `/etc/exports` 설정을 통해 지정된 Worker Node IP가 아니면 마운트가 불가능하도록 제한
- **Ingress Whitelist**: `admin.mall.internal`과 같은 민감한 경로는 특정 대역(172.100.100.0/24)에서만 접근 가능하도록 설정

---

## 🛠️ 유지관리 및 백업 (Maintenance & Backup)

### 1. 자동화된 DB 백업
Master DB(`172.100.100.8`)에서 매일 새벽 자동으로 백업을 수행합니다.
- **주기**: 매일 02:00 (Cron 작업)
- **대상**: `shopping_db` 전체 스키마 및 데이터
- **보관**: 최신 7일간의 백업을 `.tar.gz` 형태로 보관

### 2. 복제 모니터링
Slave DB(K8s 내부)는 Master의 바이너리 로그를 실시간 추적합니다. 파드 재시작 시에도 PVC를 통해 복제 포지션이 유지됩니다.

---

## 🚀 시작하기
상세한 설치 및 구축 과정은 [FULL_INSTALLATION.md](../docs/guides/FULL_INSTALLATION.md) 가이드를 참고하세요.
