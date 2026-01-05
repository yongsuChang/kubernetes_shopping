# 🏗️ Zero-to-Hero: Kubernetes Shopping Infrastructure Setup Guide

이 문서는 운영체제(Ubuntu 22.04 LTS 권장) 설치 직후부터 Kubernetes 클러스터 구축 및 애플리케이션 배포까지의 모든 과정을 다루는 통합 가이드입니다.

---

## 🗺️ 1. Infrastructure Overview (IP Plan)

모든 노드는 `172.100.100.0/24` 네트워크 대역을 사용합니다.

| Role | Hostname | IP Address | Description |
| :--- | :--- | :--- | :--- |
| **Bastion** | `bastion` | `172.100.100.3` | DNS Server, Gateway |
| **K8s Master** | `k8s-master` | `172.100.100.4` | Kubernetes Control Plane |
| **K8s Worker 1** | `k8s-node1` | `172.100.100.5` | Worker Node |
| **K8s Worker 2** | `k8s-node2` | `172.100.100.6` | Worker Node |
| **Admin Server** | `admin-server` | `172.100.100.7` | Admin API + Nginx (Docker Standalone) |
| **Database** | `db-server` | `172.100.100.8` | MySQL (Admin API 호스팅 겸용 가능) |
| **Storage** | `storage` | `172.100.100.9` | NFS Server |

---

## 💻 2. Phase 1: Control Node Setup (내 PC/로컬)

여러 서버를 효율적으로 관리하기 위해 로컬 PC에서 SSH 키 기반 인증을 구성합니다.

### 2.1 SSH Key 생성 및 배포
비밀번호 입력 없이 접속하기 위해 SSH 키 쌍을 생성하고 각 서버에 배포합니다.

```bash
# 로컬 터미널에서 실행
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
# (모든 질문에 Enter 입력)

# 각 서버로 공개키 전송 (password 입력 필요)
ssh-copy-id user@172.100.100.3
ssh-copy-id user@172.100.100.4
# ... (모든 IP에 대해 반복) 172.100.100.9 까지
```

### 2.2 SSH Config 설정 (권장)
매번 IP 주소를 입력하는 대신, 간편한 Hostname(`ssh master`, `ssh node1` 등)으로 접속하고 Bastion을 통한 ProxyJump를 자동화하기 위해 설정을 적용합니다.

```bash
# 1. 설정 파일 복사
mkdir -p ~/.ssh
cp config/local/ssh_config_sample ~/.ssh/config

# 2. 사용자 계정 및 경로 수정 (필요 시)
# 파일 내의 'User yongsu' 및 'IdentityFile' 경로를 본인의 환경에 맞게 수정하세요.
vim ~/.ssh/config

# 3. 권한 설정 (보안상 필수)
chmod 600 ~/.ssh/config

# 접속 테스트
ssh master  # 172.100.100.4로 자동 접속되어야 함
```

### 2.3 편의 설정 파일 전송
`config/local` 디렉토리에 있는 유용한 설정 파일들을 서버로 전송합니다.

```bash
# 로컬에서 실행 (scp 사용 예시)
scp config/local/.vimrc_sample user@172.100.100.3:~/.vimrc
# 각 서버에 대해 반복
```

---

## 🛠️ 3. Phase 2: Server Common Configuration (모든 노드)

**모든 서버(Bastion ~ Storage)** 에 공통으로 적용해야 하는 설정입니다.

### 3.1 네트워크 설정 (Static IP)
`config/server/common/50-cloud-init.yaml.template` 파일을 참고하여 고정 IP를 할당합니다.

```bash
# 각 서버에서 실행
sudo vim /etc/netplan/00-installer-config.yaml # 또는 50-cloud-init.yaml
```

**설정 예시 (172.100.100.3 Bastion의 경우):**
```yaml
network:
  ethernets:
    ens160: # 인터페이스 이름 확인 필요 (ip addr)
      addresses:
      - 172.100.100.3/24
      nameservers:
        addresses:
        - 8.8.8.8
      routes:
      - to: default
        via: 172.100.100.2 # Gateway IP
  version: 2
```
*Note: 각 서버에 맞는 IP로 변경하여 적용 후 `sudo netplan apply` 실행.*

### 3.2 Hostname 및 Hosts 파일 설정
서버 간 이름으로 통신할 수 있도록 설정합니다.

```bash
# 1. Hostname 변경 (각 서버별로 수행)
sudo hostnamectl set-hostname k8s-master # 예: k8s-master

# 2. Hosts 파일 수정 (모든 서버 공통)
# config/server/common/hosts.template 내용으로 덮어쓰기
sudo vim /etc/hosts
```

### 3.3 시스템 필수 설정
K8s 노드를 포함한 모든 리눅스 서버의 기본 설정입니다.

```bash
# 1. Swap 비활성화 (K8s 필수)
sudo swapoff -a
sudo sed -i '/ swap / s/^\(.*\)$/#\1/g' /etc/fstab

# 2. 필수 패키지 설치
sudo apt update
sudo apt install -y curl git vim net-tools openssh-server
```

---

## 🏗️ 4. Phase 3: Infrastructure Services Setup

### 4.1 Bastion (DNS Server) - `172.100.100.3`
내부 도메인 `*.mall.local`을 처리합니다.

```bash
sudo apt install bind9 -y

# 설정 파일 복사 (Repository를 해당 서버에 clone 했다고 가정)
sudo cp dns/named.conf.options /etc/bind/named.conf.options
sudo cp dns/db.mall.local /etc/bind/db.mall.local

# Zone 등록 (/etc/bind/named.conf.local)
# zone "mall.local" { type master; file "/etc/bind/db.mall.local"; }; 추가

sudo systemctl restart bind9
```

### 4.2 Storage (NFS Server) - `172.100.100.9`
상품 이미지 공유 스토리지입니다.

```bash
sudo apt install nfs-kernel-server -y
sudo mkdir -p /export/images
sudo chown nobody:nogroup /export/images
sudo chmod 777 /export/images

# /etc/exports 수정
# /export/images 172.100.100.0/24(rw,sync,no_subtree_check,no_root_squash) 추가

sudo exportfs -ra
sudo systemctl restart nfs-kernel-server
```

### 4.3 Database (MySQL) - `172.100.100.8`
```bash
sudo apt install mysql-server -y
# /etc/mysql/mysql.conf.d/mysqld.cnf 에서 bind-address = 0.0.0.0 으로 변경
sudo systemctl restart mysql

# MySQL 접속 후 유저 및 DB 생성 (MANUAL_SETUP.md 참조)
```

---

## ☸️ 5. Phase 4: Kubernetes Cluster Setup

**Master(`100.4`) 및 Worker(`100.5`, `100.6`)** 노드에서 수행합니다.
**주의**: `172.100.100.7` (Admin Server)는 클러스터에 Join하지 않습니다.

### 5.1 Container Runtime (Containerd) 설치
```bash
# 모듈 로드
cat <<EOF | sudo tee /etc/modules-load.d/k8s.conf
overlay
br_netfilter
EOF
sudo modprobe overlay
sudo modprobe br_netfilter

# 네트워크 파라미터 설정
cat <<EOF | sudo tee /etc/sysctl.d/k8s.conf
net.bridge.bridge-nf-call-iptables  = 1
net.bridge.bridge-nf-call-ip6tables = 1
net.ipv4.ip_forward                 = 1
EOF
sudo sysctl --system

# Containerd 설치
sudo apt install -y containerd
sudo mkdir -p /etc/containerd
containerd config default | sudo tee /etc/containerd/config.toml
sudo sed -i 's/SystemdCgroup = false/SystemdCgroup = true/' /etc/containerd/config.toml
sudo systemctl restart containerd
```

### 5.2 Kubernetes 패키지 설치
```bash
sudo apt-get update
# (중략: gpg 키 추가 및 apt repository 추가 과정 - 공식 문서 참조)
sudo apt-get install -y kubelet kubeadm kubectl
sudo apt-mark hold kubelet kubeadm kubectl
```

### 5.3 Master Node 초기화 (`100.4` Only)
```bash
sudo kubeadm init --pod-network-cidr=192.168.0.0/16 --apiserver-advertise-address=172.100.100.4

# kubectl 설정
mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config

# CNI (Calico) 설치
kubectl apply -f https://raw.githubusercontent.com/projectcalico/calico/v3.25.0/manifests/calico.yaml
```

### 5.4 Worker Node Join
Master 초기화 마지막에 출력된 `kubeadm join ...` 명령어를 각 Worker 노드(`100.5`, `100.6`)에서 실행합니다.

---

## 🚀 6. Phase 5: Application Deployment

### 6.1 K8s Workload (Frontend & Shop API)
Bastion 혹은 Master 노드에서 애플리케이션을 배포합니다.

```bash
# 0. Namespace 생성
kubectl create namespace shopping-mall

# 1. Secret 생성 (YAML 기반)
# 템플릿을 복사하여 실제 값을 입력할 디렉토리 생성 (Git에 커밋되지 않도록 주의)
mkdir -p k8s/secrets
cp k8s/templates/secrets/*.yaml k8s/secrets/

# AWS 인증 정보 및 공통 시크릿 수정
vim k8s/secrets/aws-secret.yaml
vim k8s/secrets/common-secret.yaml

# Secret 적용
kubectl apply -f k8s/secrets/

# 2. Ingress Controller
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.2/deploy/static/provider/cloud/deploy.yaml

# 앱 배포 (DB, Backend, Frontend)
kubectl apply -f k8s/base/
kubectl apply -f k8s/apps/frontend.yaml
kubectl apply -f k8s/apps/shop-api.yaml
# 주의: admin-api.yaml은 K8s에 배포하지 않습니다.
```

### 6.2 Admin Server Standalone Deployment (`172.100.100.7`)
보안 및 망 분리를 위해 Admin API는 별도 서버에서 Docker Compose로 실행합니다.

```bash
# 1. 코드 배포 (scp 등을 이용해 프로젝트 전체 혹은 deploy_admin 폴더 전송)
ssh admin
# (서버 접속 후)

# 2. Docker 설치 (필요 시)
# sudo apt install docker.io docker-compose-plugin

# 3. 환경 변수 설정 (.env)
# AWS Parameter Store 연동을 위해 인증 정보를 설정해야 합니다.
cat <<EOF > .env
AWS_ACCESS_KEY_ID=YOUR_ACCESS_KEY
AWS_SECRET_ACCESS_KEY=YOUR_SECRET_KEY
AWS_REGION=ap-northeast-2
EOF

# 4. 실행
cd deploy_admin
docker compose up -d
```

### 6.3 배포 확인
*   **Shop (K8s)**: `http://shop.mall.local`
*   **Admin (Standalone)**: `http://admin.mall.local` (허용된 IP에서만 접근 가능)