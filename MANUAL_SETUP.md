# 온프레미스 인프라 및 클러스터 수동 설정 가이드 (Infrastructure Setup Guide)

이 문서는 Kubernetes 클러스터와 주변 인프라(VMware 기반)를 정상적으로 운영하기 위해 **사용자가 직접 수행해야 하는 수동 설정 작업**을 다룹니다.

모든 서버는 `172.100.100.0/24` 네트워크 대역에 존재한다고 가정합니다.

---

## 1. Bastion Host (`172.100.100.3`) - 내부 DNS 구축

내부 도메인(`*.mall.local`) 사용을 위해 Bastion 서버를 DNS 서버로 구성합니다.

### 1.1 BIND9 설치
```bash
sudo apt update
sudo apt install bind9 -y
```

### 1.2 설정 파일 적용
프로젝트 소스 코드 내의 `dns/` 디렉토리에 있는 설정 파일들을 시스템 경로로 복사합니다.

```bash
# 프로젝트 루트에서 실행 (가정)
sudo cp dns/named.conf.options /etc/bind/named.conf.options
sudo cp dns/db.mall.local /etc/bind/db.mall.local
```

### 1.3 Zone 등록
`/etc/bind/named.conf.local` 파일을 편집하여 아래 내용을 추가합니다.

```bash
sudo nano /etc/bind/named.conf.local
```

**추가할 내용:**
```text
zone "mall.local" {
    type master;
    file "/etc/bind/db.mall.local";
};
```

### 1.4 서비스 재시작 및 확인
```bash
sudo systemctl restart bind9
sudo systemctl status bind9
```

---

## 2. Windows Host (사용자 PC) - 네트워크 설정

사용자 PC(브라우저)가 내부 도메인을 인식하고 Bastion을 통해 K8s 서비스에 접속하도록 설정합니다.

1.  **제어판** > **네트워크 및 공유 센터** > **어댑터 설정 변경**으로 이동합니다.
2.  VMware와 연결된 네트워크 어댑터(예: `VMware Network Adapter VMnet8` 또는 NAT 어댑터)를 찾습니다.
3.  우클릭 > **속성** > **인터넷 프로토콜 버전 4(TCP/IPv4)** > **속성**을 클릭합니다.
4.  **"다음 DNS 서버 주소 사용"**을 선택하고 설정을 변경합니다.
    *   **기본 설정 DNS 서버**: `172.100.100.3` (Bastion IP)
5.  확인을 누르고 CMD(명령 프롬프트)에서 접속을 테스트합니다.
    ```cmd
    nslookup shop.mall.local
    # 응답으로 172.100.100.5, 6, 7 중 하나가 나오면 성공
    ```

---

## 3. Storage Host (`172.100.100.9`) - NFS 서버 설정

상품 이미지를 저장하고 여러 Pod가 공유할 수 있도록 NFS 서버를 구축합니다.

### 3.1 패키지 설치
```bash
sudo apt update
sudo apt install nfs-kernel-server -y
```

### 3.2 디렉토리 생성 및 권한 설정
```bash
sudo mkdir -p /export/images
# Nobody:Nogroup으로 설정하여 컨테이너에서의 접근 허용 (보안 요구사항에 따라 조정 가능)
sudo chown nobody:nogroup /export/images
sudo chmod 777 /export/images
```

### 3.3 공유 설정 (Exports)
`/etc/exports` 파일을 편집합니다.

```bash
sudo vim /etc/exports
```

**추가할 내용:**
```text
/export/images 172.100.100.0/24(rw,sync,no_subtree_check,no_root_squash)
```

### 3.4 적용
```bash
sudo exportfs -ra
sudo systemctl restart nfs-kernel-server
```

---

## 4. DB & Admin Host (`172.100.100.8`) - 데이터베이스 설정

Kubernetes 외부에서 운영되는 메인 데이터베이스입니다.

### 4.1 MySQL 설치 및 설정
```bash
sudo apt update
sudo apt install mysql-server -y
```

### 4.2 외부 접속 허용
`/etc/mysql/mysql.conf.d/mysqld.cnf` 파일을 수정하여 바인딩 주소를 변경합니다.
```ini
bind-address = 0.0.0.0
```
수정 후 재시작: `sudo systemctl restart mysql`

### 4.3 데이터베이스 및 유저 생성
MySQL에 접속(`sudo mysql`)하여 아래 명령어를 실행합니다.

```sql
-- 데이터베이스 생성
CREATE DATABASE shopping_admin;
CREATE DATABASE shopping_shop;

-- 유저 생성 및 권한 부여 (K8s 네트워크 대역에서의 접속 허용)
CREATE USER 'admin_user'@'%' IDENTIFIED BY 'password'; -- 비밀번호는 보안상 변경 권장
GRANT ALL PRIVILEGES ON shopping_admin.* TO 'admin_user'@'%';
GRANT ALL PRIVILEGES ON shopping_shop.* TO 'admin_user'@'%';

-- Root 계정 외부 접속 허용 (개발 환경용, 운영 환경에선 지양)
CREATE USER 'root'@'%' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON *.* TO 'root'@'%';

FLUSH PRIVILEGES;
```

---

## 5. Kubernetes Cluster - Ingress Controller 설치

도메인 기반 라우팅(`ingress.yaml`)이 작동하려면 클러스터에 Ingress Controller가 설치되어 있어야 합니다.

### 5.1 Nginx Ingress Controller 설치 (Cloud/Bare-metal 공용)
Master Node에서 실행:
```bash
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.2/deploy/static/provider/cloud/deploy.yaml
```

### 5.2 설치 확인
```bash
kubectl get pods -n ingress-nginx
# ingress-nginx-controller 파드가 Running 상태인지 확인
```

---

## 6. 트러블슈팅 (Troubleshooting)

*   **DNS가 안 될 때**: Windows 방화벽 혹은 Bastion 서버의 방화벽(`ufw`)이 53번 포트(UDP/TCP)를 막고 있는지 확인하세요.
*   **NFS 마운트 실패**: K8s Worker Node에 `nfs-common` 패키지가 설치되어 있는지 확인하세요 (`sudo apt install nfs-common`).
*   **DB 접속 불가**: DB Host(`100.8`)의 3306 포트가 열려 있는지(`telnet 172.100.100.8 3306`) 확인하세요.
