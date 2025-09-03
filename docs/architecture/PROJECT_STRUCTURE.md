# 🏗️ Tollow项目架构说明

## 📁 目录结构

```
Tollow/
├── 📁 config/                 # 配置文件
│   ├── tsconfig.json         # TypeScript配置
│   ├── tsconfig.node.json    # Node.js TypeScript配置
│   └── vite.config.ts        # Vite构建配置
├── 📁 docs/                  # 项目文档
│   ├── 📁 architecture/      # 架构设计文档
│   ├── 📁 development/       # 开发相关文档
│   ├── 📁 deployment/        # 部署相关文档
│   └── 📁 features/          # 功能特性文档
├── 📁 public/                # 静态资源
│   ├── 📁 assets/            # 资源文件
│   ├── 📁 images/            # 图片文件
│   ├── sample-text.txt       # 示例文本
│   └── test.txt              # 测试文本
├── 📁 scripts/               # 脚本文件
│   ├── deploy.sh             # 部署脚本
│   └── start.sh              # 启动脚本
├── 📁 src/                   # 源代码
│   ├── 📁 core/              # 核心应用
│   │   ├── App.tsx           # 主应用组件
│   │   └── main.tsx          # 应用入口
│   ├── 📁 features/          # 功能模块
│   │   ├── 📁 typing/        # 打字练习功能
│   │   │   ├── TypingPractice.tsx
│   │   │   └── TypingStats.tsx
│   │   ├── 📁 library/       # 书籍库功能
│   │   │   └── BookLibrary.tsx
│   │   └── 📁 upload/        # 文件上传功能
│   │       └── FileUpload.tsx
│   ├── 📁 shared/            # 共享组件
│   │   └── 📁 layout/        # 布局组件
│   │       └── Header.tsx
│   ├── 📁 styles/            # 样式文件
│   │   ├── index.css         # 全局样式
│   │   ├── Header.css
│   │   ├── BookLibrary.css
│   │   ├── FileUpload.css
│   │   ├── TypingPractice.css
│   │   └── TypingStats.css
│   ├── 📁 types/             # 类型定义
│   │   └── index.ts
│   ├── 📁 utils/             # 工具函数
│   └── 📁 hooks/             # 自定义Hooks
├── 📁 dist/                  # 构建输出
├── .gitignore                # Git忽略文件
├── LICENSE                   # MIT开源许可证
├── README.md                 # 项目说明
└── package.json              # 项目配置
```

## 🎯 架构设计原则

### 1. **模块化设计**
- 按功能划分模块，每个功能独立
- 清晰的依赖关系，避免循环依赖
- 易于维护和扩展

### 2. **分层架构**
- **核心层**: 应用入口和主要逻辑
- **功能层**: 具体的业务功能实现
- **共享层**: 可复用的组件和工具
- **样式层**: 统一的样式管理

### 3. **路径别名**
使用TypeScript路径映射，提供清晰的导入路径：
```typescript
import { TypingPractice } from '@features/typing/TypingPractice'
import { Header } from '@shared/layout/Header'
import { styles } from '@styles/index.css'
```

## 🔧 技术架构

### 前端框架
- **React 18**: 现代化的UI库
- **TypeScript**: 类型安全的JavaScript
- **Vite**: 快速的构建工具

### 状态管理
- **React Hooks**: 组件状态管理
- **Context API**: 全局状态共享

### 样式方案
- **CSS3**: 原生样式，性能优秀
- **响应式设计**: 支持多设备

## 📚 文档体系

### 开发文档
- 功能开发说明
- 问题修复记录
- 代码优化说明

### 部署文档
- 部署流程说明
- 环境配置指南
- 脚本使用说明

### 架构文档
- 项目结构说明
- 设计原则说明
- 技术选型说明

## 🚀 开发流程

1. **功能开发**: 在对应功能目录下开发
2. **组件复用**: 将通用组件放在shared目录
3. **样式管理**: 统一在styles目录管理
4. **类型定义**: 在types目录定义接口
5. **工具函数**: 在utils目录添加工具

## 🔮 扩展计划

- [ ] 添加单元测试
- [ ] 集成状态管理库
- [ ] 添加国际化支持
- [ ] 集成CI/CD流程
- [ ] 添加性能监控
