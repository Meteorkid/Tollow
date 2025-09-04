# Tollow API 文档

## 概述

Tollow是一个现代化的打字练习平台，提供RESTful API接口用于前端应用和第三方集成。

## 基础信息

- **基础URL**: `https://api.tollow.com/v1`
- **认证方式**: Bearer Token (JWT)
- **数据格式**: JSON
- **字符编码**: UTF-8
- **API版本**: v1

## 认证

### 获取访问令牌

```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 3600,
    "user": {
      "id": "user_123",
      "email": "user@example.com",
      "username": "username",
      "role": "user"
    }
  }
}
```

### 刷新令牌

```http
POST /auth/refresh
Authorization: Bearer {refreshToken}
```

### 登出

```http
POST /auth/logout
Authorization: Bearer {accessToken}
```

## 用户管理

### 用户注册

```http
POST /users/register
Content-Type: application/json

{
  "username": "newuser",
  "email": "newuser@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

### 获取用户信息

```http
GET /users/profile
Authorization: Bearer {accessToken}
```

### 更新用户信息

```http
PUT /users/profile
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "username": "updatedusername",
  "bio": "Updated bio"
}
```

### 获取用户统计

```http
GET /users/{userId}/stats
Authorization: Bearer {accessToken}
```

## 打字练习

### 获取练习文本

```http
GET /practice/texts
Authorization: Bearer {accessToken}
Query Parameters:
  - category: string (optional)
  - difficulty: string (optional)
  - language: string (optional)
  - limit: number (optional, default: 10)
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "texts": [
      {
        "id": "text_123",
        "title": "示例文本",
        "content": "这是一个示例打字练习文本...",
        "category": "general",
        "difficulty": "beginner",
        "language": "zh-CN",
        "wordCount": 50,
        "estimatedTime": 120
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 100,
      "totalPages": 10
    }
  }
}
```

### 开始练习会话

```http
POST /practice/sessions
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "textId": "text_123",
  "mode": "practice", // practice, test, challenge
  "settings": {
    "showTimer": true,
    "showProgress": true,
    "soundEnabled": true
  }
}
```

### 提交练习结果

```http
POST /practice/sessions/{sessionId}/complete
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "wpm": 45.2,
  "accuracy": 98.5,
  "errors": 3,
  "timeSpent": 120,
  "completedAt": "2024-01-01T12:00:00Z"
}
```

### 获取练习历史

```http
GET /practice/sessions
Authorization: Bearer {accessToken}
Query Parameters:
  - page: number (optional, default: 1)
  - limit: number (optional, default: 20)
  - startDate: string (optional, ISO date)
  - endDate: string (optional, ISO date)
```

## 文件管理

### 上传文件

```http
POST /files/upload
Authorization: Bearer {accessToken}
Content-Type: multipart/form-data

Form Data:
  - file: File object
  - category: string (optional)
  - tags: string[] (optional)
  - description: string (optional)
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "file": {
      "id": "file_123",
      "filename": "document.txt",
      "size": 1024,
      "type": "text/plain",
      "url": "https://api.tollow.com/files/file_123",
      "uploadedAt": "2024-01-01T12:00:00Z"
    }
  }
}
```

### 获取文件列表

```http
GET /files
Authorization: Bearer {accessToken}
Query Parameters:
  - page: number (optional, default: 1)
  - limit: number (optional, default: 20)
  - category: string (optional)
  - tags: string[] (optional)
  - search: string (optional)
```

### 删除文件

```http
DELETE /files/{fileId}
Authorization: Bearer {accessToken}
```

## 统计分析

### 获取用户统计数据

```http
GET /analytics/user/{userId}
Authorization: Bearer {accessToken}
Query Parameters:
  - period: string (optional, daily, weekly, monthly, yearly)
  - startDate: string (optional, ISO date)
  - endDate: string (optional, ISO date)
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalSessions": 150,
      "totalTime": 7200,
      "averageWPM": 42.3,
      "averageAccuracy": 96.8,
      "bestWPM": 78.5,
      "totalWords": 15000
    },
    "trends": {
      "daily": [
        {
          "date": "2024-01-01",
          "sessions": 5,
          "wpm": 45.2,
          "accuracy": 97.1
        }
      ]
    },
    "performance": {
      "wpmDistribution": {
        "0-20": 5,
        "21-40": 25,
        "41-60": 80,
        "61-80": 35,
        "80+": 5
      }
    }
  }
}
```

### 获取排行榜

```http
GET /analytics/leaderboard
Query Parameters:
  - category: string (optional)
  - period: string (optional, daily, weekly, monthly)
  - limit: number (optional, default: 50)
```

## 内容管理

### 获取练习分类

```http
GET /content/categories
```

### 获取标签列表

```http
GET /content/tags
Query Parameters:
  - search: string (optional)
  - limit: number (optional, default: 100)
```

### 搜索内容

```http
GET /content/search
Query Parameters:
  - q: string (required)
  - type: string (optional, text, file, user)
  - category: string (optional)
  - tags: string[] (optional)
  - page: number (optional, default: 1)
  - limit: number (optional, default: 20)
```

## 通知系统

### 获取通知列表

```http
GET /notifications
Authorization: Bearer {accessToken}
Query Parameters:
  - page: number (optional, default: 1)
  - limit: number (optional, default: 20)
  - unreadOnly: boolean (optional, default: false)
```

### 标记通知为已读

```http
PUT /notifications/{notificationId}/read
Authorization: Bearer {accessToken}
```

### 标记所有通知为已读

```http
PUT /notifications/read-all
Authorization: Bearer {accessToken}
```

## 设置管理

### 获取用户设置

```http
GET /settings
Authorization: Bearer {accessToken}
```

### 更新用户设置

```http
PUT /settings
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "theme": "dark",
  "language": "zh-CN",
  "soundEnabled": true,
  "notifications": {
    "email": true,
    "push": false
  },
  "typingSettings": {
    "showTimer": true,
    "showProgress": true,
    "autoPause": true
  }
}
```

## 错误处理

### 错误响应格式

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "输入验证失败",
    "details": [
      {
        "field": "email",
        "message": "邮箱格式不正确"
      }
    ]
  }
}
```

### 常见错误代码

| 错误代码 | HTTP状态码 | 描述 |
|---------|-----------|------|
| `UNAUTHORIZED` | 401 | 未认证或令牌无效 |
| `FORBIDDEN` | 403 | 权限不足 |
| `NOT_FOUND` | 404 | 资源不存在 |
| `VALIDATION_ERROR` | 400 | 输入验证失败 |
| `RATE_LIMIT_EXCEEDED` | 429 | 请求频率超限 |
| `INTERNAL_ERROR` | 500 | 服务器内部错误 |

## 速率限制

API实施速率限制以防止滥用：

- **认证用户**: 1000 请求/小时
- **未认证用户**: 100 请求/小时
- **文件上传**: 10 文件/小时

超出限制时返回 `429 Too Many Requests` 状态码。

## 分页

支持分页的API端点使用以下查询参数：

- `page`: 页码（从1开始）
- `limit`: 每页数量（默认20，最大100）

响应中包含分页信息：

```json
{
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8,
    "hasNext": true,
    "hasPrev": false
  }
}
```

## 过滤和排序

### 过滤

使用查询参数进行过滤：

```http
GET /practice/texts?category=general&difficulty=beginner&language=zh-CN
```

### 排序

使用 `sort` 参数进行排序：

```http
GET /practice/texts?sort=createdAt:desc
GET /practice/texts?sort=title:asc
```

支持多字段排序：

```http
GET /practice/texts?sort=category:asc,createdAt:desc
```

## WebSocket API

### 实时打字练习

```javascript
const ws = new WebSocket('wss://api.tollow.com/v1/ws/practice');

ws.onopen = () => {
  // 加入练习房间
  ws.send(JSON.stringify({
    type: 'join',
    sessionId: 'session_123'
  }));
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  
  switch (data.type) {
    case 'typing_progress':
      // 处理打字进度更新
      break;
    case 'user_joined':
      // 处理用户加入
      break;
    case 'user_left':
      // 处理用户离开
      break;
  }
};
```

### 消息类型

| 类型 | 描述 | 数据格式 |
|------|------|----------|
| `join` | 加入练习房间 | `{ sessionId: string }` |
| `leave` | 离开练习房间 | `{ sessionId: string }` |
| `typing_progress` | 打字进度更新 | `{ userId: string, progress: number }` |
| `user_joined` | 用户加入通知 | `{ userId: string, username: string }` |
| `user_left` | 用户离开通知 | `{ userId: string, username: string }` |

## SDK和客户端库

### JavaScript/TypeScript

```bash
npm install @tollow/sdk
```

```typescript
import { TollowClient } from '@tollow/sdk';

const client = new TollowClient({
  baseURL: 'https://api.tollow.com/v1',
  accessToken: 'your-access-token'
});

// 获取练习文本
const texts = await client.practice.getTexts({
  category: 'general',
  difficulty: 'beginner'
});

// 开始练习会话
const session = await client.practice.startSession({
  textId: 'text_123',
  mode: 'practice'
});
```

### Python

```bash
pip install tollow-sdk
```

```python
from tollow import TollowClient

client = TollowClient(
    base_url='https://api.tollow.com/v1',
    access_token='your-access-token'
)

# 获取用户信息
user = client.users.get_profile()

# 上传文件
file = client.files.upload('document.txt', category='general')
```

## 更新日志

### v1.0.0 (2024-01-01)
- 初始API版本
- 用户认证和授权
- 打字练习核心功能
- 文件上传和管理
- 基础统计分析

### v1.1.0 (计划中)
- 实时协作功能
- 高级分析报告
- 第三方集成支持
- 移动端优化

## 支持

如需技术支持或有任何问题，请通过以下方式联系：

- **邮箱**: api-support@tollow.com
- **文档**: https://docs.tollow.com
- **GitHub**: https://github.com/tollow/tollow-api
- **状态页面**: https://status.tollow.com
