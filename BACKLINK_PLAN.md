# 外链建设执行方案 - characteraibots.com

> 综合 web.cafe 社区实战经验 + 200+ 站点清单，按 ROI 排序

## 核心原则（来自 web.cafe 社区）

1. **每个落地页独立做外链**，不只是首页。你有 49 个角色页，每个都是独立的外链目标
2. **免费 → 互换 → 付费**，循序渐进
3. **外链先行，权重随后，流量最后**。持续发，不要等
4. **避坑**：aitoolhunt.com 付费后失联有人踩过坑，优先免费渠道

---

## 第一阶段：免费外链（第1-2周，目标 +50 条）

### Day 1-2: AI 工具目录站（最相关，优先级最高）

这些站大多支持 Google 登录 + 免费提交：

| 站点 | DA | 提交链接 | 备注 |
|------|-----|---------|------|
| There's An AI For That | 70+ | theresanaiforthat.com/submit/ | 最大AI目录 |
| Futurepedia | 65+ | futurepedia.io/submit-tool | AI工具发现 |
| Toolify.ai | 45+ | toolify.ai/submit | AI搜索引擎 |
| TopAI.tools | 45+ | topai.tools/submit | AI排行榜 |
| AI Valley | 40+ | aivalley.ai/submit-tool/ | AI工具集合 |
| ToolScout | 38+ | toolscout.ai/submit | AI发现 |
| AIToolMall | 35+ | aitoolmall.com/submit | AI商城 |
| Easy With AI | 35+ | easywithai.com/submit/ | AI工具 |
| Submit AI Tools | 30+ | submitaitools.com/ | 专门收录 |
| AI Tools Directory | 28+ | aitoolsdirectory.com/submit | AI目录 |

**提交内容用 `node backlink-tool.js content` 生成的短描述和长描述**

### Day 3-4: 产品发布平台

| 站点 | DA | 提交链接 | 备注 |
|------|-----|---------|------|
| Product Hunt | 90+ | producthunt.com/posts/new | PST 12:01AM 发布最佳 |
| BetaList | 75+ | betalist.com/submit | 新产品平台 |
| Indie Hackers | 85+ | indiehackers.com/products/new | 创业者社区 |
| AlternativeTo | 80+ | alternativeto.net/manage/new/ | 替代品平台 |
| SaaSworthy | 55+ | saasworthy.com/list-product | SaaS评测 |
| G2 | 90+ | g2.com/products/new | 软件评测 |

### Day 5-7: 社区帖子（高权重 dofollow）

| 平台 | 操作 | 备注 |
|------|------|------|
| Reddit r/CharacterAI | 发帖分享目录 | 最相关社区，帖子内容已生成 |
| Reddit r/SideProject | 分享项目 | 技术细节受欢迎 |
| Reddit r/AIToolsDirectory | 提交工具 | 直接相关 |
| V2EX ai-tools 节点 | 发帖 | web.cafe群友建的节点，欢迎发帖 |
| Hacker News | Show HN | 帖子内容已生成 |
| Dev.to | 写技术博客 | 博客大纲已生成 |

### Day 7-14: Web 2.0 Profile 外链

快速批量注册，在 bio/about 里放链接：
- Crunchbase, Gravatar, About.me, Linktree
- GitHub profile + README
- Medium profile
- Hashnode profile
- Quora profile + 回答相关问题

---

## 第二阶段：内容外链（第3-4周，目标 +30 条）

### 博客文章（每篇可获得 1-3 条外链）

在以下平台发布文章，文中自然插入链接：

1. **Medium** - "The Complete Guide to AI Roleplay Character Types"
2. **Dev.to** - "How I Built a Static AI Character Directory with Node.js"
3. **Hashnode** - "SEO Optimization for AI Tool Directories"

### 针对角色页的独立外链

web.cafe 社区强调：**每个落地页都要独立做外链**。

策略：在 Quora/Reddit 回答相关问题时，链接到具体角色页而不是首页：
- "What are the best yandere AI characters?" → 链接到 yandere 角色页
- "Best vampire AI chatbots?" → 链接到 vampire 角色页
- "Character.AI vs JanitorAI?" → 链接到平台对比内容

---

## 第三阶段：互换外链（第4周+）

### 找同类站点互换

1. 在 web.cafe 社区找做 AI 工具的群友互换
2. 找其他 AI 角色/chatbot 相关站点互换
3. 用 Ahrefs/SEMrush 查竞品的外链来源，逐个联系

### Guest Post

给 AI/chatbot 相关博客投稿，文中带链接：
- 目标：DA 30+ 的 AI 博客
- 主题："AI Roleplay Character Types Explained" 等

---

## 自动化工具使用

### 已有工具

```bash
# 查看今日该提交哪些站
node backlink-tool.js status

# 生成所有提交内容（复制粘贴即用）
node backlink-tool.js content

# 提交完标记进度
node backlink-tool.js mark producthunt

# 生成 Reddit 帖子
node backlink-tool.js reddit
```

### 推荐的 Chrome 插件（来自 web.cafe 社区）

1. **BacklinkHelper** - SEO 外链效能插件，支持飞书/Google Sheets 同步
2. **AIPex** - 浏览器自动化发外链
3. **快速添加博客外链插件** - 自动生成博客评论

### Backlink Dirs (backlinkdirs.com)

web.cafe 社区推荐的外链聚合平台，筛选 Free 标签找免费提交站点。

---

## 进度追踪

用 `node backlink-tool.js status` 追踪，或者在 data/backlink-progress.json 里查看。

目标：
- 第2周末：+50 条外链（从 30 → 80）
- 第4周末：+80 条外链（→ 110）
- 第8周末：+120 条外链（→ 150）

---

## 避坑提醒

1. ❌ aitoolhunt.com 付费提交有人反馈失联，先别花钱
2. ❌ 不要买垃圾外链，宁可少但质量高
3. ✅ 免费站点优先，大多数 AI 目录站都支持免费提交
4. ✅ 发外链同时持续上内页，两手抓效果最好
5. ✅ 付费外链投大站（如 Product Hunt featured），小站会自动采集传播
