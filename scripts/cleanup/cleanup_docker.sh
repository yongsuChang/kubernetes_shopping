#!/bin/bash

echo "🚀 Stopping and removing Docker Compose containers..."

docker compose down -v

# 미사용 이미지 정리 (선택 사항)
# docker image prune -f

echo "✅ Docker cleanup completed."
