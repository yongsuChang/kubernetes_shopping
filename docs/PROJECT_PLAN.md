# [프로젝트 계획서]

## 1. 프로젝트 주제
### 1.1. 주 주제
- **Nginx 기반의 로드밸런싱 및 Kubernetes 고가용성 아키텍처 구축**

### 1.2. 세부 주제
- **Nginx Ingress Controller를 활용한 3-Tier(Frontend-API-DB) 고가용성 쇼핑몰 시스템 설계 및 구현**

## 2. 요구사항 정의
### 2.1. 시스템 요구사항
- **On-Premise 스타일 인프라**: 별도의 VM(Bastion, Master, Worker, DB, NFS)을 활용한 네트워크 격리 및 클러스터 구성
- **Kubernetes 기반 컨테이너 오케스트레이션**: 애플리케이션의 자동 배포 및 스케일링 관리

### 2.2. 기능 요구사항
#### 2.2.1. 로드밸런싱 기능
- **Layer 7 로드밸런싱**: Nginx Ingress Controller를 통해 도메인별(`shop.mall.internal`, `api.mall.internal`) 트래픽 분산 처리
- **External IP 제공**: MetalLB를 활용하여 클러스터 외부에서 접근 가능한 가상 IP(VIP) 할당

#### 2.2.2. 헬스체크 기능
- **Kubernetes Probes**: 파드(Pod)의 상태를 실시간 모니터링하여 비정상 파드 발생 시 자동 재시작 및 트래픽 차단 (Deployment 내 구성)

### 2.3. 비기능 요구사항
#### 2.3.1. 모니터링 및 로깅
- **PLG Stack 구축 완료**: Prometheus(메트릭), Loki(로그), Grafana(시각화) 기반의 통합 모니터링 체계 가동.
- **리소스 최적화**: 4GB 메모리 환경에 맞춰 수집 주기 및 보관 정책 최적화 적용.

#### 2.3.2. 장애 복구 및 보안
- **실시간 알림**: 이메일(SMTP) 연동을 통한 노드 부하 및 포드 이상 상태 자동 통지.
- **IP Whitelisting**: Admin API에 대한 접근 제어 유지.
- **데이터 영속성**: NFS 서버를 활용한 로그 및 메트릭 데이터 영구 보존.

## 3. 프로젝트 목표
... (중략) ...

### 3.2. 고가용성 구현을 위한 세부 목표
#### 3.2.4. 헬스체크 및 통합 모니터링
- `Readiness` 및 `Liveness` 프로브와 연동된 Grafana 통합 대시보드 구축.

## 4. 시스템 아키텍처 설계서
... (중략) ...

### 4.2. 세부 서비스별 설계
#### 4.2.4. 모니터링 서버 (Grafana)
- 도메인: `grafana.mall.internal`, 포트: 3000
- 데이터 소스: Prometheus(Internal), Loki(Internal)

### 4.3. 네트워크 설계
#### 4.3.1. 서비스 구성
- 외부망 -> Bastion Nginx -> MetalLB VIP -> K8s Ingress -> Grafana/Frontend/API
- 내부망 포드 간 통신이 불가능한 경우 API Server Proxy를 통한 메트릭 수집 우회로 확보.


#### 4.3.2. 방화벽 설정
- Bastion 호스트를 통한 SSH 터널링 및 UFW 기반의 포트 제한

## 5. 기타 산출물
### 5.1. 구현 서비스별 구현 파일 목록
1. **[K8s-01]** `k8s/base/00-namespaces.yaml`: 네임스페이스 정의
2. **[K8s-02]** `k8s/base/01-metallb-config.yaml`: 네트워크 로드밸런서 설정
3. **[K8s-03]** `k8s/base/02-storage.yaml`: NFS 기반 PersistentVolume 설정
4. **[K8s-04]** `k8s/base/03-ingress.yaml`: L7 로드밸런싱 규칙
5. **[K8s-05]** `k8s/apps/01-shop-api.yaml`: 백엔드 API 배포 및 서비스
6. **[K8s-06]** `k8s/apps/02-frontend.yaml`: 프론트엔드 배포 및 서비스
7. **[K8s-07]** `k8s/mysql/02-external-mysql.yaml`: 외부 DB 연동(ExternalName) 설정
8. **[Script-01]** `scripts/deploy/deploy_k8s.sh`: 전체 시스템 배포 자동화 스크립트
9. **[Script-02]** `scripts/db/seed_full.sh`: 초기 데이터 시딩 스크립트

### 5.2. 서비스 구현 순서
1. **네임스페이스 및 기본 리소스 배포**: `kubectl apply -f k8s/base/00-namespaces.yaml`
2. **인프라 서비스 배포**: MetalLB, NFS Storage, Ingress 적용
3. **데이터베이스 연결 설정**: 외부 MySQL 서버를 K8s 서비스로 등록 (`02-external-mysql.yaml`)
4. **애플리케이션 배포**: Frontend 및 Shop-API Deployment 실행
5. **트래픽 라우팅**: Ingress를 통해 외부 도메인과 서비스 연결
6. **데이터 시딩**: `seed_full.sh`를 실행하여 관리자 계정 및 기초 상품 데이터 생성