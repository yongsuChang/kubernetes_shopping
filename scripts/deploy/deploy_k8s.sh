#!/bin/bash

# 프로젝트 루트 디렉토리로 이동
cd "$(dirname "$0")/../.."

# 색상 정의
GREEN='\033[0;32m'
NC='\033[0m'

echo -e "${GREEN}🚀 Kubernetes Shopping Mall 배포를 시작합니다...${NC}"

# 1. Namespace 및 기초 인프라 배포
echo -e "${GREEN}Step 1: 네임스페이스 및 기본 리소스 배포${NC}"
kubectl apply -f k8s/base/00-namespaces.yaml
kubectl apply -f k8s/base/01-metallb-config.yaml
kubectl apply -f k8s/base/02-storage.yaml

# 2. Secret 적용
if [ -d "k8s/secrets" ]; then
    echo -e "${GREEN}Step 2: 사용자 정의 시크릿 배포${NC}"
    kubectl apply -f k8s/secrets/
fi

# 3. 모니터링 시스템 배포 (PLG Stack)
echo -e "${GREEN}Step 3: 모니터링 시스템 배포 (Loki, Prometheus, Grafana, Node Exporter)${NC}"
kubectl apply -f k8s/monitoring/

# 4. 데이터베이스 배포
echo -e "${GREEN}Step 4: 데이터베이스 배포 및 외부 연결 설정${NC}"
kubectl apply -f k8s/mysql/

# 5. 애플리케이션 배포
echo -e "${GREEN}Step 5: 애플리케이션 배포 (Shop API, Frontend, Admin API)${NC}"
kubectl apply -f k8s/apps/

# 6. 트래픽 라우팅 (Ingress)
echo -e "${GREEN}Step 6: 트래픽 라우팅 설정 (Ingress Controller)${NC}"
kubectl apply -f k8s/base/03-ingress.yaml

echo -e "${GREEN}✅ 모든 리소스 배포 명령이 실행되었습니다.${NC}"
echo -e "⏳ 상태 확인: kubectl get pods -A"