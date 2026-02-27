#!/usr/bin/env node

/**
 * 反链建设自动化工具
 * 
 * 功能：
 * 1. 批量检测目标站点是否可访问
 * 2. 自动生成针对不同平台的提交内容
 * 3. 追踪提交进度
 * 4. 生成 Reddit/HN/社区帖子内容
 * 
 * 用法：
 *   node backlink-tool.js check     - 检测所有目标站点可访问性
 *   node backlink-tool.js content   - 生成所有提交内容
 *   node backlink-tool.js reddit    - 生成 Reddit 帖子内容
 *   node backlink-tool.js status    - 查看提交进度
 *   node backlink-tool.js mark <id> - 标记某站点已提交
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const SITE_URL = 'https://www.characteraibots.com';
const SITE_NAME = 'Character AI Bots';
const PROGRESS_FILE = path.join(__dirname, 'data', 'backlink-progress.json');

// ============================================================
// 目标站点列表 - 按优先级和类型分类
// ============================================================

const TARGETS = [
  // --- Tier 1: 高权重 AI 工具目录（DA 40+）---
  { id: 'producthunt', name: 'Product Hunt', url: 'https://www.producthunt.com/', submitUrl: 'https://www.producthunt.com/posts/new', type: 'directory', tier: 1, da: 90, notes: '需要账号，最佳发布时间 PST 12:01AM' },
  { id: 'indiehackers', name: 'Indie Hackers', url: 'https://www.indiehackers.com/', submitUrl: 'https://www.indiehackers.com/products/new', type: 'community', tier: 1, da: 85, notes: '在 Products 板块发布' },
  { id: 'betalist', name: 'BetaList', url: 'https://betalist.com/', submitUrl: 'https://betalist.com/submit', type: 'directory', tier: 1, da: 75, notes: '填写在线表单' },
  { id: 'theresanai', name: "There's An AI For That", url: 'https://theresanaiforthat.com/', submitUrl: 'https://theresanaiforthat.com/submit/', type: 'ai-directory', tier: 1, da: 70, notes: '最大AI工具目录' },
  { id: 'futurepedia', name: 'Futurepedia', url: 'https://www.futurepedia.io/', submitUrl: 'https://www.futurepedia.io/submit-tool', type: 'ai-directory', tier: 1, da: 65, notes: 'AI工具发现平台' },
  { id: 'toolify', name: 'Toolify.ai', url: 'https://www.toolify.ai/', submitUrl: 'https://www.toolify.ai/submit', type: 'ai-directory', tier: 1, da: 45, notes: 'AI工具搜索引擎' },
  { id: 'topaitools', name: 'TopAI.tools', url: 'https://topai.tools/', submitUrl: 'https://topai.tools/submit', type: 'ai-directory', tier: 1, da: 45, notes: 'AI工具排行榜' },

  // --- Tier 2: 中权重目录和社区（DA 20-40）---
  { id: 'aitoolhunt', name: 'AI Tool Hunt', url: 'https://www.aitoolhunt.com/', submitUrl: 'https://www.aitoolhunt.com/submit', type: 'ai-directory', tier: 2, da: 50 },
  { id: 'aivalley', name: 'AI Valley', url: 'https://aivalley.ai/', submitUrl: 'https://aivalley.ai/submit-tool/', type: 'ai-directory', tier: 2, da: 40 },
  { id: 'toolscout', name: 'ToolScout', url: 'https://toolscout.ai/', submitUrl: 'https://toolscout.ai/submit', type: 'ai-directory', tier: 2, da: 38 },
  { id: 'aitoolmall', name: 'AIToolMall', url: 'https://www.aitoolmall.com/', submitUrl: 'https://www.aitoolmall.com/submit', type: 'ai-directory', tier: 2, da: 35 },
  { id: 'submitaitools', name: 'Submit AI Tools', url: 'https://submitaitools.com/', submitUrl: 'https://submitaitools.com/', type: 'ai-directory', tier: 2, da: 30 },
  { id: 'aitoolsdirectory', name: 'AI Tools Directory', url: 'https://aitoolsdirectory.com/', submitUrl: 'https://aitoolsdirectory.com/submit', type: 'ai-directory', tier: 2, da: 28 },
  { id: 'easywithai', name: 'Easy With AI', url: 'https://easywithai.com/', submitUrl: 'https://easywithai.com/submit/', type: 'ai-directory', tier: 2, da: 35 },
  { id: 'saasworthy', name: 'SaaSworthy', url: 'https://www.saasworthy.com/', submitUrl: 'https://www.saasworthy.com/list-product', type: 'directory', tier: 2, da: 55 },
  { id: 'g2', name: 'G2', url: 'https://www.g2.com/', submitUrl: 'https://www.g2.com/products/new', type: 'directory', tier: 2, da: 90, notes: '软件评测平台' },
  { id: 'alternativeto', name: 'AlternativeTo', url: 'https://alternativeto.net/', submitUrl: 'https://alternativeto.net/manage/new/', type: 'directory', tier: 2, da: 80, notes: '替代品发现平台' },
  { id: 'slashdot', name: 'Slashdot', url: 'https://slashdot.org/', submitUrl: 'https://slashdot.org/submission', type: 'community', tier: 2, da: 85 },

  // --- Tier 3: 社交/社区平台 ---
  { id: 'reddit-characterai', name: 'Reddit r/CharacterAI', url: 'https://www.reddit.com/r/CharacterAI/', type: 'social', tier: 1, da: 95, notes: '最相关的subreddit' },
  { id: 'reddit-aitoolsdir', name: 'Reddit r/AIToolsDirectory', url: 'https://www.reddit.com/r/AIToolsDirectory/', type: 'social', tier: 2, da: 95 },
  { id: 'reddit-sideproject', name: 'Reddit r/SideProject', url: 'https://www.reddit.com/r/SideProject/', type: 'social', tier: 2, da: 95 },
  { id: 'reddit-webdev', name: 'Reddit r/webdev', url: 'https://www.reddit.com/r/webdev/', type: 'social', tier: 3, da: 95 },
  { id: 'hackernews', name: 'Hacker News', url: 'https://news.ycombinator.com/', submitUrl: 'https://news.ycombinator.com/submit', type: 'social', tier: 2, da: 90, notes: 'Show HN 格式' },
  { id: 'devto', name: 'Dev.to', url: 'https://dev.to/', type: 'blog', tier: 2, da: 85, notes: '写技术博客文章' },
  { id: 'medium', name: 'Medium', url: 'https://medium.com/', type: 'blog', tier: 2, da: 95, notes: '写深度文章' },
  { id: 'hashnode', name: 'Hashnode', url: 'https://hashnode.com/', type: 'blog', tier: 2, da: 70, notes: '技术博客平台' },

  // --- Tier 4: 免费 Profile/Web 2.0 外链 ---
  { id: 'github-awesome', name: 'GitHub Awesome Lists', url: 'https://github.com/topics/awesome', type: 'github', tier: 2, da: 95, notes: '提PR到awesome-ai-tools等列表' },
  { id: 'crunchbase', name: 'Crunchbase', url: 'https://www.crunchbase.com/', submitUrl: 'https://www.crunchbase.com/add-new', type: 'profile', tier: 2, da: 90 },
  { id: 'angellist', name: 'AngelList/Wellfound', url: 'https://wellfound.com/', type: 'profile', tier: 2, da: 85 },
  { id: 'about-me', name: 'About.me', url: 'https://about.me/', type: 'profile', tier: 3, da: 80 },
  { id: 'gravatar', name: 'Gravatar', url: 'https://gravatar.com/', type: 'profile', tier: 3, da: 85 },
  { id: 'linktr', name: 'Linktree', url: 'https://linktr.ee/', type: 'profile', tier: 3, da: 80 },

  // --- Tier 5: 问答/论坛 ---
  { id: 'quora', name: 'Quora', url: 'https://www.quora.com/', type: 'qa', tier: 2, da: 90, notes: '回答character ai相关问题' },
  { id: 'stackexchange', name: 'Stack Exchange', url: 'https://stackexchange.com/', type: 'qa', tier: 3, da: 85 },
];

// ============================================================
// 提交内容模板
// ============================================================

function generateSubmissionContent() {
  return {
    // 短描述 (50-100 words)
    shortDesc: `Free directory of 50+ AI roleplay characters organized by personality type (yandere, tsundere, kuudere) and role (vampire, demon, knight). Find and compare characters across Character.AI, JanitorAI, and SpicyChat with detailed backstories, conversation examples, and roleplay tips. No signup required.`,

    // 长描述 (200-300 words)
    longDesc: `Character AI Bots is a curated directory of 50+ AI roleplay characters, each with detailed profiles including backstories, personality breakdowns, sample conversations, and platform-specific guides.

Unlike scrolling through endless bot lists on individual platforms, our directory lets you:

• Search by personality archetype — Find yandere, tsundere, kuudere, dandere, and 20+ other character types
• Browse by role — Vampire teachers, mafia bosses, android companions, witch mentors, and more
• Compare platforms — See which characters are available on Character.AI, JanitorAI, or SpicyChat, with pros/cons for each
• Get roleplay tips — Every character page includes proven strategies for better conversations
• Read sample dialogues — Preview how each character responds before you start chatting

The directory is completely free, requires no signup, and is regularly updated with new characters based on community feedback and trending archetypes.

Built for the growing community of AI roleplay enthusiasts who want a better way to discover characters that match their interests.

Visit: ${SITE_URL}`,

    // 关键词
    keywords: 'character ai, ai roleplay, ai chatbot directory, yandere ai, tsundere ai, character.ai bots, janitorai characters, spicychat bots, ai roleplay characters, interactive fiction, anime ai roleplay',

    // 分类建议
    categories: ['AI Tools', 'Chatbots', 'Entertainment', 'Directory', 'Gaming', 'AI Characters'],

    // 标语
    tagline: 'Discover the perfect AI roleplay character across every platform',
  };
}

// ============================================================
// Reddit/社区帖子模板
// ============================================================

function generateRedditPosts() {
  return [
    {
      subreddit: 'r/CharacterAI',
      title: 'I built a free directory to find AI roleplay characters by personality type',
      body: `Hey everyone! I got tired of scrolling through random bots trying to find specific character types, so I built a directory that organizes 50+ characters by personality archetype (yandere, tsundere, kuudere, etc.) and role.

Each character has:
- Detailed backstory and personality breakdown
- Sample conversation examples so you know what to expect
- Roleplay tips for getting the best responses
- Links to the character on Character.AI, JanitorAI, and SpicyChat

It's completely free and no signup needed: ${SITE_URL}

Would love feedback on what characters or features you'd want to see added!`,
      notes: 'Post during US peak hours (10am-2pm EST). Engage with every comment.',
    },
    {
      subreddit: 'r/SideProject',
      title: 'I built a Character AI directory with 50+ roleplay bots organized by personality type',
      body: `Been working on this side project — a searchable directory of AI roleplay characters.

The problem: Finding specific character types across Character.AI, JanitorAI, and SpicyChat means endless scrolling through random bots.

The solution: A curated directory organized by personality archetype and character role, with detailed profiles, sample conversations, and platform comparisons.

Tech stack: Static HTML generated from JSON data, hosted on Vercel. Simple but effective for SEO.

Check it out: ${SITE_URL}

Stats so far:
- 49 character profiles
- ~900 words per page (SEO optimized)
- JSON-LD structured data
- Mobile responsive

Happy to answer questions about the build or SEO approach!`,
      notes: 'Side project communities love technical details.',
    },
    {
      subreddit: 'r/AIToolsDirectory',
      title: 'Character AI Bots - Free directory of 50+ AI roleplay characters',
      body: `Just launched Character AI Bots — a free, curated directory of AI roleplay characters organized by personality type and role.

Features:
- 50+ characters with detailed profiles
- Search by personality type (yandere, tsundere, kuudere, etc.)
- Platform comparison (Character.AI vs JanitorAI vs SpicyChat)
- Roleplay tips and sample conversations
- No signup required

Link: ${SITE_URL}

Feedback welcome!`,
      notes: 'Keep it concise for directory subreddits.',
    },
    {
      target: 'Hacker News (Show HN)',
      title: 'Show HN: Character AI Bots – A directory of AI roleplay characters by personality type',
      body: `${SITE_URL}\n\nI built a searchable directory of 50+ AI roleplay characters organized by personality archetype. Each profile includes backstory, conversation examples, and platform-specific guides for Character.AI, JanitorAI, and SpicyChat.\n\nBuilt as a static site generated from JSON data, optimized for SEO with JSON-LD structured data. The character content is generated programmatically but curated for quality.`,
      notes: 'HN likes technical angles. Keep it factual.',
    },
  ];
}

// ============================================================
// 博客文章模板（用于 Dev.to / Medium / Hashnode）
// ============================================================

function generateBlogPosts() {
  return [
    {
      platform: 'Dev.to / Medium',
      title: 'How I Built an SEO-Optimized Static Site Directory with Node.js',
      outline: `
1. The problem: AI roleplay character discovery is fragmented
2. Architecture: JSON data → Node.js generator → Static HTML on Vercel
3. SEO strategy:
   - JSON-LD structured data (CreativeWork, FAQPage, BreadcrumbList)
   - Programmatic content enrichment (258 → 924 words/page)
   - Unique title/meta for every page
4. Results and lessons learned
5. Link to the project: ${SITE_URL}`,
      notes: 'Technical blog posts on Dev.to get dofollow backlinks. Include code snippets.',
    },
    {
      platform: 'Medium',
      title: 'The Ultimate Guide to AI Roleplay Characters: Types, Platforms, and Tips',
      outline: `
1. What is AI roleplay? (intro for newcomers)
2. Character personality types explained (yandere, tsundere, kuudere, etc.)
3. Platform comparison: Character.AI vs JanitorAI vs SpicyChat
4. Tips for better roleplay conversations
5. Where to find characters: ${SITE_URL}`,
      notes: 'Target long-tail keywords. This is a content marketing piece.',
    },
  ];
}

// ============================================================
// 工具函数
// ============================================================

function loadProgress() {
  try {
    return JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf8'));
  } catch {
    return {};
  }
}

function saveProgress(progress) {
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2));
}

function checkUrl(url) {
  return new Promise((resolve) => {
    const mod = url.startsWith('https') ? https : http;
    const req = mod.get(url, { timeout: 8000, headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      resolve({ status: res.statusCode, ok: res.statusCode < 400 });
    });
    req.on('error', () => resolve({ status: 0, ok: false }));
    req.on('timeout', () => { req.destroy(); resolve({ status: 0, ok: false }); });
  });
}

// ============================================================
// 命令处理
// ============================================================

async function cmdCheck() {
  console.log('🔍 检测目标站点可访问性...\n');
  const results = { accessible: [], failed: [] };

  for (const target of TARGETS) {
    const checkTarget = target.submitUrl || target.url;
    const result = await checkUrl(checkTarget);
    const icon = result.ok ? '✅' : '❌';
    console.log(`${icon} [${result.status || 'timeout'}] ${target.name} - ${checkTarget}`);
    if (result.ok) results.accessible.push(target);
    else results.failed.push(target);
  }

  console.log(`\n📊 结果: ${results.accessible.length} 可访问, ${results.failed.length} 不可访问`);
  console.log('\n可访问的站点（按优先级排序）:');
  results.accessible
    .sort((a, b) => a.tier - b.tier || b.da - a.da)
    .forEach(t => console.log(`  Tier ${t.tier} | DA ${t.da} | ${t.name}`));
}

function cmdContent() {
  const content = generateSubmissionContent();
  const posts = generateRedditPosts();
  const blogs = generateBlogPosts();

  console.log('='.repeat(60));
  console.log('📝 提交内容（复制粘贴即用）');
  console.log('='.repeat(60));

  console.log('\n--- 短描述 (用于目录站提交) ---');
  console.log(content.shortDesc);

  console.log('\n--- 长描述 (用于详细提交) ---');
  console.log(content.longDesc);

  console.log('\n--- 关键词 ---');
  console.log(content.keywords);

  console.log('\n--- 分类 ---');
  console.log(content.categories.join(', '));

  console.log('\n--- 标语 ---');
  console.log(content.tagline);

  console.log('\n' + '='.repeat(60));
  console.log('📱 Reddit/社区帖子');
  console.log('='.repeat(60));

  posts.forEach(post => {
    console.log(`\n--- ${post.subreddit || post.target} ---`);
    console.log(`标题: ${post.title}`);
    console.log(`内容:\n${post.body}`);
    if (post.notes) console.log(`⚠️ 注意: ${post.notes}`);
  });

  console.log('\n' + '='.repeat(60));
  console.log('📝 博客文章大纲');
  console.log('='.repeat(60));

  blogs.forEach(post => {
    console.log(`\n--- ${post.platform} ---`);
    console.log(`标题: ${post.title}`);
    console.log(`大纲: ${post.outline}`);
    if (post.notes) console.log(`⚠️ 注意: ${post.notes}`);
  });

  // 也写入文件方便复制
  const outputFile = path.join(__dirname, 'BACKLINK_CONTENT_READY.md');
  let md = `# 反链提交内容（即用版）\n\n生成时间: ${new Date().toISOString()}\n\n`;
  md += `## 目录站提交内容\n\n### 短描述\n${content.shortDesc}\n\n### 长描述\n${content.longDesc}\n\n### 关键词\n${content.keywords}\n\n### 分类\n${content.categories.join(', ')}\n\n### 标语\n${content.tagline}\n\n`;
  md += `## Reddit/社区帖子\n\n`;
  posts.forEach(post => {
    md += `### ${post.subreddit || post.target}\n\n**标题:** ${post.title}\n\n**内容:**\n\n${post.body}\n\n`;
    if (post.notes) md += `> ⚠️ ${post.notes}\n\n`;
  });
  md += `## 博客文章大纲\n\n`;
  blogs.forEach(post => {
    md += `### ${post.platform}\n\n**标题:** ${post.title}\n\n**大纲:**\n${post.outline}\n\n`;
    if (post.notes) md += `> ⚠️ ${post.notes}\n\n`;
  });

  fs.writeFileSync(outputFile, md);
  console.log(`\n✅ 内容已保存到: ${outputFile}`);
}

function cmdStatus() {
  const progress = loadProgress();
  const submitted = Object.keys(progress).filter(k => progress[k].submitted);
  const pending = TARGETS.filter(t => !progress[t.id]?.submitted);

  console.log('📊 反链建设进度\n');
  console.log(`已提交: ${submitted.length}/${TARGETS.length}`);
  console.log(`待提交: ${pending.length}\n`);

  if (submitted.length > 0) {
    console.log('✅ 已提交:');
    submitted.forEach(id => {
      const t = TARGETS.find(x => x.id === id);
      const p = progress[id];
      console.log(`  ${t?.name || id} - ${p.date} ${p.status ? `(${p.status})` : ''}`);
    });
  }

  console.log('\n⏳ 待提交（按优先级）:');
  pending
    .sort((a, b) => a.tier - b.tier || b.da - a.da)
    .forEach(t => console.log(`  Tier ${t.tier} | DA ${t.da} | ${t.name} ${t.submitUrl ? `→ ${t.submitUrl}` : ''}`));

  // 每日建议
  const today = pending.slice(0, 5);
  console.log('\n🎯 今日建议提交（5个）:');
  today.forEach(t => {
    console.log(`  → ${t.name}: ${t.submitUrl || t.url}`);
    if (t.notes) console.log(`    💡 ${t.notes}`);
  });
}

function cmdMark(id) {
  const progress = loadProgress();
  const target = TARGETS.find(t => t.id === id);
  if (!target) {
    console.log(`❌ 未找到站点: ${id}`);
    console.log('可用ID:', TARGETS.map(t => t.id).join(', '));
    return;
  }
  progress[id] = {
    submitted: true,
    date: new Date().toISOString().split('T')[0],
    name: target.name,
  };
  saveProgress(progress);
  console.log(`✅ 已标记 ${target.name} 为已提交`);
}

function cmdList() {
  console.log('📋 所有目标站点:\n');
  TARGETS
    .sort((a, b) => a.tier - b.tier || b.da - a.da)
    .forEach(t => {
      console.log(`[${t.id}] Tier ${t.tier} | DA ${t.da} | ${t.name}`);
      console.log(`  URL: ${t.submitUrl || t.url}`);
      console.log(`  类型: ${t.type}`);
      if (t.notes) console.log(`  备注: ${t.notes}`);
      console.log();
    });
}

// ============================================================
// Main
// ============================================================

const cmd = process.argv[2];
const arg = process.argv[3];

switch (cmd) {
  case 'check':
    cmdCheck();
    break;
  case 'content':
    cmdContent();
    break;
  case 'reddit':
    generateRedditPosts().forEach(post => {
      console.log(`\n${'='.repeat(50)}`);
      console.log(`📱 ${post.subreddit || post.target}`);
      console.log(`${'='.repeat(50)}`);
      console.log(`\n标题: ${post.title}\n`);
      console.log(post.body);
      if (post.notes) console.log(`\n⚠️ ${post.notes}`);
    });
    break;
  case 'status':
    cmdStatus();
    break;
  case 'mark':
    if (!arg) { console.log('用法: node backlink-tool.js mark <site-id>'); break; }
    cmdMark(arg);
    break;
  case 'list':
    cmdList();
    break;
  default:
    console.log(`
🔗 反链建设工具 - Character AI Bots

用法:
  node backlink-tool.js check     检测目标站点可访问性
  node backlink-tool.js content   生成所有提交内容（保存到文件）
  node backlink-tool.js reddit    生成 Reddit 帖子内容
  node backlink-tool.js list      列出所有目标站点
  node backlink-tool.js status    查看提交进度
  node backlink-tool.js mark <id> 标记站点已提交

建议流程:
  1. node backlink-tool.js content  → 生成提交内容
  2. node backlink-tool.js status   → 查看今日建议
  3. 手动提交到各平台
  4. node backlink-tool.js mark <id> → 标记完成
  5. 每天重复 5 个站点
`);
}
