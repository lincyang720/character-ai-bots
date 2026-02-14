# 真实数据追踪方案

## 🎯 问题

当前的trending数据是模拟的，不够真实。需要追踪其他网站（Character.AI, JanitorAI等）的真实数据。

---

## 📊 数据来源策略

### 方案1：追踪Character.AI等平台（推荐）

#### 可追踪的指标

1. **Character.AI平台**
   - 角色的对话次数（通过页面显示）
   - 评分和评论数
   - 创建者信息
   - 最后更新时间

2. **JanitorAI平台**
   - 角色热度
   - 用户评分
   - 聊天次数

3. **SpicyChat平台**
   - 角色流行度
   - 用户互动数据

#### 实现方式

**A. 使用Puppeteer爬取**

```javascript
// scrape-character-data.js
const puppeteer = require('puppeteer');
const fs = require('fs');

// 爬取Character.AI的角色数据
async function scrapeCharacterAI(characterUrl) {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox']
    });

    try {
        const page = await browser.newPage();

        // 设置User-Agent避免被识别为bot
        await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36');

        console.log(`📡 正在爬取: ${characterUrl}`);
        await page.goto(characterUrl, { waitUntil: 'networkidle2', timeout: 30000 });

        // 等待页面加载
        await page.waitForTimeout(2000);

        // 提取数据
        const data = await page.evaluate(() => {
            // 这里的选择器需要根据实际页面结构调整
            const getTextContent = (selector) => {
                const element = document.querySelector(selector);
                return element ? element.textContent.trim() : null;
            };

            const getNumber = (text) => {
                if (!text) return 0;
                // 提取数字，支持 "1.2K", "3.5M" 等格式
                const match = text.match(/([0-9.]+)([KMB]?)/);
                if (!match) return 0;

                const num = parseFloat(match[1]);
                const suffix = match[2];

                switch(suffix) {
                    case 'K': return Math.floor(num * 1000);
                    case 'M': return Math.floor(num * 1000000);
                    case 'B': return Math.floor(num * 1000000000);
                    default: return Math.floor(num);
                }
            };

            return {
                // 根据Character.AI的实际HTML结构调整这些选择器
                chats: getNumber(getTextContent('[data-testid="chat-count"]') ||
                                 getTextContent('.chat-count') ||
                                 getTextContent('span:contains("chats")')),
                rating: parseFloat(getTextContent('[data-testid="rating"]') ||
                                  getTextContent('.rating') || '0'),
                reviews: getNumber(getTextContent('[data-testid="review-count"]') ||
                                  getTextContent('.review-count') || '0'),
                lastUpdated: new Date().toISOString().split('T')[0]
            };
        });

        console.log(`✅ 爬取成功:`, data);
        return data;

    } catch (error) {
        console.error(`❌ 爬取失败: ${error.message}`);
        return null;
    } finally {
        await browser.close();
    }
}

// 爬取所有角色的数据
async function scrapeAllCharacters() {
    const charactersPath = './data/characters.json';
    const characters = JSON.parse(fs.readFileSync(charactersPath, 'utf8'));

    console.log(`🚀 开始爬取 ${characters.length} 个角色的数据...`);

    for (let i = 0; i < characters.length; i++) {
        const char = characters[i];

        // 如果有Character.AI链接，爬取数据
        if (char.platforms && char.platforms.characterai) {
            console.log(`\n[${i + 1}/${characters.length}] ${char.name}`);

            const scrapedData = await scrapeCharacterAI(char.platforms.characterai);

            if (scrapedData) {
                // 更新trending数据
                if (!char.trending) char.trending = {};
                if (!char.stats) char.stats = {};

                // 计算增长率
                const lastWeekChats = char.stats.lastWeekChats || scrapedData.chats;
                const growth = lastWeekChats > 0 ?
                    Math.floor(((scrapedData.chats - lastWeekChats) / lastWeekChats) * 100) : 0;

                char.trending.weeklyChats = scrapedData.chats;
                char.trending.weeklyGrowth = growth;
                char.trending.lastUpdated = scrapedData.lastUpdated;

                char.stats.totalChats = scrapedData.chats;
                char.stats.lastWeekChats = scrapedData.chats;

                // 更新评分和评论数
                if (scrapedData.rating > 0) char.rating = scrapedData.rating;
                if (scrapedData.reviews > 0) char.reviews = scrapedData.reviews;
            }

            // 延迟避免被封IP
            await new Promise(resolve => setTimeout(resolve, 3000 + Math.random() * 2000));
        }
    }

    // 计算排名
    const sortedByChats = [...characters]
        .filter(c => c.trending && c.trending.weeklyChats)
        .sort((a, b) => b.trending.weeklyChats - a.trending.weeklyChats);

    sortedByChats.forEach((char, index) => {
        const originalChar = characters.find(c => c.id === char.id);
        if (originalChar.trending) {
            originalChar.trending.rank = index + 1;
        }
    });

    // 保存更新后的数据
    fs.writeFileSync(charactersPath, JSON.stringify(characters, null, 2), 'utf8');

    console.log('\n✅ 所有数据爬取完成！');
    console.log(`📊 成功更新 ${sortedByChats.length} 个角色的trending数据`);

    return characters;
}

// 运行
if (require.main === module) {
    scrapeAllCharacters()
        .then(() => process.exit(0))
        .catch(error => {
            console.error('Error:', error);
            process.exit(1);
        });
}

module.exports = { scrapeCharacterAI, scrapeAllCharacters };
```

**安装依赖**:
```bash
npm install puppeteer
```

**B. 使用Cheerio（更轻量）**

如果页面是服务器渲染的，可以用Cheerio：

```javascript
// scrape-with-cheerio.js
const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeWithCheerio(url) {
    try {
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
            }
        });

        const $ = cheerio.load(response.data);

        // 根据实际HTML结构提取数据
        const data = {
            chats: parseInt($('.chat-count').text().replace(/[^0-9]/g, '')) || 0,
            rating: parseFloat($('.rating').text()) || 0,
            reviews: parseInt($('.review-count').text().replace(/[^0-9]/g, '')) || 0
        };

        return data;
    } catch (error) {
        console.error('Scraping error:', error.message);
        return null;
    }
}
```

---

### 方案2：使用官方API（如果有）

某些平台可能提供API：

```javascript
// api-fetcher.js
const axios = require('axios');

// Character.AI API（如果有公开API）
async function fetchCharacterAIAPI(characterId) {
    try {
        const response = await axios.get(
            `https://api.character.ai/v1/characters/${characterId}`,
            {
                headers: {
                    'Authorization': `Bearer ${process.env.CHARACTERAI_API_KEY}`
                }
            }
        );

        return {
            chats: response.data.num_interactions,
            rating: response.data.rating,
            reviews: response.data.num_reviews
        };
    } catch (error) {
        console.error('API error:', error.message);
        return null;
    }
}
```

---

### 方案3：追踪自己网站的数据

如果无法爬取其他网站，追踪用户在你网站上的行为：

```javascript
// track-own-data.js
const fs = require('fs');
const path = require('path');

// 简单的点击追踪
function trackCharacterClick(characterId) {
    const statsFile = path.join(__dirname, 'data', 'click-stats.json');

    let stats = {};
    if (fs.existsSync(statsFile)) {
        stats = JSON.parse(fs.readFileSync(statsFile, 'utf8'));
    }

    if (!stats[characterId]) {
        stats[characterId] = {
            clicks: 0,
            lastWeekClicks: 0,
            weeklyHistory: []
        };
    }

    stats[characterId].clicks++;

    fs.writeFileSync(statsFile, JSON.stringify(stats, null, 2));
}

// 每周汇总数据
function weeklyRollup() {
    const statsFile = path.join(__dirname, 'data', 'click-stats.json');
    const stats = JSON.parse(fs.readFileSync(statsFile, 'utf8'));

    Object.keys(stats).forEach(charId => {
        const weeklyClicks = stats[charId].clicks - stats[charId].lastWeekClicks;

        stats[charId].weeklyHistory.push({
            week: new Date().toISOString().split('T')[0],
            clicks: weeklyClicks
        });

        // 只保留最近12周的数据
        if (stats[charId].weeklyHistory.length > 12) {
            stats[charId].weeklyHistory.shift();
        }

        stats[charId].lastWeekClicks = stats[charId].clicks;
    });

    fs.writeFileSync(statsFile, JSON.stringify(stats, null, 2));
}
```

---

### 方案4：混合数据源

结合多个数据源：

```javascript
// hybrid-data-fetcher.js
async function fetchHybridData(character) {
    const sources = [];

    // 1. 尝试爬取Character.AI
    if (character.platforms.characterai) {
        const caiData = await scrapeCharacterAI(character.platforms.characterai);
        if (caiData) sources.push({ source: 'characterai', weight: 0.4, data: caiData });
    }

    // 2. 尝试爬取JanitorAI
    if (character.platforms.janitorai) {
        const janitorData = await scrapeJanitorAI(character.platforms.janitorai);
        if (janitorData) sources.push({ source: 'janitorai', weight: 0.3, data: janitorData });
    }

    // 3. 使用自己网站的点击数据
    const ownData = await getOwnClickData(character.id);
    if (ownData) sources.push({ source: 'own', weight: 0.3, data: ownData });

    // 加权平均
    if (sources.length === 0) return null;

    const totalWeight = sources.reduce((sum, s) => sum + s.weight, 0);
    const weightedChats = sources.reduce((sum, s) =>
        sum + (s.data.chats * s.weight), 0) / totalWeight;

    return {
        chats: Math.floor(weightedChats),
        sources: sources.map(s => s.source),
        confidence: sources.length / 3 // 数据源越多，置信度越高
    };
}
```

---

## 🛡️ 注意事项

### 法律和道德

1. **遵守robots.txt**
   ```javascript
   const robotsParser = require('robots-parser');

   async function checkRobots(url) {
       const robotsUrl = new URL('/robots.txt', url).href;
       const response = await axios.get(robotsUrl);
       const robots = robotsParser(robotsUrl, response.data);
       return robots.isAllowed(url, 'MyBot');
   }
   ```

2. **尊重服务条款**
   - 查看各平台的ToS
   - 不要过度爬取
   - 添加合理延迟

3. **使用合理的User-Agent**
   ```javascript
   headers: {
       'User-Agent': 'CharacterAIBots-Directory/1.0 (+https://characteraibots.com/about)'
   }
   ```

### 技术考虑

1. **反爬虫对策**
   - 使用代理IP池
   - 随机延迟
   - 模拟真实用户行为

2. **错误处理**
   ```javascript
   async function scrapeWithRetry(url, maxRetries = 3) {
       for (let i = 0; i < maxRetries; i++) {
           try {
               return await scrape(url);
           } catch (error) {
               if (i === maxRetries - 1) throw error;
               await new Promise(r => setTimeout(r, 5000 * (i + 1)));
           }
       }
   }
   ```

3. **数据验证**
   ```javascript
   function validateScrapedData(data) {
       if (!data) return false;
       if (data.chats < 0 || data.chats > 10000000) return false;
       if (data.rating < 0 || data.rating > 5) return false;
       return true;
   }
   ```

---

## 🚀 推荐实施方案

### 阶段1：初期（使用混合数据）

```javascript
// 优先级：自己网站数据 > 爬取数据 > 模拟数据
async function getCharacterTrendingData(character) {
    // 1. 首先使用自己网站的点击数据
    const ownData = await getOwnClickData(character.id);
    if (ownData && ownData.clicks > 100) {
        return calculateTrendingFromOwnData(ownData);
    }

    // 2. 尝试爬取外部数据（每周一次）
    const lastScrape = character.trending?.lastScrapeDate;
    const daysSinceLastScrape = lastScrape ?
        (Date.now() - new Date(lastScrape)) / (1000 * 60 * 60 * 24) : 999;

    if (daysSinceLastScrape > 7) {
        const scrapedData = await scrapeCharacterAI(character.platforms.characterai);
        if (scrapedData) {
            character.trending.lastScrapeDate = new Date().toISOString();
            return scrapedData;
        }
    }

    // 3. 使用上次的数据或模拟数据
    return character.trending || generateSimulatedData(character);
}
```

### 阶段2：成长期（主要使用爬取数据）

- 每天爬取top 10角色
- 每周爬取所有角色
- 使用缓存减少爬取频率

### 阶段3：成熟期（使用自己的数据）

- 主要依赖自己网站的数据
- 偶尔爬取验证
- 建立自己的数据权威性

---

## 📦 完整实施包

```bash
# 安装依赖
npm install puppeteer cheerio axios robots-parser

# 目录结构
scrapers/
├── character-ai-scraper.js
├── janitor-ai-scraper.js
├── spicychat-scraper.js
├── own-data-tracker.js
└── hybrid-fetcher.js

# 运行爬虫
node scrapers/hybrid-fetcher.js

# 更新trending
node update-trending.js --use-real-data

# 重新生成HTML
node build-index.js
```

---

## 💡 最佳实践

1. **从小规模开始**
   - 先爬取top 5角色
   - 验证数据准确性
   - 逐步扩大规模

2. **建立数据管道**
   ```
   爬取数据 → 验证 → 存储 → 计算trending → 生成HTML
   ```

3. **监控和告警**
   - 爬取失败率
   - 数据异常检测
   - 自动回退到备用方案

4. **透明度**
   - 在网站上说明数据来源
   - "Data aggregated from multiple sources"
   - 显示最后更新时间

---

需要我帮你实现具体的爬虫代码吗？我可以针对Character.AI的实际页面结构编写爬虫。

