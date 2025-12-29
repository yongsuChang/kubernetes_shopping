# Build stage
FROM node:20-alpine AS build
WORKDIR /app

# Install pnpm for faster builds
RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./
RUN pnpm install

COPY . .
RUN pnpm build

# Production stage
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
# Replace default nginx config if needed, but for SPA a simple copy is often enough
# For react-router, we might need a custom nginx.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
