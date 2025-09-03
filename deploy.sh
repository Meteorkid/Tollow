#!/bin/bash

echo "🚀 开始构建打字练习网站..."

# 构建生产版本
echo "📦 构建生产版本..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ 构建成功！"
    echo "📁 构建文件位于 dist/ 目录"
    echo ""
    echo "🌐 部署说明："
    echo "1. 将 dist/ 目录中的所有文件上传到您的Web服务器"
    echo "2. 确保服务器支持单页应用路由"
    echo "3. 配置适当的MIME类型"
    echo ""
    echo "📱 本地预览："
    echo "运行 'npm run preview' 来预览生产版本"
else
    echo "❌ 构建失败，请检查错误信息"
    exit 1
fi
