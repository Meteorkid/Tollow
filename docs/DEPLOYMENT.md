# 🚀 Tollow 部署指南

本文档详细介绍了如何部署 Tollow 打字练习应用，包括多种部署方式和环境配置。

## 📋 目录

- [环境要求](#环境要求)
- [快速开始](#快速开始)
- [Docker 部署](#docker-部署)
- [Kubernetes 部署](#kubernetes-部署)
- [手动部署](#手动部署)
- [环境配置](#环境配置)
- [监控和日志](#监控和日志)
- [故障排除](#故障排除)

## 🔧 环境要求

### 系统要求
- **操作系统**: Linux (推荐 Ubuntu 20.04+), macOS, Windows
- **内存**: 最少 2GB RAM，推荐 4GB+
- **存储**: 最少 10GB 可用空间
- **网络**: 支持 HTTP/HTTPS 访问

### 软件依赖
- **Node.js**: 18.x 或更高版本
- **npm**: 8.x 或更高版本
- **Docker**: 20.10+ (可选)
- **Docker Compose**: 2.0+ (可选)
- **Nginx**: 1.18+ (可选)

## 🚀 快速开始

### 1. 克隆项目
```bash
git clone https://github.com/your-username/tollow.git
cd tollow
```

### 2. 安装依赖
```bash
npm install
```

### 3. 构建应用
```bash
npm run build
```

### 4. 启动开发服务器
```bash
npm run dev
```

应用将在 `http://localhost:3000` 启动。

## 🐳 Docker 部署

### 单容器部署

#### 1. 构建镜像
```bash
docker build -t tollow:latest .
```

#### 2. 运行容器
```bash
docker run -d \
  --name tollow-app \
  -p 8080:8080 \
  -v $(pwd)/logs:/app/logs \
  tollow:latest
```

### 多服务部署

#### 1. 启动所有服务
```bash
docker-compose up -d
```

#### 2. 查看服务状态
```bash
docker-compose ps
```

#### 3. 查看日志
```bash
docker-compose logs -f tollow-app
```

#### 4. 停止服务
```bash
docker-compose down
```

### 生产环境优化

#### 1. 使用优化镜像
```bash
docker build -t tollow:production --target production-optimized .
```

#### 2. 配置资源限制
```yaml
# docker-compose.prod.yml
version: '3.8'
services:
  tollow-app:
    image: tollow:production
    deploy:
      resources:
        limits:
          memory: 1G
          cpus: '0.5'
        reservations:
          memory: 512M
          cpus: '0.25'
```

## ☸️ Kubernetes 部署

### 1. 创建命名空间
```bash
kubectl create namespace tollow
```

### 2. 应用配置
```bash
kubectl apply -f k8s/ -n tollow
```

### 3. 查看部署状态
```bash
kubectl get all -n tollow
```

### 4. 查看日志
```bash
kubectl logs -f deployment/tollow-app -n tollow
```

### 5. 扩缩容
```bash
kubectl scale deployment tollow-app --replicas=3 -n tollow
```

## 📦 手动部署

### 1. 构建应用
```bash
npm run build
```

### 2. 创建部署包
```bash
./scripts/deploy.sh -e production -v 1.0.0 -t manual
```

### 3. 上传到服务器
```bash
scp deploy-1.0.0.tar.gz user@server:/opt/tollow/
```

### 4. 在服务器上解压和部署
```bash
ssh user@server
cd /opt/tollow
tar -xzf deploy-1.0.0.tar.gz
cd 1.0.0
./deploy.sh
```

## ⚙️ 环境配置

### 环境变量

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `NODE_ENV` | `development` | 运行环境 |
| `VITE_APP_ENV` | `development` | 应用环境 |
| `VITE_API_BASE_URL` | `http://localhost:3000` | API 基础 URL |
| `VITE_ANALYTICS_ENABLED` | `true` | 是否启用分析 |
| `VITE_I18N_DEBUG` | `false` | 国际化调试模式 |

### 配置文件

#### Nginx 配置
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        root /var/www/tollow;
        try_files $uri $uri/ /index.html;
    }
    
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

#### PM2 配置
```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'tollow',
    script: 'npm',
    args: 'start',
    cwd: '/opt/tollow',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}
```

## 📊 监控和日志

### 应用监控

#### 1. 健康检查
```bash
curl http://localhost:8080/health
```

#### 2. 性能监控
- **Prometheus**: 指标收集
- **Grafana**: 数据可视化
- **Loki**: 日志聚合

#### 3. 日志管理
```bash
# 查看应用日志
docker-compose logs -f tollow-app

# 查看 Nginx 日志
docker-compose logs -f tollow-nginx

# 查看系统日志
journalctl -u tollow
```

### 监控端点

| 端点 | 说明 | 访问方式 |
|------|------|----------|
| `/health` | 健康检查 | GET |
| `/metrics` | 性能指标 | GET |
| `/nginx_status` | Nginx 状态 | GET |

## 🔍 故障排除

### 常见问题

#### 1. 应用无法启动
```bash
# 检查端口占用
netstat -tulpn | grep :8080

# 检查日志
docker-compose logs tollow-app

# 检查资源使用
docker stats tollow-app
```

#### 2. 性能问题
```bash
# 检查内存使用
free -h

# 检查磁盘空间
df -h

# 检查网络连接
netstat -i
```

#### 3. 国际化问题
```bash
# 检查语言包
ls -la public/locales/

# 检查浏览器语言设置
# 检查 localStorage 中的语言设置
```

### 调试模式

#### 1. 启用调试日志
```bash
export DEBUG=tollow:*
npm run dev
```

#### 2. 浏览器调试
```javascript
// 在浏览器控制台中
localStorage.setItem('tollow_debug', 'true')
location.reload()
```

#### 3. 网络调试
```bash
# 使用 curl 测试 API
curl -v http://localhost:8080/api/health

# 使用 wget 测试下载
wget --spider http://localhost:8080/health
```

## 📚 进阶配置

### 负载均衡

#### Nginx 负载均衡
```nginx
upstream tollow_backend {
    server 127.0.0.1:3001;
    server 127.0.0.1:3002;
    server 127.0.0.1:3003;
}

server {
    location / {
        proxy_pass http://tollow_backend;
    }
}
```

#### HAProxy 配置
```haproxy
backend tollow_backend
    balance roundrobin
    server app1 127.0.0.1:3001 check
    server app2 127.0.0.1:3002 check
    server app3 127.0.0.1:3003 check
```

### 缓存策略

#### Redis 缓存
```yaml
# docker-compose.yml
services:
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
```

#### CDN 配置
```nginx
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
    add_header Vary Accept-Encoding;
}
```

### 安全配置

#### SSL/TLS 配置
```nginx
server {
    listen 443 ssl http2;
    ssl_certificate /etc/ssl/certs/tollow.crt;
    ssl_certificate_key /etc/ssl/private/tollow.key;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
    ssl_prefer_server_ciphers off;
}
```

#### 安全头配置
```nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
```

## 🔄 更新和回滚

### 应用更新

#### 1. 构建新版本
```bash
npm run build
docker build -t tollow:1.0.1 .
```

#### 2. 部署新版本
```bash
docker-compose down
docker-compose up -d
```

#### 3. 验证部署
```bash
curl http://localhost:8080/health
```

### 回滚策略

#### 1. 自动回滚
```bash
# 如果健康检查失败，自动回滚
docker-compose down
docker tag tollow:previous tollow:latest
docker-compose up -d
```

#### 2. 手动回滚
```bash
# 回滚到指定版本
docker tag tollow:1.0.0 tollow:latest
docker-compose down
docker-compose up -d
```

## 📞 支持

如果您在部署过程中遇到问题，请：

1. 查看本文档的故障排除部分
2. 检查应用日志和系统日志
3. 在 GitHub Issues 中搜索相关问题
4. 创建新的 Issue 并提供详细信息

### 有用的链接

- [项目主页](https://github.com/your-username/tollow)
- [问题反馈](https://github.com/your-username/tollow/issues)
- [讨论区](https://github.com/your-username/tollow/discussions)
- [文档](https://github.com/your-username/tollow/wiki)

---

**注意**: 本文档会随着项目的发展持续更新，请确保使用最新版本。
