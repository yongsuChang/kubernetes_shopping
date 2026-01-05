#!/bin/bash

echo "🚀 Starting Kubernetes resource cleanup..."

# 애플리케이션 삭제
kubectl delete -f k8s/apps/ --ignore-not-found

# 인프라 삭제 (Ingress, Storage, MySQL)
kubectl delete -f k8s/base/02-ingress.yaml --ignore-not-found
kubectl delete -f k8s/mysql/ --ignore-not-found
kubectl delete -f k8s/base/01-storage.yaml --ignore-not-found

# 시크릿 삭제 (secrets 폴더가 있다면)
kubectl delete -f k8s/secrets/ --ignore-not-found 2>/dev/null

# 네임스페이스 삭제
kubectl delete -f k8s/base/00-namespaces.yaml --ignore-not-found

echo "✅ Kubernetes cleanup completed."
