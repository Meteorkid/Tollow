[![License: MIT](https://img.shields.io/badge/license-MIT-blue)](./LICENSE)
[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)]()

# Tollow

> 像临摹字帖一样练打字 — 支持导入图书和文本文件的在线打字练习应用

## 功能

- **文件导入**：支持 `.txt` 和 `.epub` 格式文件上传（拖拽或选择）
- **实时打字练习**：边看文本边打字，光标在文字之前，像临摹字帖
- **实时统计**：WPM（每分钟词数）、准确率、错误数、耗时、进度条
- **错误检测**：实时高亮显示打字错误和正确字符
- **暂停/继续**：随时暂停练习，不影响进度
- **响应式设计**：桌面端、平板端、移动端自适应

## 技术栈

| 层 | 技术 |
|---|---|
| 前端框架 | React 18 + TypeScript |
| 构建工具 | Vite |
| 样式 | CSS3 + 响应式设计 |
| 文件处理 | FileReader API + epub.js |

## 快速开始

```bash
# 克隆仓库
git clone https://github.com/Meteorkid/Tollow.git
cd Tollow

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

访问 http://localhost:4000

### 构建生产版本

```bash
npm run build
```

## 使用方法

1. **上传文件**：拖拽或选择 `.txt` / `.epub` 文件
2. **开始练习**：点击"开始练习"按钮
3. **打字练习**：在输入框中开始打字，实时查看进度
4. **查看统计**：实时查看 WPM、准确率等数据
5. **完成练习**：完成后查看最终成绩

## 项目结构

```
Tollow/
├── public/
├── src/
│   ├── components/
│   │   ├── Header.tsx           # 页面头部
│   │   ├── FileUpload.tsx       # 文件上传组件
│   │   ├── TypingPractice.tsx   # 打字练习主界面
│   │   └── TypingStats.tsx      # 统计显示
│   ├── types.ts                 # TypeScript 类型定义
│   ├── App.tsx                  # 主应用组件
│   ├── main.tsx                 # 应用入口
│   └── index.css                # 全局样式
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 核心功能

### 文件上传
- 支持拖拽上传
- 自动识别文件格式（txt / epub）
- 错误处理和用户提示

### 打字练习
- 实时字符对比
- 错误高亮显示
- 进度跟踪
- 暂停/继续功能

### 统计功能
- WPM（每分钟词数）
- 准确率计算
- 错误统计
- 时间记录
- 进度条显示

## 响应式支持

| 端 | 体验 |
|---|---|
| 桌面端 | 完整功能体验 |
| 平板端 | 适配中等屏幕 |
| 移动端 | 优化触摸操作 |

## 未来计划

- [ ] 用户账户系统
- [ ] 练习历史记录
- [ ] 更多文件格式支持
- [ ] 社交功能
- [ ] 排行榜系统

## License

[MIT](LICENSE)
