# 📊 Kubernetes Monitoring System (PLG Stack)

이 디렉토리는 쇼핑몰 인프라의 가시성을 확보하기 위한 **Prometheus, Loki, Grafana (PLG)** 스택의 매니페스트를 포함합니다. 4GB RAM 노드 환경에 최적화된 경량화 설정을 따릅니다.

## 🏗️ 시스템 구성
- **Loki**: 로그 영구 저장소 (NFS 기반)
- **Promtail**: 각 노드의 로그를 수집하여 Loki로 전송 (Regex 기반 라벨 추출)
- **Prometheus**: 메트릭 수집기 (Lite 버전, 30초 주기, 7일 보관)
- **Grafana**: 통합 시각화 대시보드
- **kube-state-metrics**: 쿠버네티스 객체 상태 메트릭 (Pod 상태, Resource Quota 등)
- **Node Exporter**: 하드웨어 리소스 지표 (CPU, RAM, Disk)

## 🚀 빠른 시작 (Quick Start)

### 1. 전제 조건
- NFS 서버(`storage.mall.internal`)에 `/mnt/DATA/logs/{loki,grafana,prometheus}` 디렉토리가 생성되어 있어야 합니다.
- 애플리케이션 Deployment에 `resources` (requests/limits) 설정이 되어 있어야 대시보드에서 사용량(%)이 정상 출력됩니다.

### 2. 배포 명령어
```bash
# 네임스페이스 및 스토리지 설정 (base 디렉토리에서 선행 필요)
kubectl apply -f k8s/monitoring/
```

## 🛠️ 트러블슈팅 (Troubleshooting)

### 대시보드에 데이터가 보이지 않을 때
1. **Cluster 변수**: 대시보드 상단 Cluster 변수에 `kubernetes`가 선택되어 있는지 확인합니다.
2. **Resource Metrics**: `shop-api` 등 각 앱의 YAML에 `resources.limits`가 설정되지 않으면 `No Data`가 뜰 수 있습니다.
3. **Loki 라벨**: `Select label`이 비어있다면 Promtail 로그에서 `/var/log/pods` 경로 접근 권한을 확인하세요.


### 3. 접속 방법
내 PC에서 Grafana 화면을 보기 위해 포트 포워딩을 수행합니다.
```bash
kubectl port-forward svc/grafana -n monitoring 3000:3000
```
브라우저 주소: `http://localhost:3000`

## ⚙️ Grafana 설정 가이드

### Data Sources 연결
Grafana 접속 후 아래 주소를 입력하여 데이터 소스를 추가합니다.
- **Prometheus**: `http://prometheus.monitoring.svc.cluster.local:9090`
- **Loki**: `http://loki.monitoring.svc.cluster.local:3100`

### 추천 대시보드 ID (Import)
- **Node Exporter**: `1860` (서버 리소스 현황)
- **Kubernetes View**: `15760` (포드 상태 및 네트워크)
- **JVM Micrometer**: `4701` (Java 애플리케이션 상세 메트릭)

## 📌 운영 정책 (Resource Optimization)
- **수집 주기**: 30초 (scrape_interval)
- **데이터 보관**: 7일 (retention_time)
- **저장소**: NFS 외부 마운트를 통한 영구 보존
