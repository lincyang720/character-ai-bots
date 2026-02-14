#!/bin/bash
# daily-update.sh - 每日自动更新脚本

echo "🚀 开始每日更新流程..."
echo "================================"

# 1. 更新trending数据
echo "📊 步骤 1/3: 更新trending数据..."
node update-trending.js
if [ $? -ne 0 ]; then
    echo "❌ Trending数据更新失败"
    exit 1
fi

# 2. 重新生成HTML页面
echo "🔨 步骤 2/3: 重新生成HTML页面..."
node build-index.js
if [ $? -ne 0 ]; then
    echo "❌ HTML生成失败"
    exit 1
fi

# 3. 提交到git（可选）
echo "📝 步骤 3/3: 提交更新..."
git add index.html data/characters.json
git commit -m "Daily update: refresh trending data $(date +%Y-%m-%d)"

echo "================================"
echo "✅ 每日更新完成！"
echo "📅 更新时间: $(date)"
