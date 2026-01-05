#!/bin/bash

# 프로젝트 루트 디렉토리로 이동 (스크립트 위치 기준 상위 2단계)
cd "$(dirname "$0")/../.."

# 색상 정의
GREEN='\033[0;32m'
NC='\033[0m'

echo -e "${GREEN}🚀 Kubernetes Shopping Mall 배포를 시작합니다 (Multi-Namespace 구조)...${NC}"

# 1. Namespace 생성
echo -e "${GREEN}Step 1: 네임스페이스 및 기본 리소스 배포${NC}"
kubectl apply -f k8s/base/00-namespaces.yaml

# 2. Secret 적용 (존재할 경우)
if [ -d "k8s/secrets" ]; then
    echo -e "${GREEN}Step 2: 사용자 정의 시크릿 배포${NC}"
    kubectl apply -f k8s/secrets/
else
    echo -e "⚠️  k8s/secrets 디렉토리가 없습니다. 템플릿을 사용하여 먼저 생성해 주세요."
fi

# 3. 인프라 배포 (Storage, MySQL, Ingress)
echo -e "${GREEN}Step 3: 인프라 서비스 배포 (NFS Storage, MySQL, Ingress)${NC}"
kubectl apply -f k8s/base/01-storage.yaml
kubectl apply -f k8s/mysql/
kubectl apply -f k8s/base/02-ingress.yaml

# 4. 애플리케이션 배포
echo -e "${GREEN}Step 4: 애플리케이션 배포 (Shop API, Frontend)${NC}"
kubectl apply -f k8s/apps/

echo -e "${GREEN}✅ 모든 리소스 배포 명령이 실행되었습니다.${NC}"
echo -e "⏳ 상태 확인: kubectl get pods -A"