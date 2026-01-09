# [프로젝트 계획서]

## 1. 프로젝트 주제
### 1.1. 주 주제
- **Nginx 기반의 로드밸런싱 아키텍처 구축**

### 1.2. 세부 주제
- **Nginx Ingress Controller와 MetalLB를 활용한 온프레미스 Kubernetes 고가용성 쇼핑몰 시스템 설계 및 구현**

## 2. 요구사항 정의
### 2.1. 시스템 요구사항
- **인프라 환경**: VMware 기반의 온프레미스 네트워크 (172.100.100.0/24)
- **클러스터 구성**: 1 Master, 3 Worker Nodes의 고가용성 Kubernetes 클러스터
- **서버 격리**: Bastion(Gateway), DB Master, NFS Server를 별도 VM으로 분리하여 안정성 확보

### 2.2. 기능 요구사항
#### 2.2.1. 로드밸런싱 기능
- **L4 로드밸런싱**: MetalLB(Layer 2 모드)를 통해 온프레미스 환경에서 `LoadBalancer` 서비스 제공 및 VIP 관리
- **L7 로드밸런싱**: Nginx Ingress Controller를 통해 도메인(`shop.`, `api.`, `admin.`) 기반 트래픽 라우팅

#### 2.2.2. 헬스체크 기능
- **Self-Healing**: Kubernetes Liveness/Readiness Probe를 통한 애플리케이션 상태 감지 및 자동 재시작
- **Failover**: 노드 장애 시 MetalLB의 Speaker가 즉시 다른 노드로 VIP 트래픽 우회

### 2.3. 비기능 요구사항
#### 2.3.1. 모니터링 및 로깅
- **Full Stack Monitoring**: PLG Stack (Prometheus, Loki, Grafana) 기반의 통합 관제
- **Alert System**: 주요 장애(노드 다운, 파드 에러) 발생 시 SMTP 이메일 알림 발송

#### 2.3.2. 장애 복구 및 보안
- **Data Safety**: MySQL Master-Slave 복제 및 NFS 기반 데이터 영속성 보장
- **Access Control**: Bastion Host를 통한 중앙 집중형 SSH 접근 제어 및 Ingress IP Whitelist 적용
- **Disaster Recovery**: 마스터 노드 및 주요 데이터 손상에 대비한 복구 매뉴얼 수립

## 3. 프로젝트 목표
### 3.1. 목표 개요
#### 3.1.1. 고가용성 시스템 구축
- 단일 장애 지점(SPOF)을 최소화하고, 특정 노드나 파드 장애 시에도 서비스가 중단되지 않는 환경 구현

#### 3.1.2. 부하 분산을 통한 성능 향상
- 트래픽을 다수의 워커 노드와 파드로 분산시켜 안정적인 응답 속도 보장

#### 3.1.3. 장애 대응 및 복구 체계 마련
- 장애 발생 시 자동 복구(Auto-healing)와 수동 복구 가이드(DR Plan)를 통해 RTO(복구 목표 시간) 단축

### 3.2. 고가용성 구현을 위한 세부 목표
#### 3.2.1. 로드밸런서 설정
- **MetalLB**: 가상 IP 풀(172.100.100.10~20) 구성 및 ARP 기반 Failover 설정
- **Ingress**: 호스트 헤더 기반 라우팅 및 SSL/TLS 종단(추후 적용) 준비

#### 3.2.2. 클러스터링 구성
- **Kubernetes**: Control Plane 1대와 Worker Node 3대를 통한 워크로드 분산

#### 3.2.3. 데이터 복제(Replication) 구성
- **MySQL**: 외부 Master 서버(Write)와 내부 Slave 파드(Read/Failover) 간 비동기 복제 구축

#### 3.2.4. 헬스체크 및 통합 모니터링
- **Probes**: 각 앱에 맞는 HTTP/TCP 헬스체크 엔드포인트 구성
- **Dashboard**: 노드 자원, 파드 상태, 애플리케이션 로그를 한눈에 볼 수 있는 Grafana 대시보드 구축

## 4. 시스템 아키텍처 설계서
### 4.1. 아키텍처 개요(전체 구성)
#### 4.1.1. 3-Tier 아키텍처 설명
- **Presentation Tier (Frontend)**: React 기반 SPA, Nginx 컨테이너로 정적 파일 서빙
- **Application Tier (Backend)**: Spring Boot 기반 REST API (Shop/Admin), JWT 인증 처리
- **Data Tier (Database)**: MySQL Master(VM) - Slave(K8s Pod) 구조의 데이터 계층

#### 4.1.2. 로드밸런서 역할
- **External (L4)**: MetalLB가 외부 트래픽을 K8s 클러스터의 Ingress Controller Service로 전달
- **Internal (L7)**: Ingress Controller가 URL 경로 및 호스트를 분석하여 적절한 ClusterIP 서비스로 분배

### 4.2. 세부 서비스별 설계
#### 4.2.1. 프론트엔드 로드밸런서 (Ingress)
- **Host**: `shop.mall.internal`
- **Backend**: `frontend-service` (Port 80)

#### 4.2.2. 애플리케이션 서버
- **Shop API**: `api.mall.internal` -> `shop-api-service` (Port 8082)
- **Admin API**: `admin.mall.internal` -> `admin-api-service` (Port 8081) (IP Whitelist 적용)

#### 4.2.3. 데이터베이스 서버
- **Master**: `172.100.100.8` (외부 VM)
- **Slave**: `mysql-service` (내부 파드, NFS 스토리지 마운트)

### 4.3. 네트워크 설계
#### 4.3.1. 서비스 구성
1. **User Request** -> **Bastion (Gateway)**
2. **Bastion** -> **MetalLB VIP (172.100.100.10)**
3. **VIP** -> **Ingress Controller (Worker Node)**
4. **Ingress** -> **Service (ClusterIP)** -> **Pod**

#### 4.3.2. 방화벽 설정
- **Bastion**: 외부(80, 443, 22) 허용, 내부는 모든 트래픽 허용
- **Worker Nodes**: NodePort 범위 및 내부 통신 허용, 외부 직접 접근 차단
- **DB/Storage**: 허용된 Worker Node IP 대역에서의 접근만 허용 (UFW)

### 4.4. 데이터 흐름 설계
#### 4.4.1. 요청 처리 흐름
- 사용자가 브라우저에 `shop.mall.internal` 입력 -> Bastion DNS가 VIP 응답 -> 브라우저가 VIP로 요청 -> MetalLB가 리더 노드로 전달 -> Ingress가 Frontend 파드로 라우팅

#### 4.4.2. 장애 발생 시 흐름
- **노드 다운**: K8s가 감지 -> 다른 노드에 파드 재스케줄링 -> MetalLB가 VIP를 다른 노드로 이동 (서비스 지속)
- **DB Master 다운**: 애플리케이션 에러 발생 -> 관리자가 Slave를 Master로 승격 (수동/반자동)

## 5. 기타 산출물
### 5.1. 구현 서비스별 구현 파일 목록
1. **[Config-01]** `config/server/common/50-cloud-init.yaml.template`: 네트워크 설정
2. **[K8s-01]** `k8s/base/00-namespaces.yaml`: 네임스페이스 정의
3. **[K8s-02]** `k8s/base/01-metallb-config.yaml`: MetalLB L2 설정
4. **[K8s-03]** `k8s/base/02-storage.yaml`: NFS PV/PVC 설정
5. **[K8s-04]** `k8s/base/03-ingress.yaml`: 통합 Ingress 규칙
6. **[K8s-05]** `k8s/mysql/`: MySQL 배포 및 설정 (ConfigMap 포함)
7. **[K8s-06]** `k8s/apps/`: Frontend, Shop-API, Admin-API 배포 명세
8. **[K8s-07]** `k8s/monitoring/`: PLG Stack (Prometheus, Loki, Grafana) 명세
9. **[Script-01]** `scripts/deploy/deploy_k8s.sh`: 전체 자동 배포 스크립트

### 5.2. 서비스 구현 순서 (실행 가이드)
1. **인프라 기초 설정**: 네임스페이스 및 스토리지 클래스 생성
   ```bash
   kubectl apply -f k8s/base/00-namespaces.yaml
   kubectl apply -f k8s/base/02-storage.yaml
   ```
2. **네트워크 로드밸런서 구축**: MetalLB 설치 및 설정
   ```bash
   kubectl apply -f https://raw.githubusercontent.com/metallb/metallb/v0.15.3/config/manifests/metallb-native.yaml
   kubectl apply -f k8s/base/01-metallb-config.yaml
   ```
3. **데이터베이스 배포**: MySQL Slave 및 외부 연결 설정
   ```bash
   kubectl apply -f k8s/mysql/
   ```
4. **애플리케이션 배포**: 백엔드 및 프론트엔드
   ```bash
   kubectl apply -f k8s/apps/
   ```
5. **트래픽 라우팅 활성화**: Ingress 규칙 적용
   ```bash
   kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/.../deploy.yaml
   kubectl apply -f k8s/base/03-ingress.yaml
   ```
6. **모니터링 시스템 구축**: PLG Stack 배포
   ```bash
   kubectl apply -f k8s/monitoring/
   ```

### 5.3. 서비스별 구현 파일 첨부
*(본 문서는 계획서이므로 파일 경로나 핵심 설정 내용만 기술하며, 실제 코드는 Git 저장소 내 해당 경로를 참조)*
