# 🚑 Kubernetes Cluster Disaster Recovery Guide

이 문서는 Kubernetes 클러스터의 주요 장애 상황(마스터 노드 손상, etcd 데이터 유실 등)에 대한 복구 절차를 다룹니다.

---

## 🛑 Scenario 1: Master Node Corrupted (etcd Data Loss)

마스터 노드 재부팅 후 `connection refused`가 발생하고, etcd 데이터 파일 손상(`snapshot file doesn't exist`)으로 인해 API 서버가 실행되지 않는 상황입니다. 가장 빠르고 확실한 복구 방법은 **마스터 노드 초기화 및 재구성**입니다.

### 1. 마스터 노드 초기화 (Master Node)
기존의 손상된 클러스터 설정 및 etcd 데이터를 완전히 제거합니다.
```bash
# 1. Kubernetes 설정 초기화
sudo kubeadm reset -f

# 2. 관련 설정 파일 및 데이터 삭제
sudo rm -rf /root/.kube $HOME/.kube /var/lib/etcd
```

### 2. 마스터 노드 재설치 (Master Node)
초기 설치 시 사용했던 네트워크 대역(`192.168.0.0/16`)과 API 서버 주소(`172.100.100.4`)를 그대로 사용하여 다시 초기화합니다.
```bash
sudo kubeadm init --pod-network-cidr=192.168.0.0/16 --apiserver-advertise-address=172.100.100.4
```
> **⚠️ 중요:** 초기화 완료 후 출력되는 `kubeadm join ...` 명령어를 반드시 복사해두세요. 워커 노드 재연결 시 필요합니다.

### 3. kubectl 권한 설정 (Master Node)
```bash
mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config
```

### 4. 네트워크 플러그인(Calico) 재설치 (Master Node)
```bash
kubectl apply -f https://raw.githubusercontent.com/projectcalico/calico/v3.25.0/manifests/calico.yaml
```

### 5. 워커 노드 재연결 (All Worker Nodes)
기존 워커 노드들도 마스터와의 연결 정보를 초기화한 후 다시 연결해야 합니다.
**Node1, Node2, Node3 각각 실행:**
```bash
# 1. 기존 연결 초기화
sudo kubeadm reset -f

# 2. 마스터에 다시 조인 (2번 단계에서 복사한 명령어 사용)
sudo kubeadm join 172.100.100.4:6443 --token <TOKEN> --discovery-token-ca-cert-hash <HASH>
```

### 6. 인프라 및 애플리케이션 복구 (Master Node)
클러스터가 초기화되었으므로 모든 리소스를 다시 배포해야 합니다. **순서를 반드시 지켜주세요.**

```bash
# 1. 네임스페이스 & 스토리지 설정 (가장 먼저!)
kubectl apply -f k8s/base/00-namespaces.yaml
kubectl apply -f k8s/base/02-storage.yaml

# 2. MetalLB (LoadBalancer) 설치
kubectl apply -f https://raw.githubusercontent.com/metallb/metallb/v0.15.3/config/manifests/metallb-native.yaml
sleep 30 # CRD 생성 대기
kubectl apply -f k8s/base/01-metallb-config.yaml

# 3. Ingress Controller 설치
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.10.1/deploy/static/provider/baremetal/deploy.yaml
kubectl patch service ingress-nginx-controller -n ingress-nginx -p '{"spec": {"type": "LoadBalancer"}}'

# 4. 애플리케이션 배포
kubectl apply -f k8s/secrets/
kubectl apply -f k8s/mysql/
kubectl apply -f k8s/base/03-ingress.yaml
kubectl apply -f k8s/apps/
```

---

## 📊 Scenario 2: Loki/Promtail Failure after Re-install

클러스터를 재설치한 후 Loki 파드가 `CrashLoopBackOff` 상태에 빠지고 `permission denied` 에러가 발생하는 경우입니다. 이는 NFS 스토리지에 남아있는 **이전 클러스터의 임시 파일(WAL)** 소유권이 현재 파드와 다르기 때문입니다.

### 1. 로그 분석
```bash
kubectl logs -n monitoring -l app=loki
# 에러 메시지: "open /data/loki/wal/00000021: permission denied"
```

### 2. 문제 해결 (Storage Server)
Loki의 데이터 무결성을 위한 임시 파일인 `wal` 디렉토리를 삭제하면, Loki가 시작될 때 자동으로 깨끗한 상태로 다시 생성합니다.

**Storage 서버(`172.100.100.9`) 접속 후 실행:**
```bash
# 권한 문제 해결을 위해 WAL(Write Ahead Log) 폴더 삭제
sudo rm -rf /mnt/DATA/logs/loki/wal

# (선택) 전체 권한 재설정
sudo chmod -R 777 /mnt/DATA/logs
```

### 3. 서비스 재시작 (Master Node)
```bash
# 파드를 삭제하여 재시작 유도
kubectl delete pod -n monitoring -l app=loki
```

---

## 📝 Troubleshooting Checklist

1.  **Node Status:** `kubectl get nodes` (모두 Ready 상태여야 함)
2.  **Pod Status:** `kubectl get pods -A` (모두 Running 상태여야 함)
3.  **Storage:** NFS 서버의 `/etc/exports` 설정과 서비스 상태(`systemctl status nfs-kernel-server`) 확인
4.  **Network:** Calico 파드들이 모두 정상인지 확인 (`kubectl get pods -n kube-system -l k8s-app=calico-node`)
