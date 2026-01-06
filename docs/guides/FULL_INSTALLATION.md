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
| **Database** | `db-server` | `172.100.100.8` | MySQL (External Database) |
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

### 3.1 네트워크 설정 (Static IP & DNS Fix)
`config/server/common/50-cloud-init.yaml.template` 파일을 참고하여 고정 IP를 할당합니다.

```bash
# 1. Netplan 설정 수정
sudo vim /etc/netplan/00-installer-config.yaml
```

**설정 예시 (172.100.100.3 Bastion의 경우):**
```yaml
network:
  ethernets:
    ens160:
      addresses:
      - 172.100.100.3/24
      nameservers:
        addresses:
        - 172.100.100.3  # 자기 자신 혹은 Bastion IP
        - 8.8.8.8
      routes:
      - to: default
        via: 172.100.100.2
  version: 2
```

```bash
sudo netplan apply

# 2. [중요] DNS 미반영 시 강제 설정 (100.4 ~ 100.7 필수)
# Ubuntu의 systemd-resolved가 설정을 무시할 경우 아래 명령 실행
sudo sed -i 's/#DNS=/DNS=172.100.100.3/' /etc/systemd/resolved.conf
sudo systemctl restart systemd-resolved

# 3. 확인
nslookup storage.mall.internal  # 172.100.100.9가 나와야 함
```

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

### 3.4 데이터 디스크 마운트 (Storage, DB 서버 권장)
운영체제와 데이터를 분리하기 위해 추가 디스크(예: `/dev/sdb`)를 `/mnt/DATA` 디렉토리에 마운트합니다.

```bash
# 1. 디스크 확인
lsblk  # 추가한 디스크 명칭 확인 (예: sdb)

# 2. 파티션 및 포맷 (ext4)
sudo mkfs.ext4 /dev/sdb

# 3. 마운트 포인트 생성 및 마운트
sudo mkdir -p /mnt/DATA
sudo mount /dev/sdb /mnt/DATA

# 4. 재부팅 시 자동 마운트 설정 (/etc/fstab)
sudo blkid /dev/sdb  # UUID 복사
sudo vim /etc/fstab
# UUID=복사한-UUID  /mnt/DATA  ext4  defaults  0  2  추가
```

---

## 🏗️ 4. Phase 3: Infrastructure Services Setup

### 4.1 Bastion (DNS Server) - `172.100.100.3`
내부 도메인 `*.mall.internal`을 처리합니다.

```bash
sudo apt install bind9 -y

# 설정 파일 복사 (Repository를 해당 서버에 clone 했다고 가정)
sudo cp dns/named.conf.options /etc/bind/named.conf.options
sudo cp dns/db.mall.internal /etc/bind/db.mall.internal

# Zone 등록 (/etc/bind/named.conf.local)
# zone "mall.internal" { type master; file "/etc/bind/db.mall.internal"; }; 추가

sudo systemctl restart bind9
```

### 4.2 Storage (NFS Server) - `172.100.100.9`
상품 이미지 공유 스토리지입니다. (앞선 단계에서 `/mnt/DATA` 마운트가 완료되었다고 가정합니다.)

```bash
sudo apt install nfs-kernel-server -y

# 마운트된 데이터 디스크 내에 공유 디렉토리 생성
sudo mkdir -p /mnt/DATA/images
sudo chown nobody:nogroup /mnt/DATA/images
sudo chmod 777 /mnt/DATA/images

# /etc/exports 수정
sudo vim /etc/exports
# /mnt/DATA/images 172.100.100.0/24(rw,sync,no_subtree_check,no_root_squash) 추가

sudo exportfs -ra
sudo systemctl restart nfs-kernel-server
```
*참고: K8s PV 설정(`k8s/base/01-storage.yaml`) 시 서버 주소를 `storage.mall.internal`로 사용합니다.*

### 4.3 Database (MySQL) - `172.100.100.8`
```bash
sudo apt update
sudo apt install -y mysql-server

# 1. 초기 보안 설정 (root 비밀번호 설정 및 보안 강화)
# Ubuntu 24.04에서는 초기 비밀번호가 없으므로 sudo로 먼저 접속합니다.
sudo mysql

# ---
# MySQL 콘솔 내부에서 실행 ---
# root 계정의 인증 방식을 비밀번호 기반으로 변경하고 비밀번호를 설정합니다.
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'YourSecureRootPassword';
FLUSH PRIVILEGES;
EXIT;

# 2. 보안 설치 스크립트 실행 (대화형)
# - 익명 사용자 삭제, root 원격 로그인 차단, 테스트 DB 삭제 등을 진행합니다.
sudo mysql_secure_installation

# 3. 외부 접속 허용 설정 (바인딩 주소 및 데이터 경로)
sudo systemctl stop mysql
sudo vim /etc/mysql/mysql.conf.d/mysqld.cnf
```

**수정할 내용 (`mysqld.cnf`):**
```ini
# 모든 IP로부터의 접속을 허용
bind-address = 0.0.0.0

# 데이터 저장 경로 변경 (선택 사항이나 권장)
datadir = /mnt/DATA/mysql
```

```bash
# 데이터 디렉토리 이동 및 권한 설정
sudo rsync -av /var/lib/mysql/ /mnt/DATA/mysql/
sudo chown -R mysql:mysql /mnt/DATA/mysql

# AppArmor 설정 수정 (경로 허용)
sudo vim /etc/apparmor.d/tunables/alias
# alias /var/lib/mysql/ -> /mnt/DATA/mysql/, 추가

sudo systemctl restart apparmor
sudo systemctl start mysql
```
*참고: K8s 내 앱 접속 시 `k8s/mysql/02-external-mysql.yaml`을 통해 `mysql-master-service`라는 도메인 주소로 접속합니다.*

### 4.4 데이터베이스 및 유저 생성
MySQL에 접속(`mysql -u root -p`)하여 아래 명령어를 실행합니다. (보안을 위해 root는 localhost 접속만 유지하고, 외부 앱용 계정을 별도로 생성합니다.)

```sql
-- 1. 데이터베이스 생성
CREATE DATABASE shopping_admin;
CREATE DATABASE shopping_shop;

-- 2. 애플리케이션용 유저 생성 및 권한 부여
-- '172.100.100.%'는 내부망(K8s 노드들 포함) 전체에서 접속 가능함을 의미합니다.
CREATE USER 'admin_user'@'172.100.100.%' IDENTIFIED BY 'password';

-- 각 데이터베이스에 대한 권한 할당
GRANT ALL PRIVILEGES ON shopping_admin.* TO 'admin_user'@'172.100.100.%';
GRANT ALL PRIVILEGES ON shopping_shop.* TO 'admin_user'@'172.100.100.%';

-- 3. 권한 적용
FLUSH PRIVILEGES;

-- (선택) 생성된 유저 확인
SELECT user, host FROM mysql.user WHERE user = 'admin_user';
```

---

## ☸️ 5. Phase 4: Kubernetes Cluster Setup

**Master(`100.4`) 및 Worker(`100.5`, `100.6`)** 노드에서 수행합니다.

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

### 5.5 MetalLB (LoadBalancer) 설치 및 설정
온프레미스 환경에서 `LoadBalancer` 타입의 서비스를 사용하기 위해 MetalLB를 설치합니다.

```bash
# 1. MetalLB 매니페스트 설치 (공식 가이드 기준)
kubectl apply -f https://raw.githubusercontent.com/metallb/metallb/v0.13.12/config/manifests/metallb-native.yaml

# 2. 설치 완료 대기
kubectl wait --namespace metallb-system \
                --for=condition=ready pod \
                --selector=app=metallb \
                --timeout=90s

# 3. 가상 IP 주소 풀 및 L2 광고 설정 적용
kubectl apply -f k8s/base/01-metallb-config.yaml
```

---

## 🚀 6. Phase 5: Application Deployment

### 6.1 K8s Workload (Frontend, API, DB)
네임스페이스별로 분리하여 리소스를 배포합니다.

```bash
# 1. Namespace 및 기본 리소스 생성
kubectl apply -f k8s/base/00-namespaces.yaml

# 2. Secret 생성 (각 네임스페이스별로 필요)
# ... (중략) ...

# 3. 인프라 배포 (MySQL, Storage, Ingress)
kubectl apply -f k8s/base/02-storage.yaml
kubectl apply -f k8s/mysql/
kubectl apply -f k8s/base/03-ingress.yaml

# 4. 애플리케이션 배포
kubectl apply -f k8s/apps/
```

### 6.2 배포 확인
*   **Shop (K8s)**: `http://shop.mall.internal` (MetalLB VIP `100.10`으로 연결됨)
*   **Admin (K8s)**: `http://admin.mall.internal` (MetalLB VIP `100.10`으로 연결됨, 화이트리스트 적용)

---

## 🛡️ 7. Phase 6: Bastion Gateway Setup (Nginx)

보안 강화를 위해 외부 트래픽을 Bastion 서버에서 먼저 받아 K8s 클러스터 내부로 전달합니다.

### 7.1 Bastion Nginx 설치
```bash
sudo apt update
sudo apt install nginx -y
```

### 7.2 리버스 프록시 설정
`shop`, `api`, `admin` 요청을 MetalLB 가상 IP(`172.100.100.10`)로 넘겨줍니다.

```bash
sudo vim /etc/nginx/sites-available/mall.internal
```

**설정 내용:**
```nginx
server {
    listen 80;
    server_name shop.mall.internal api.mall.internal admin.mall.internal;

    location / {
        proxy_pass http://172.100.100.10; # MetalLB VIP
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/mall.internal /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

이제 모든 도메인 기반 요청이 **Bastion(문지기) -> MetalLB(교통정리) -> Ingress(길찾기)**를 거쳐 안전하게 서비스됩니다!

```