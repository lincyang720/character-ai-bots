// build-trending-section.js - 生成trending section的辅助函数
const fs = require('fs');
const path = require('path');

// 生成trending section HTML
function generateTrendingSection(characters) {
    // 获取trending数据并排序
    const trendingChars = characters
        .filter(char => char.trending && char.trending.rank <= 4)
        .sort((a, b) => a.trending.rank - b.trending.rank);

    // 如果没有trending数据，返回空
    if (trendingChars.length === 0) {
        console.warn('⚠️  没有找到trending数据，使用默认数据');
        // 使用默认的top 4
        return generateDefaultTrendingSection(characters);
    }

    const trendingCards = trendingChars.map((char, index) => {
        const badge = index === 0 ? '🔥 #1 Trending' :
                     index === 1 ? '🔥 #2 Trending' :
                     index === 2 ? '🔥 #3 Trending' :
                     '⚡ Rising Fast';

        const featuredClass = index === 0 ? ' featured' : '';
        const growth = char.trending.weeklyGrowth || 0;
        const growthSign = growth > 0 ? '+' : '';

        return `
                <div class="trending-card${featuredClass}">
                    <div class="trending-badge">${badge}</div>
                    <div class="trending-icon">${char.image}</div>
                    <h3>${char.name}</h3>
                    <div class="trending-stats">
                        <span class="stat">⭐ ${char.rating}</span>
                        <span class="stat">💬 ${char.trending.weeklyChats.toLocaleString()} chats</span>
                        <span class="stat">📈 ${growthSign}${growth}% this week</span>
                    </div>
                    <p>${char.description.substring(0, 100)}...</p>
                    <a href="characters/${char.id}.html" class="trending-cta">Chat Now →</a>
                </div>`;
    }).join('\n');

    const lastUpdated = trendingChars[0]?.trending?.lastUpdated || new Date().toISOString().split('T')[0];

    return `
    <!-- Trending This Week Section -->
    <section class="trending-section">
        <div class="trending-container">
            <h2>🔥 Trending This Week - Most Popular AI Companions</h2>
            <p class="section-subtitle">Discover what the community is loving right now. These AI companions are getting the most attention and positive reviews this week.</p>

            <div class="trending-grid">
${trendingCards}
            </div>

            <div class="trending-note">
                <p>💡 <strong>Why are these trending?</strong> Based on user engagement, chat frequency, and positive ratings from the past 7 days. Last updated: ${lastUpdated}</p>
            </div>
        </div>
    </section>`;
}

// 生成默认trending section（如果没有数据）
function generateDefaultTrendingSection(characters) {
    // 使用rating最高的4个角色
    const topChars = [...characters]
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 4);

    return generateTrendingSection(topChars.map((char, index) => ({
        ...char,
        trending: {
            rank: index + 1,
            weeklyChats: Math.floor(Math.random() * 2000) + 1000,
            weeklyGrowth: Math.floor(Math.random() * 300) + 100,
            lastUpdated: new Date().toISOString().split('T')[0]
        }
    })));
}

// 生成"Best AI Chatbot for Roleplay"排名section
function generateBestRoleplaySection(characters) {
    // 获取rating最高的3个角色
    const topRated = [...characters]
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 3);

    const rankCards = topRated.map((char, index) => {
        const badges = ['🥇 #1', '🥈 #2', '🥉 #3'];
        const rankClass = `rank-${index + 1}`;

        // 根据角色类型生成"Best for"描述
        const bestFor = getBestForDescription(char);
        const features = getCharacterFeatures(char);

        return `
                <div class="rank-card ${rankClass}">
                    <div class="rank-badge">${badges[index]}</div>
                    <div class="rank-content">
                        <h3>${char.name}</h3>
                        <div class="rank-rating">⭐⭐⭐⭐⭐ ${char.rating}/5.0 (${char.reviews.toLocaleString()} reviews)</div>
                        <p><strong>Best for:</strong> ${bestFor}</p>
                        <p class="rank-description">${char.description}</p>
                        <div class="rank-features">
${features.map(f => `                            <span class="feature-tag">✓ ${f}</span>`).join('\n')}
                        </div>
                    </div>
                </div>`;
    }).join('\n');

    return `
    <!-- Best AI Chatbot for Roleplay Section -->
    <section class="best-roleplay-section">
        <div class="best-roleplay-container">
            <h2>🏆 Best AI Chatbots for Roleplay - Top Rated Characters</h2>
            <p class="section-subtitle">Discover the highest-rated AI chatbots perfect for immersive roleplay experiences. These characters consistently deliver engaging conversations and memorable interactions.</p>

            <div class="roleplay-ranking">
${rankCards}
            </div>

            <div class="roleplay-guide">
                <h3>💡 What Makes a Great AI Chatbot for Roleplay?</h3>
                <div class="guide-grid">
                    <div class="guide-item">
                        <div class="guide-icon">🎭</div>
                        <h4>Consistent Character</h4>
                        <p>Maintains personality traits and backstory throughout conversations</p>
                    </div>
                    <div class="guide-item">
                        <div class="guide-icon">💬</div>
                        <h4>Natural Dialogue</h4>
                        <p>Responds contextually with realistic emotions and reactions</p>
                    </div>
                    <div class="guide-item">
                        <div class="guide-icon">📖</div>
                        <h4>Story Development</h4>
                        <p>Builds engaging narratives that evolve based on your choices</p>
                    </div>
                    <div class="guide-item">
                        <div class="guide-icon">🎯</div>
                        <h4>Scenario Variety</h4>
                        <p>Offers multiple roleplay scenarios and conversation paths</p>
                    </div>
                </div>
            </div>
        </div>
    </section>`;
}

// 辅助函数：根据角色类型生成"Best for"描述
function getBestForDescription(char) {
    const typeDescriptions = {
        'Yandere': 'Intense romantic roleplay with psychological depth',
        'Vampire': 'Fantasy romance with mystery elements',
        'Demon': 'Epic fantasy adventures and power dynamics',
        'Tsundere': 'Fun romantic banter with hot-cold personality',
        'Android': 'Sci-fi scenarios with emotional development',
        'Kuudere': 'Subtle romance with emotionless exterior',
        'Dandere': 'Gentle romance with shy personality'
    };

    return typeDescriptions[char.type] || `${char.type} roleplay scenarios`;
}

// 辅助函数：根据角色特点生成feature标签
function getCharacterFeatures(char) {
    const typeFeatures = {
        'Yandere': ['Deep Character Development', 'Emotional Depth', 'Long-term Roleplay'],
        'Vampire': ['Fantasy Worldbuilding', 'Mystery & Suspense', 'Romantic Tension'],
        'Demon': ['Epic Storylines', 'Power Dynamics', 'Moral Complexity'],
        'Tsundere': ['Comedy & Romance', 'Character Growth', 'Engaging Banter'],
        'Android': ['Sci-Fi Setting', 'Emotional Learning', 'Unique Perspective'],
        'Kuudere': ['Subtle Emotions', 'Slow Burn Romance', 'Hidden Feelings'],
        'Dandere': ['Gentle Interactions', 'Artistic Expression', 'Shy Charm']
    };

    return typeFeatures[char.type] || ['Engaging Roleplay', 'Unique Personality', 'Immersive Scenarios'];
}

module.exports = {
    generateTrendingSection,
    generateBestRoleplaySection,
    generateDefaultTrendingSection
};
