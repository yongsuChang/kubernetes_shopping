#!/bin/bash

# 색상 정의
GREEN='\033[0;32m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Kubernetes Shopping Mall 배포를 시작합니다...${NC}"

# 1. Namespace 및 기본 리소스 (ConfigMap, Secret)
echo -e "${GREEN}Step 1: 기본 리소스 배포 (Namespace, ConfigMap, Secret, Ingress, Storage)${NC}"
kubectl apply -f k8s/base/base-resources.yaml
kubectl apply -f k8s/base/storage.yaml
kubectl apply -f k8s/base/ingress.yaml

# 2. 데이터베이스 (MySQL)
echo -e "${GREEN}Step 2: 데이터베이스 배포 (MySQL)${NC}"
kubectl apply -f k8s/mysql/mysql.yaml

# 3. 백엔드 애플리케이션
echo -e "${GREEN}Step 3: 백엔드 API 배포 (Admin API, Shop API)${NC}"
kubectl apply -f k8s/apps/admin-api.yaml
kubectl apply -f k8s/apps/shop-api.yaml

# 4. 프론트엔드 애플리케이션
echo -e "${GREEN}Step 4: 프론트엔드 배포 (React App)${NC}"
kubectl apply -f k8s/apps/frontend.yaml

echo -e "${GREEN}✅ 모든 리소스 배포 명령이 실행되었습니다.${NC}"
echo -e "${GREEN}⏳ 파드가 준비될 때까지 기다려 주세요: kubectl get pods -n shopping-mall -w${NC}"
