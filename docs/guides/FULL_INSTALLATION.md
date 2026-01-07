# 🏗️ Zero-to-Hero: Kubernetes Shopping Infrastructure Setup Guide

이 문서는 운영체제(Ubuntu 22.04/24.04 LTS 권장) 설치 직후부터 Kubernetes 클러스터 구축 및 애플리케이션 배포까지의 모든 과정을 다루는 통합 가이드입니다.

---

## 🗺️ 1. Infrastructure Overview (IP Plan)

모든 노드는 `172.100.100.0/24` 네트워크 대역을 사용합니다.

| Role | Hostname | IP Address | Description |
| :--- | :--- | :--- | :--- |
| **Bastion** | `bastion` | `172.100.100.3` | DNS Server, Gateway |
| **K8s Master** | `k8s-master` | `172.100.100.4` | Kubernetes Control Plane |
| **K8s Worker 1** | `k8s-node1` | `172.100.100.5` | Worker Node |
| **K8s Worker 2** | `k8s-node2` | `172.100.100.6` | Worker Node |
| **K8s Worker 3** | `k8s-node3` | `172.100.100.7` | Worker Node |
| **Database** | `db-server` | `172.100.100.8` | MySQL (External Database) |
| **Storage** | `storage` | `172.100.100.9` | NFS Server |

---

## 💻 2. Phase 1: Control Node Setup (내 PC/로컬)

여러 서버를 효율적으로 관리하기 위해 로컬 PC에서 SSH 키 기반 인증을 구성합니다.

### 2.1 SSH Key 생성 및 배포 [내 PC에서 실행]
비밀번호 입력 없이 접속하기 위해 SSH 키 쌍을 생성하고 각 서버에 배포합니다. 외부에서 내부망(`172.100.100.x`) 접근을 위해 Bastion을 경유(ProxyJump)합니다.

```bash
# 1. 키 생성 (ED25519 권장)
ssh-keygen -t ed25519 -C "your_email@example.com"

# 2. Bastion으로 키 전송
ssh-copy-id yongsu@10.100.0.3

# 3. 내부 서버로 키 전송 (Bastion 경유)
# Master, Worker1~3, DB, Storage 모든 IP에 대해 반복 수행
ssh-copy-id -i ~/.ssh/id_ed25519.pub -o ProxyJump=yongsu@10.100.0.3 yongsu@172.100.100.4
```

### 2.2 SSH Config 설정 (필수) [내 PC에서 실행]
매번 긴 명령어와 IP 주소를 입력하는 대신, 간편한 Hostname(`ssh master`, `ssh node1` 등)으로 접속하고 Bastion을 통한 ProxyJump를 자동화하기 위해 설정을 적용합니다.

```bash
# 1. 설정 파일 복사
mkdir -p ~/.ssh
cp config/local/ssh_config_sample ~/.ssh/config

# 2. 사용자 계정 및 경로 수정
# 파일 내의 'User' 및 'IdentityFile' 경로를 본인의 환경에 맞게 수정하세요.
vim ~/.ssh/config

# 3. 권한 설정 (보안상 필수)
chmod 600 ~/.ssh/config

# 접속 테스트
ssh master
```

### 2.3 프로젝트 파일 전송 [내 PC에서 실행]
로컬에서 수정한 Kubernetes 매니페스트(`k8s/`) 및 설정 파일들을 마스터 노드로 복사하고, 모든 서버에 편의 설정(`.vimrc`)을 배포합니다.

```bash
# 1. K8s 매니페스트 전송 (SSH Config가 설정된 경우)
scp -r ./k8s master:~/
scp -r ./config master:~/

# 2. 모든 서버에 .vimrc 배포 (관리 편의성)
scp config/local/.vimrc_sample bastion:~/.vimrc
scp config/local/.vimrc_sample master:~/.vimrc
scp config/local/.vimrc_sample node1:~/.vimrc
scp config/local/.vimrc_sample node2:~/.vimrc
scp config/local/.vimrc_sample node3:~/.vimrc
scp config/local/.vimrc_sample db-server:~/.vimrc
scp config/local/.vimrc_sample storage:~/.vimrc
```

### 2.4 Local Client Setup (내 PC 접속 설정)
브라우저에서 도메인(`shop.mall.internal` 등)으로 접속하기 위해, **작업 중인 로컬 PC**의 hosts 파일을 수정해야 합니다. Bastion 서버가 Gateway 역할을 수행하므로, 모든 도메인을 Bastion IP(`172.100.100.3`)로 매핑합니다.

**Windows:**
1. 메모장을 **관리자 권한**으로 실행합니다.
2. `C:\Windows\System32\drivers\etc\hosts` 파일을 엽니다.
3. 아래 내용을 파일 끝에 추가하고 저장합니다.

**Mac / Linux:**
터미널에서 아래 명령어를 실행합니다.
```bash
sudo vim /etc/hosts
```

**추가할 내용 (공통):**
```text
172.100.100.3  shop.mall.internal api.mall.internal admin.mall.internal
```

---

## 🛠️ 3. Phase 2: Server Common Configuration (모든 노드)

### 3.1 네트워크 설정 (Static IP & DNS Fix) [모든 노드에서 개별 실행]
`config/server/common/50-cloud-init.yaml.template` 파일을 참고하여 고정 IP를 할당합니다.

```bash
# 1. Netplan 설정 수정
sudo vim /etc/netplan/50-cloud-init.yaml
```

**설정 예시 (172.100.100.3 Bastion의 경우):**
```yaml
network:
  ethernets:
    ens33: # VMware 기본 인터페이스 명칭 (ip addr로 확인 가능)
      addresses:
      - 172.100.100.3/24
      nameservers:
        addresses:
        - 172.100.100.3  # 자기 자신 혹은 Bastion IP (DNS)
        - 8.8.8.8        # 보조 DNS
      routes:
      - to: default
        via: 172.100.100.2 # Gateway IP
  version: 2
```

```bash
# 설정 적용
sudo netplan apply

# 2. [중요] DNS 미반영 시 강제 설정 (100.4 ~ 100.7 필수)
# Ubuntu의 systemd-resolved가 설정을 무시할 경우 아래 파일 수정
sudo vim /etc/systemd/resolved.conf
# DNS=172.100.100.3 주석 해제 및 입력

sudo systemctl restart systemd-resolved

# 3. 확인
nslookup storage.mall.internal  # 172.100.100.9가 정상 출력되는지 확인
```

### 3.2 Hostname 및 Hosts 파일 설정 [모든 노드에서 개별 실행]
```bash
# 1. Hostname 변경
sudo hostnamectl set-hostname k8s-master # 각 서버 명칭(node1, node2 등)에 맞게 변경

# 2. Hosts 파일 수정
# config/server/common/hosts.template 내용을 /etc/hosts에 추가하거나 덮어쓰기
sudo vim /etc/hosts
```

### 3.3 시스템 필수 설정 [모든 노드에서 개별 실행]
```bash
# 1. Swap 비활성화 (K8s 필수)
sudo swapoff -a
sudo sed -i '/ swap / s/^\(.*\)$/#\1/g' /etc/fstab

# 2. 필수 패키지 설치
sudo apt update
sudo apt install -y curl git vim net-tools openssh-server rsync
```

### 3.4 데이터 디스크 마운트 [Storage, DB 서버 권장]
운영체제와 데이터를 분리하기 위해 추가 디스크를 `/mnt/DATA` 디렉토리에 마운트합니다.

```bash
# 1. 디스크 확인 (예: /dev/sdb)
lsblk

# 2. 파티션 포맷 (ext4)
sudo mkfs.ext4 /dev/sdb

# 3. 마운트 포인트 생성 및 마운트
sudo mkdir -p /mnt/DATA
sudo mount /dev/sdb /mnt/DATA

# 4. 재부팅 시 자동 마운트 설정 (/etc/fstab)
sudo blkid /dev/sdb  # UUID 확인 및 복사
sudo vim /etc/fstab
# UUID=확인한-UUID  /mnt/DATA  ext4  defaults  0  2  내용 추가
```

---

## 🏗️ 4. Phase 3: Infrastructure Services Setup

### 4.1 Bastion (DNS Server) - `172.100.100.3` [Bastion에서 실행]
내부 도메인 `*.mall.internal`을 관리하기 위해 BIND9을 설정합니다.

```bash
sudo apt install bind9 -y

# 1. 설정 파일 복사
sudo cp ~/config/server/common/named.conf.options /etc/bind/named.conf.options
sudo cp ~/dns/db.mall.internal /etc/bind/db.mall.internal

# 2. Zone 등록 (/etc/bind/named.conf.local)
# 아래 내용 추가:
# zone "mall.internal" { type master; file "/etc/bind/db.mall.internal"; };

sudo systemctl restart bind9
```

### 4.2 Storage (NFS Server) - `172.100.100.9` [Storage에서 실행]
```bash
sudo apt install nfs-kernel-server -y

# 1. 공유 디렉토리 생성 및 권한 설정
sudo mkdir -p /mnt/DATA/images /mnt/DATA/mysql-slave
sudo chown nobody:nogroup /mnt/DATA/images /mnt/DATA/mysql-slave
sudo chmod 777 /mnt/DATA/images /mnt/DATA/mysql-slave

# 2. 공유 설정 (/etc/exports)
# 아래와 같이 실제 마운트가 필요한 K8s Worker 노드 IP만 명시하는 것을 권장합니다.
# /mnt/DATA/images      172.100.100.5(rw,sync,no_subtree_check,no_root_squash) 172.100.100.6(rw,sync,no_subtree_check,no_root_squash) 172.100.100.7(rw,sync,no_subtree_check,no_root_squash)

sudo exportfs -ra
sudo systemctl restart nfs-kernel-server

# 3. 보안 설정 (UFW 방화벽)
sudo ufw default deny incoming
sudo ufw allow from 172.100.100.0/24 to any port 22
sudo ufw allow from 172.100.100.5 to any port 2049
sudo ufw allow from 172.100.100.6 to any port 2049
sudo ufw allow from 172.100.100.7 to any port 2049
sudo ufw enable
```

### 4.3 Database (MySQL) - `172.100.100.8` [DB Server에서 실행]
```bash
sudo apt update
sudo apt install -y mysql-server

# 1. 초기 보안 설정 (root 비밀번호 설정 및 보안 강화)
# Ubuntu 24.04에서는 초기 비밀번호가 없으므로 sudo로 먼저 접속합니다.
sudo mysql

# --- MySQL 콘솔 내부에서 실행 ---
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
# alias /var/lib/mysql/ -> /mnt/DATA/mysql/, 내용 추가

sudo systemctl restart apparmor
sudo systemctl start mysql
```

### 4.4 데이터베이스 및 유저 생성 [DB 서버 MySQL 콘솔]
```sql
CREATE DATABASE shopping_admin;
CREATE DATABASE shopping_shop;

-- 내부망 전체('172.100.100.%')에서의 접속을 허용하는 유저 생성
CREATE USER 'admin_user'@'172.100.100.%' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON shopping_admin.* TO 'admin_user'@'172.100.100.%';
GRANT ALL PRIVILEGES ON shopping_shop.* TO 'admin_user'@'172.100.100.%';
FLUSH PRIVILEGES;
```

### 4.5 MySQL Master-Slave 복제 구성 (선택 사항)
외부 서버(`172.100.100.8`)를 **Master**로, Kubernetes 내부의 MySQL을 **Slave**로 설정하여 데이터 가용성을 확보합니다.

**1. Master 설정 (`172.100.100.8`)**
*   `/etc/mysql/mysql.conf.d/mysqld.cnf` 수정:
    ```ini
    [mysqld]
    server-id = 1
    log-bin = mysql-bin
    binlog_format = ROW
    ```
*   `sudo systemctl restart mysql`
*   복제 계정 생성 및 포지션 확인:
    ```sql
    CREATE USER 'repl_user'@'172.100.100.%' IDENTIFIED BY 'repl12345';
    GRANT REPLICATION SLAVE ON *.* TO 'repl_user'@'172.100.100.%';
    SHOW MASTER STATUS; -- File과 Position 값 기록
    ```

**2. Slave 설정 (Kubernetes)**
*   ConfigMap 적용 (Server ID=2 설정 포함):
    ```bash
    kubectl apply -f k8s/mysql/01-mysql-config.yaml
    kubectl rollout restart deployment mysql -n shopping-db
    ```
*   K8s MySQL 파드 접속 및 설정 상태 확인:
    ```bash
    kubectl exec -it <mysql-pod-name> -n shopping-db -- mysql -u root -p
    # Server ID가 2인지 확인 (1이면 설정 마운트 실패)
    SHOW VARIABLES LIKE 'server_id';
    ```
*   복제 시작:
    ```sql
    CHANGE MASTER TO
      MASTER_HOST='172.100.100.8',
      MASTER_USER='repl_user',
      MASTER_PASSWORD='repl_password',
      MASTER_LOG_FILE='[Master에서 확인한 File]',
      MASTER_LOG_POS=[Master에서 확인한 Position],
      GET_MASTER_PUBLIC_KEY=1; -- MySQL 8.0 인증 오류 방지 필수
    START SLAVE;
    ```
*   상태 확인: `SHOW SLAVE STATUS\G` (IO/SQL Running이 Yes여야 함)

#### 💡 복제 트러블슈팅 (Troubleshooting)
... (생략) ...
*   **데이터 누락**: 특정 시점 이전의 데이터가 보이지 않는다면, `MASTER_LOG_POS`를 테이블 생성 시점의 포지션으로 되돌려(`CHANGE MASTER TO MASTER_LOG_POS=...`) 다시 시작하세요.

### 4.6 데이터 백업 자동화 (Database Backup)
데이터 유실에 대비하여 Master DB를 매일 자동으로 백업하고 관리합니다.

**1. 인증 정보 설정 (Master DB 서버)**
`mysqldump`가 비밀번호 입력 없이 실행될 수 있도록 **MySQL root 계정** 정보를 설정합니다.
```bash
vim ~/.my.cnf
# [client]
# user=root
# password=Your_MySQL_Root_Password (주의: 시스템 비밀번호가 아님)
chmod 600 ~/.my.cnf
```

**2. 백업 스크립트 작성**
`/usr/local/bin/db-backup.sh` 파일을 생성하고 실행 권한을 부여합니다. `tar`를 사용하여 압축률이 높은 `.tar.gz` 아카이브를 생성합니다.
```bash
#!/bin/bash
BACKUP_DIR="/mnt/DATA/backups"
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="shopping_db"

mkdir -p $BACKUP_DIR

# 1. SQL 덤프 생성 후 tar.gz 압축
mysqldump $DB_NAME > $BACKUP_DIR/${DB_NAME}_$DATE.sql
tar -czf $BACKUP_DIR/${DB_NAME}_$DATE.tar.gz -C $BACKUP_DIR ${DB_NAME}_$DATE.sql

# 2. 원본 SQL 파일 삭제
rm $BACKUP_DIR/${DB_NAME}_$DATE.sql

# 3. 7일이 지난 백업 파일 자동 삭제
find $BACKUP_DIR -type f -name "*.tar.gz" -mtime +7 -delete
```

**3. Cron 작업 등록**
매일 새벽 2시에 백업을 수행하도록 등록합니다.
```bash
sudo crontab -e
# 0 2 * * * /usr/local/bin/db-backup.sh
```

> **참고: 파드 재시작 시 설정 유지**
> Kubernetes의 MySQL은 `/var/lib/mysql` 경로를 PVC(NFS/Local 등)에 저장하므로, 파드가 재시작되거나 노드가 변경되어도 복제 설정(Master 정보 및 현재 진행 포지션)은 자동으로 유지됩니다. 별도의 추가 작업 없이도 파드 가동 시 복제가 자동으로 재개됩니다.

---

## ☸️ 5. Phase 4: Kubernetes Cluster Setup

### 5.1 Container Runtime (Containerd) 설치 [Master & 모든 Worker 노드]
```bash
# 1. 커널 모듈 로드
cat <<EOF | sudo tee /etc/modules-load.d/k8s.conf
overlay
br_netfilter
EOF
sudo modprobe overlay && sudo modprobe br_netfilter

# 2. 네트워크 파라미터 설정
cat <<EOF | sudo tee /etc/sysctl.d/k8s.conf
net.bridge.bridge-nf-call-iptables  = 1
net.bridge.bridge-nf-call-ip6tables = 1
net.ipv4.ip_forward                 = 1
EOF
sudo sysctl --system

# 3. Containerd 설치 및 설정
sudo apt install -y containerd
sudo mkdir -p /etc/containerd
containerd config default | sudo tee /etc/containerd/config.toml
sudo sed -i 's/SystemdCgroup = false/SystemdCgroup = true/' /etc/containerd/config.toml
sudo systemctl restart containerd
```

### 5.2 Kubernetes 패키지 설치 [Master & 모든 Worker 노드]
```bash
# (중략: 레포지토리 추가 과정 공식 가이드 참조)
sudo apt-get install -y kubelet kubeadm kubectl
sudo apt-mark hold kubelet kubeadm kubectl
```

### 5.3 Master Node 초기화 [Master 노드에서만 실행]
```bash
sudo kubeadm init --pod-network-cidr=192.168.0.0/16 --apiserver-advertise-address=172.100.100.4

# kubectl 설정 복사
mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config

# CNI (Calico) 설치
kubectl apply -f https://raw.githubusercontent.com/projectcalico/calico/v3.25.0/manifests/calico.yaml
```

### 5.4 Worker Node Join [각 Worker 노드에서 실행]
Master에서 발급된 `kubeadm join` 명령어를 각 Worker 노드(`100.5`, `100.6`, `100.7`)에서 실행합니다. 명령어를 잃어버렸다면 Master에서 `sudo kubeadm token create --print-join-command`로 재확인하세요.

### 5.5 MetalLB (LoadBalancer) 설치 및 설정 [Master 노드에서 실행]
```bash
# 1. MetalLB 설치 (최신 v0.15.3)
kubectl apply -f https://raw.githubusercontent.com/metallb/metallb/v0.15.3/config/manifests/metallb-native.yaml

# 2. 설치 완료 대기 (정상 가동 확인 후 설정 진행)
kubectl wait --namespace metallb-system \
                --for=condition=ready pod \
                --selector=app=metallb \
                --timeout=90s

# 3. 가상 IP 주소 풀 설정 적용 (k8s/base/01-metallb-config.yaml)
kubectl apply -f ~/k8s/base/01-metallb-config.yaml
```

### 5.6 NGINX Ingress Controller 설치 [Master 노드에서 실행]
```bash
# 1. 설치 매니페스트 적용 (Bare-metal 용)
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.10.1/deploy/static/provider/baremetal/deploy.yaml

# 2. Ingress Controller 서비스를 LoadBalancer 타입으로 변경 (MetalLB와 연동)
kubectl patch service ingress-nginx-controller -n ingress-nginx -p '{"spec": {"type": "LoadBalancer"}}'

# 3. 설치 확인 (EXTERNAL-IP 할당 대기)
kubectl get svc -n ingress-nginx
```

---

## 🚀 6. Phase 5: Application Deployment [Master 노드에서 실행]

### 6.1 K8s Workload 배포
```bash
# 1. Namespace 생성
kubectl apply -f ~/k8s/base/00-namespaces.yaml

# 2. Secret 생성 (템플릿 복사 후 실제 값 입력하여 배포)
mkdir -p ~/k8s/secrets
cp ~/k8s/templates/secrets/*.yaml ~/k8s/secrets/
# vim으로 시크릿 값 수정 후:
kubectl apply -f ~/k8s/secrets/

# 3. 인프라 및 애플리케이션 배포
kubectl apply -f ~/k8s/base/02-storage.yaml
kubectl apply -f ~/k8s/mysql/
kubectl apply -f ~/k8s/base/03-ingress.yaml
kubectl apply -f ~/k8s/apps/
```

### 6.2 배포 확인
*   **Frontend**: `http://shop.mall.internal` (가상 IP `100.10`으로 연결)
*   **Shop API**: `http://api.mall.internal`
*   **Admin API**: `http://admin.mall.internal` (IP 화이트리스트 적용됨)

---

## 🛡️ 7. Phase 6: Bastion Gateway Setup (Nginx) [Bastion에서 실행]

```bash
sudo apt update
sudo apt install nginx -y

# 1. 리버스 프록시 설정 (/etc/nginx/sites-available/mall.internal)
# server_name shop.mall.internal api.mall.internal admin.mall.internal;
# proxy_pass http://172.100.100.10; # MetalLB VIP

sudo systemctl restart nginx
```

---

## 🔧 8. Phase 7: Cluster Maintenance & Troubleshooting

### 8.1 최신 애플리케이션 이미지 반영
애플리케이션을 업데이트하고 Docker Hub에 동일한 `latest` 태그로 푸시한 경우, Kubernetes 노드는 기존 캐시된 이미지를 사용할 수 있습니다. 이를 방지하고 항상 최신본을 가져오려면 다음 설정을 확인하세요.

**1. 매니페스트 설정 (`k8s/apps/*.yaml`)**
`imagePullPolicy`가 `Always`로 설정되어 있어야 합니다.
```yaml
spec:
  containers:
  - name: my-app
    image: my-repo/my-app:latest
    imagePullPolicy: Always
```

**2. 강제 재시작 (Rollout Restart)**
설정 변경 후 또는 이미지를 강제로 새로고침하려면 아래 명령어를 사용합니다.
```bash
kubectl rollout restart deployment shop-api -n shopping-backend
kubectl rollout restart deployment frontend -n shopping-frontend
kubectl rollout restart deployment admin-api -n shopping-admin
```

### 8.2 노드/VM 재부팅 후 파드 종료 안 됨 (Terminating Stuck)
VM이나 물리 노드를 재부팅한 후, 특정 파드가 `Terminating` 상태에서 계속 멈춰 있고 `FailedKillPod` 오류가 발생하는 경우가 있습니다. 이는 CNI(Calico)가 API 서버와 일시적으로 통신이 끊겨 네트워크 정리를 완료하지 못했기 때문입니다.

**해결 방법 (강제 삭제):**
```bash
# 1. 멈춰 있는 파드 확인
kubectl get pods -A | grep Terminating

# 2. 강제 삭제 실행 (--grace-period=0 --force)
kubectl delete pod <POD_NAME> -n <NAMESPACE> --grace-period=0 --force
```

### 8.3 프론트엔드 API 호출 오류 (localhost 호출 문제)
브라우저에서 API 호출 시 `http://localhost:8082...`로 요청을 보내며 CORS 에러가 난다면, 이는 프론트엔드 빌드 시점에 환경 변수(`VITE_SHOP_API_URL`)가 제대로 주입되지 않은 것입니다.

*   **체크리스트**:
    1.  `responsive-react-app/.env` 파일의 URL이 `http://api.mall.internal`인지 확인.
    2.  `.gitignore`에 의해 `.env`가 Docker 빌드 과정에서 누락되지 않았는지 확인.
    3.  수정 후에는 반드시 **이미지를 다시 빌드/푸시**하고 `rollout restart`를 수행해야 합니다.
