#!/bin/bash
# 部署前检查脚本

echo "🔍 部署前检查..."
echo ""

# 检查必要文件
echo "📁 检查必要文件..."
files=(
    "spa.html"
    "ai-chatbot-secure.js"
    "ai-chatbot.css"
    "api/chat.js"
    "vercel.json"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✅ $file"
    else
        echo "  ❌ $file (缺失！)"
    fi
done

echo ""
echo "📋 检查清单："
echo ""
echo "部署前请确认："
echo "  1. 已登录 Vercel (运行: vercel login)"
echo "  2. Vercel 环境变量已配置 ZHIPU_API_KEY"
echo "  3. 本地文件已提交到 Git"
echo ""
echo "部署命令："
echo "  vercel --prod"
echo ""
