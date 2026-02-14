# 动态更新实现指南

## 🎯 目标

在保持SSR（服务器端渲染）的前提下，实现"本周热门"、"trending"等动态数据的定期更新。

---

## 📋 实现方案

### 核心思路

**数据驱动 + 定期重建**
- 所有动态数据存储在 `data/characters.json`
- 定期运行脚本更新数据
- 重新生成静态HTML
- 完全保持SSR，无需客户端JavaScript

---

## 🔧 技术实现

### 1. 数据结构扩展

在 `characters.json` 中为每个角色添加trending字段：

```json
{
  "id": "yandere-librarian",
  "name": "Yandere Librarian",
  "trending": {
    "rank": 1,
    "weeklyChats": 2847,
    "weeklyGrowth": 342,
    "lastUpdated": "2026-02-11"
  },
  "stats": {
    "totalChats": 15234,
    "lastWeekChats": 2505,
    "monthlyViews": 8932
  }
}
```

### 2. 更新脚本

**文件**: `update-trending.js`

**功能**:
- 读取 `characters.json`
- 更新trending数据（模拟或从GA获取）
- 计算排名和增长率
- 保存回JSON文件

**运行**:
```bash
node update-trending.js
```

### 3. 构建辅助函数

**文件**: `build-trending-section.js`

**功能**:
- 从JSON读取trending数据
- 生成trending section HTML
- 生成best roleplay section HTML
- 自动处理缺失数据

### 4. 自动化脚本

**文件**: `daily-update.sh`

**功能**:
- 更新trending数据
- 重新生成HTML
- 提交到git

**运行**:
```bash
./daily-update.sh
```

---

## ⚙️ 自动化方案

### 方案A：Cron Job（服务器）

如果你有自己的服务器：

```bash
# 编辑crontab
crontab -e

# 添加每天凌晨2点运行
0 2 * * * cd /path/to/character-ai-bots && ./daily-update.sh >> /var/log/daily-update.log 2>&1

# 或者每周一更新
0 2 * * 1 cd /path/to/character-ai-bots && ./daily-update.sh >> /var/log/weekly-update.log 2>&1
```

### 方案B：GitHub Actions（推荐）

创建 `.github/workflows/daily-update.yml`:

```yaml
name: Daily Trending Update

on:
  schedule:
    # 每天UTC时间 02:00 运行（北京时间10:00）
    - cron: '0 2 * * *'
  workflow_dispatch: # 允许手动触发

jobs:
  update:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm install

      - name: Update trending data
        run: node update-trending.js

      - name: Rebuild HTML
        run: node build-index.js

      - name: Commit and push changes
        run: |
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git add index.html data/characters.json
          git diff --quiet && git diff --staged --quiet || git commit -m "Auto update: refresh trending data $(date +%Y-%m-%d)"
          git push
```

### 方案C：Vercel Cron Jobs

如果部署在Vercel，创建 `vercel.json`:

```json
{
  "crons": [{
    "path": "/api/update-trending",
    "schedule": "0 2 * * *"
  }]
}
```

然后创建 `api/update-trending.js`:

```javascript
const { exec } = require('child_process');

module.exports = async (req, res) => {
  // 验证请求来自Vercel
  if (req.headers['x-vercel-signature']) {
    exec('./daily-update.sh', (error, stdout, stderr) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      return res.status(200).json({
        message: 'Update completed',
        output: stdout
      });
    });
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
};
```

---

## 📊 数据来源选项

### 选项1：模拟数据（当前实现）

**优点**:
- 简单快速
- 无需外部API
- 适合演示

**缺点**:
- 不是真实数据
- 需要手动调整

**使用场景**: 网站初期，流量较小时

### 选项2：Google Analytics

**实现**:

```javascript
// 在 update-trending.js 中
const { BetaAnalyticsDataClient } = require('@google-analytics/data');

async function fetchRealAnalyticsData() {
  const analyticsDataClient = new BetaAnalyticsDataClient({
    keyFilename: 'path/to/service-account-key.json'
  });

  const [response] = await analyticsDataClient.runReport({
    property: `properties/${process.env.GA_PROPERTY_ID}`,
    dateRanges: [
      { startDate: '7daysAgo', endDate: 'today' },
      { startDate: '14daysAgo', endDate: '7daysAgo' }
    ],
    dimensions: [{ name: 'pagePath' }],
    metrics: [{ name: 'screenPageViews' }],
  });

  // 处理数据...
  return processAnalyticsData(response);
}
```

**配置**:
1. 在Google Cloud Console创建服务账号
2. 下载JSON密钥
3. 在GA中授权服务账号
4. 设置环境变量

### 选项3：自建数据库

**实现**:

```javascript
// 使用SQLite或其他轻量数据库
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('analytics.db');

async function trackCharacterView(characterId) {
  db.run(`
    INSERT INTO views (character_id, timestamp)
    VALUES (?, datetime('now'))
  `, [characterId]);
}

async function getWeeklyStats() {
  return new Promise((resolve, reject) => {
    db.all(`
      SELECT character_id, COUNT(*) as views
      FROM views
      WHERE timestamp >= datetime('now', '-7 days')
      GROUP BY character_id
      ORDER BY views DESC
    `, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}
```

---

## 🚀 快速开始

### 立即测试

```bash
# 1. 更新trending数据
node update-trending.js

# 2. 查看生成的数据
cat data/characters.json | grep -A 5 "trending"

# 3. 重新生成HTML（如果需要）
node build-index.js

# 4. 查看效果
open index.html
```

### 设置自动化（GitHub Actions）

```bash
# 1. 创建workflow目录
mkdir -p .github/workflows

# 2. 创建workflow文件
cat > .github/workflows/daily-update.yml << 'EOF'
name: Daily Trending Update

on:
  schedule:
    - cron: '0 2 * * *'
  workflow_dispatch:

jobs:
  update:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: node update-trending.js
      - run: node build-index.js
      - run: |
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git add -A
          git diff --quiet && git diff --staged --quiet || git commit -m "Auto update: $(date +%Y-%m-%d)"
          git push
EOF

# 3. 提交到GitHub
git add .github/workflows/daily-update.yml
git commit -m "Add daily auto-update workflow"
git push
```

---

## 📈 更新频率建议

| 内容类型 | 建议频率 | 原因 |
|---------|---------|------|
| Trending排名 | 每天 | 保持新鲜感，鼓励用户回访 |
| 增长率数据 | 每周 | 更稳定，避免波动太大 |
| 评分和评论数 | 实时或每小时 | 用户期望看到最新数据 |
| 新角色添加 | 按需 | 有新内容时手动触发 |

---

## 🔍 监控和调试

### 查看更新日志

```bash
# 查看最近的更新
git log --oneline --grep="Auto update" -10

# 查看trending数据变化
git diff HEAD~1 data/characters.json
```

### 测试更新流程

```bash
# 手动运行一次完整流程
./daily-update.sh

# 检查生成的HTML
grep -A 10 "Trending This Week" index.html

# 验证trending数据
node -e "console.log(JSON.parse(require('fs').readFileSync('data/characters.json')).filter(c => c.trending).slice(0, 3))"
```

---

## ⚠️ 注意事项

### 1. Git冲突

如果有手动修改和自动更新同时进行，可能产生冲突。

**解决方案**:
- 自动更新只修改特定字段（trending, stats）
- 手动修改其他字段（description, personality等）
- 使用分支策略

### 2. 数据一致性

确保trending数据的计算逻辑一致。

**建议**:
- 使用固定的计算公式
- 记录计算日志
- 定期审查数据合理性

### 3. 性能考虑

重新生成HTML可能需要时间。

**优化**:
- 只更新变化的部分
- 使用增量构建
- 考虑使用构建缓存

---

## 🎯 下一步优化

### 短期（1-2周）

1. **集成真实数据**
   - 设置Google Analytics
   - 实现数据获取API
   - 测试数据准确性

2. **优化更新逻辑**
   - 添加数据验证
   - 实现错误处理
   - 添加更新日志

### 中期（1-2月）

1. **增强功能**
   - 添加历史趋势图
   - 实现A/B测试
   - 个性化推荐

2. **性能优化**
   - 增量构建
   - CDN缓存策略
   - 图片优化

### 长期（3-6月）

1. **平台化**
   - 管理后台
   - 实时数据仪表板
   - 用户行为分析

---

## 📚 相关文件

- `update-trending.js` - 更新trending数据
- `build-trending-section.js` - 生成trending HTML
- `daily-update.sh` - 自动化更新脚本
- `data/character-schema-example.json` - 数据结构示例
- `.github/workflows/daily-update.yml` - GitHub Actions配置

---

## 💡 总结

这个方案的优势：

✅ **保持SSR** - 完全静态HTML，SEO友好
✅ **自动化** - 无需手动干预
✅ **灵活** - 可以使用模拟或真实数据
✅ **可扩展** - 易于添加新的动态内容
✅ **低成本** - 无需额外服务器或数据库

**关键点**: 数据存储在JSON → 定期更新 → 重新生成HTML → 保持SSR

---

*文档创建日期：2026-02-11*
*作者：Claude Sonnet 4.5*
