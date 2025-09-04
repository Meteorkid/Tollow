# 项目账户与默认凭据（开发环境）

> 仅用于本地/开发环境。强烈建议在生产环境中修改为强随机密码并启用访问控制。

## 数据库

- 服务: PostgreSQL
- 用户: `tollow_user`
- 密码: `tollow_password`
- 数据库: `tollow`
- 来源: `docker-compose.yml` → `tollow-postgres`

## 缓存

- 服务: Redis
- 认证: 默认无密码（开发环境）
- 端口: `6379`
- 来源: `docker-compose.yml` → `tollow-redis`

## 监控与可视化

- 服务: Grafana
  - 管理员用户: `admin`
  - 管理员密码: `admin`
  - 来源: `docker-compose.yml` → `GF_SECURITY_ADMIN_PASSWORD=admin`

- 服务: Prometheus / Alertmanager / Loki / Promtail
  - 默认无认证（开发环境）

## 应用与前端

- Web 应用（Vite 开发服务器）
  - 默认无登录系统（本仓库未内置固定账号）
  - 本地可能存有 `localStorage` 的 `tollow_user`（仅客户端数据，非真实账户体系）

## Nginx（生产镜像）

- 默认无基本认证；安全策略通过响应头（CSP/X-Frame-Options 等）控制。

---

## 修改与加固建议（强烈建议用于生产）

1. 修改 `docker-compose.yml` 中的以下变量：
   - `POSTGRES_USER` / `POSTGRES_PASSWORD`
   - `GF_SECURITY_ADMIN_PASSWORD`
2. 为 Redis 设置密码并在 compose 中注入 `requirepass`（或置于私网/安全组内）。
3. 为 Prometheus/Grafana/Alertmanager 配置反向代理与访问控制（IP 白名单/Basic Auth/OAuth）。
4. 应用层引入真实的用户体系与鉴权（本项目已预留服务接口与类型定义）。
5. 为 Nginx 增加 `basic_auth` 或接入单点登录；开启 HTTPS。

> 提醒：请勿将生产凭据提交到仓库。生产凭据建议放入 `.env` 或 CI/CD 的安全变量中管理。


