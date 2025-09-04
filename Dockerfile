# 多阶段构建 - 构建阶段
FROM node:20-alpine AS builder

# 设置工作目录
WORKDIR /app

# 确保在容器内按目标平台安装原生依赖（Docker Desktop on Apple Silicon -> linux/arm64）
ENV npm_config_platform=linux \
    npm_config_arch=arm64

# 复制package文件
COPY package*.json ./

# 安装依赖（忽略 dev 依赖并放宽 peer 依赖约束，跳过脚本以避免 Husky 钩子）
RUN npm ci --omit=dev --legacy-peer-deps --ignore-scripts && \
    npm rebuild esbuild && \
    npm cache clean --force

# 复制源代码
COPY . .

# 构建应用
RUN npm run build

# 生产阶段
FROM nginx:alpine AS production

# 安装必要的工具
RUN apk add --no-cache curl

# 直接使用仓库中的现有构建产物
COPY dist /usr/share/nginx/html

# 复制nginx配置
COPY nginx.conf /etc/nginx/nginx.conf

# 复制健康检查脚本
COPY docker/healthcheck.sh /usr/local/bin/healthcheck
RUN chmod +x /usr/local/bin/healthcheck

# 创建非root用户
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# 设置权限
RUN chown -R nextjs:nodejs /usr/share/nginx/html && \
    chown -R nextjs:nodejs /var/cache/nginx && \
    chown -R nextjs:nodejs /var/log/nginx && \
    chown -R nextjs:nodejs /etc/nginx/conf.d && \
    touch /var/run/nginx.pid && \
    chown -R nextjs:nodejs /var/run/nginx.pid

# 切换到非root用户
USER nextjs

# 暴露端口
EXPOSE 8080

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD healthcheck

# 启动nginx
CMD ["nginx", "-g", "daemon off;"]

# 开发阶段
FROM node:20-alpine AS development

# 设置工作目录
WORKDIR /app

# 复制package文件
COPY package*.json ./

# 安装所有依赖（包括开发依赖）
RUN npm install

# 复制源代码
COPY . .

# 暴露端口
EXPOSE 3000

# 启动开发服务器
CMD ["npm", "run", "dev"]

# 测试阶段
FROM node:20-alpine AS test

# 设置工作目录
WORKDIR /app

# 复制package文件
COPY package*.json ./

# 安装所有依赖
RUN npm install

# 复制源代码
COPY . .

# 运行测试
CMD ["npm", "test"]

# 构建优化阶段
FROM node:20-alpine AS build-optimized

# 设置工作目录
WORKDIR /app

# 确保在容器内按目标平台安装原生依赖
ENV npm_config_platform=linux \
    npm_config_arch=arm64

# 复制package文件
COPY package*.json ./

# 安装依赖（忽略 dev 依赖并放宽 peer 依赖约束，跳过脚本以避免 Husky 钩子）
RUN npm ci --omit=dev --legacy-peer-deps --ignore-scripts && \
    npm rebuild esbuild && \
    npm cache clean --force

# 复制源代码
COPY . .

# 设置环境变量
ENV NODE_ENV=production
ENV VITE_APP_ENV=production

# 构建应用
RUN npm run build

# 压缩构建产物
RUN npm install -g gzip-cli && \
    find /app/dist -name "*.js" -exec gzip -9 {} \; && \
    find /app/dist -name "*.css" -exec gzip -9 {} \; && \
    find /app/dist -name "*.html" -exec gzip -9 {} \;

# 生产优化阶段
FROM nginx:alpine AS production-optimized

# 安装必要的工具
RUN apk add --no-cache curl brotli

# 复制构建产物
COPY --from=build-optimized /app/dist /usr/share/nginx/html

# 复制nginx配置
COPY nginx.optimized.conf /etc/nginx/nginx.conf

# 复制健康检查脚本
COPY docker/healthcheck.sh /usr/local/bin/healthcheck
RUN chmod +x /usr/local/bin/healthcheck

# 创建非root用户
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# 设置权限
RUN chown -R nextjs:nodejs /usr/share/nginx/html && \
    chown -R nextjs:nodejs /var/cache/nginx && \
    chown -R nextjs:nodejs /var/log/nginx && \
    chown -R nextjs:nodejs /etc/nginx/conf.d && \
    touch /var/run/nginx.pid && \
    chown -R nextjs:nodejs /var/run/nginx.pid

# 切换到非root用户
USER nextjs

# 暴露端口
EXPOSE 8080

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD healthcheck

# 启动nginx
CMD ["nginx", "-g", "daemon off;"]
