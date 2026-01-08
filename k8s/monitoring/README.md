# 📊 Kubernetes Monitoring System (PLG Stack)

본 디렉토리는 쇼핑몰 시스템의 가시성 확보 및 장애 대응을 위한 통합 모니터링 스택 설정을 담고 있습니다. 4GB RAM의 제한적인 노드 환경을 고려하여 **경량화(Lite)** 및 **NFS 기반 영구 저장** 구조로 설계되었습니다.

## 🏗️ 시스템 구성 요소

| 컴포넌트 | 역할 | 주요 설정 |
| :--- | :--- | :--- |
| **Prometheus** | 메트릭 수집 및 시각화 | Lite 버전, 60s 수집 주기, 7일 보관, NFS No-Lock 적용 |
| **Loki** | 로그 통합 관리 | Regex 기반 라벨 추출, NFS 영구 저장 |
| **Promtail** | 로그 수집기 | DaemonSet 구성, `/var/log/pods` 직접 타격 |
| **Grafana** | 통합 대시보드 | SMTP 이메일 알림 연동, Ingress 외 노출 |
| **kube-state-metrics** | K8s 객체 상태 감시 | Pod 상태, 리소스 제한량(Limits) 지표 제공 |
| **Node Exporter** | 하드웨어 모니터링 | 노드별 CPU, RAM, Disk, Network 지표 수집 |

## 🚀 설치 및 배포

### 1. 전제 조건 (NFS 디렉토리 생성)
NFS 서버(`172.100.100.9`)에서 각 서비스용 데이터를 저장할 폴더를 수동으로 생성해야 합니다.
```bash
sudo mkdir -p /mnt/DATA/logs/{loki,grafana,prometheus}
sudo chmod -R 777 /mnt/DATA/logs
```

### 2. 배포 순서
```bash
# 1. 시크릿 및 스토리지 설정 (Master 노드)
kubectl apply -f k8s/monitoring/08-smtp-secret.yaml
kubectl apply -f k8s/base/02-storage.yaml

# 2. 모니터링 엔진 배포
kubectl apply -f k8s/monitoring/
```

## ⚙️ 주요 설정 및 기능

### 1. 리소스 최적화 (4GB Node 대응)
- **Prometheus**: 수집 주기(`scrape_interval`)를 1분으로 조정하고, `resources.limits.memory`를 512Mi로 제한하여 시스템 안정성 확보.
- **Loki**: 전체 인덱싱 대신 라벨 기반 압축 저장을 통해 메모리 사용량 최소화.

### 2. 알림 시스템 (Alerting)
- **SMTP 연동**: Google 앱 비밀번호를 Kubernetes Secret으로 관리하여 보안 강화.
- **주요 알림 규칙**:
    - `Node-Memory-Warning`: 노드 메모리 사용율 90% 이상 5분 지속 시 발송.
    - `Pod-Restart-Alert`: 특정 포드의 재시작 횟수가 증가할 때 즉시 알림.

## 🛠️ 트러블슈팅 (Troubleshooting History)

### 1. Prometheus NFS Lock 이슈
- **현상**: Prometheus 포드가 `opening storage failed: lock DB directory` 에러와 함께 CrashLoopBackOff 발생.
- **해결**: `--storage.tsdb.no-lockfile` 인자를 추가하여 NFS 환경에서의 파일 잠금 충돌 해결.

### 2. Loki Label Browser 비어있음
- **현상**: 로그는 쌓이나 `pod`, `namespace` 등의 라벨이 보이지 않음.
- **해결**: Promtail 설정에서 `/var/log/pods` 경로의 정규식(Regex)을 현재 환경의 CRI(Containerd) 구조에 맞춰 수정하여 해결.

### 3. 대시보드 No Data (Label Mismatch)
- **현상**: Explore에서는 데이터가 보이나 임포트한 대시보드에 그래프가 안 나옴.
- **해결**: 모든 지표에 `cluster="kubernetes"` 전역 라벨을 주입하고, 대시보드 변수(Variables)의 쿼리를 실제 수집 중인 지표 이름으로 보정.