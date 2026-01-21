#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// 读取角色数据
const charactersData = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'data', 'characters.json'), 'utf8')
);

// 创建输出目录
const outputDir = path.join(__dirname, 'characters');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// 角色详情页模板
function generateCharacterPage(character) {
  const relatedCharacters = charactersData
    .filter(c => c.id !== character.id && (
      c.type === character.type ||
      c.tags.some(tag => character.tags.includes(tag))
    ))
    .slice(0, 3);

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${character.name} - ${character.type} AI Roleplay Bot</title>
    <meta name="description" content="${character.description.substring(0, 140)} Free ${character.type.toLowerCase()} AI character bot for roleplay on Character.AI, JanitorAI & SpicyChat.">
    <meta name="keywords" content="${character.tags.join(', ')}, ${character.type.toLowerCase()} ai bot, ${character.name.toLowerCase()}, character ai bots, ai roleplay">

    <!-- Open Graph -->
    <meta property="og:title" content="${character.name} - ${character.type} AI Roleplay Bot">
    <meta property="og:description" content="${character.description}">
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://characteraibots.com/characters/${character.id}.html">
    <meta property="og:image" content="https://characteraibots.com/images/og-image.jpg">
    <meta property="og:site_name" content="Character AI Bots">

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${character.name} - ${character.type} AI Roleplay Bot">
    <meta name="twitter:description" content="${character.description}">
    <meta name="twitter:image" content="https://characteraibots.com/images/og-image.jpg">

    <link rel="stylesheet" href="../style.css">
    <link rel="canonical" href="https://characteraibots.com/characters/${character.id}.html">

    <!-- Schema.org Structured Data -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "CreativeWork",
      "name": "${character.name}",
      "description": "${character.description}",
      "genre": "${character.type}",
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "${character.rating}",
        "reviewCount": "${character.reviews}",
        "bestRating": "5",
        "worstRating": "1"
      }
    }
    </script>
</head>
<body>
    <header>
        <nav>
            <div class="logo"><a href="../index.html" style="color: white; text-decoration: none;" title="Character AI Bots Home">🤖 Character AI Bots</a></div>
            <ul class="nav-links">
                <li><a href="../index.html" title="Character AI Bots Home">Home</a></li>
                <li><a href="../search.html" title="Search Character AI Bots">Search</a></li>
            </ul>
        </nav>
    </header>

    <main>

    <section class="character-detail-hero">
        <div class="character-detail-content">
            <div class="character-icon-large">${character.image}</div>
            <h1>${character.name}</h1>
            <p class="character-subtitle">${character.displayName}</p>
            <div class="character-meta">
                <span class="badge">${character.type}</span>
                <span class="badge">${character.category}</span>
                <span class="badge difficulty-${character.difficulty.toLowerCase()}">${character.difficulty}</span>
            </div>
            <div class="rating-display">
                <span class="stars">${'⭐'.repeat(Math.round(character.rating))}</span>
                <span class="rating-text">${character.rating}/5.0 (${character.reviews} reviews)</span>
            </div>
        </div>
    </section>

    <section class="character-detail-main">
        <div class="detail-container">
            <div class="detail-content">
                <h2>About ${character.name}</h2>
                <p class="description">${character.description}</p>

                <h3>Personality Traits</h3>
                <div class="traits-grid">
                    ${character.personality.map(trait => `<span class="trait-badge">${trait}</span>`).join('')}
                </div>

                <h3>Roleplay Scenarios</h3>
                <ul class="scenarios-list">
                    ${character.scenarios.map(scenario => `<li>${scenario}</li>`).join('')}
                </ul>

                <h3>Tags</h3>
                <div class="tags-container">
                    ${character.tags.map(tag => `<span class="tag">#${tag}</span>`).join('')}
                </div>

                <h3>Where to Chat</h3>
                <div class="platform-buttons">
                    ${Object.entries(character.platforms).map(([platform, url]) => `
                        <a href="${url}" target="_blank" rel="nofollow" class="platform-btn" title="Chat with ${character.name} on ${platform === 'characterai' ? 'Character.AI' : platform === 'janitorai' ? 'JanitorAI' : 'SpicyChat'}">
                            ${platform === 'characterai' ? 'Character.AI' :
                              platform === 'janitorai' ? 'JanitorAI' : 'SpicyChat'}
                        </a>
                    `).join('')}
                </div>

                <div class="cta-box">
                    <h3>Ready to Chat with ${character.name}?</h3>
                    <p>Start your conversation on any of the platforms above - completely free!</p>
                </div>
            </div>

            <aside class="detail-sidebar">
                <div class="sidebar-card">
                    <h3>Quick Info</h3>
                    <ul class="info-list">
                        <li><strong>Type:</strong> ${character.type}</li>
                        <li><strong>Category:</strong> ${character.category}</li>
                        <li><strong>Difficulty:</strong> ${character.difficulty}</li>
                        <li><strong>Popularity:</strong> ${character.popularity}/5.0</li>
                        <li><strong>Reviews:</strong> ${character.reviews}</li>
                    </ul>
                </div>

                <div class="sidebar-card">
                    <h3>Rate This Character</h3>
                    <div class="rating-widget">
                        <div class="stars-input">
                            <span class="star" data-rating="1">☆</span>
                            <span class="star" data-rating="2">☆</span>
                            <span class="star" data-rating="3">☆</span>
                            <span class="star" data-rating="4">☆</span>
                            <span class="star" data-rating="5">☆</span>
                        </div>
                        <button class="submit-rating">Submit Rating</button>
                    </div>
                </div>
            </aside>
        </div>
    </section>

    ${relatedCharacters.length > 0 ? `
    <section class="related-characters">
        <h2>Similar Characters</h2>
        <div class="characters-grid">
            ${relatedCharacters.map(char => `
                <a href="${char.id}.html" class="character-card" title="View ${char.name} - ${char.type} AI Roleplay Bot">
                    <div class="character-icon">${char.image}</div>
                    <h3>${char.name}</h3>
                    <p>${char.description.substring(0, 100)}...</p>
                    <div class="character-footer">
                        <span class="rating">⭐ ${char.rating}</span>
                        <span class="type-badge">${char.type}</span>
                    </div>
                </a>
            `).join('')}
        </div>
    </section>
    ` : ''}

    </main>

    <footer>
        <div class="footer-content">
            <div class="footer-section">
                <h4>Character AI Bots</h4>
                <p>Discover the best AI roleplay character bots across multiple platforms.</p>
            </div>
            <div class="footer-section">
                <h4>Quick Links</h4>
                <ul>
                    <li><a href="../index.html" title="Character AI Bots Home">Home</a></li>
                    <li><a href="../search.html" title="Search Character AI Bots">Search AI Bots</a></li>
                </ul>
            </div>
        </div>
        <div class="footer-bottom">
            <p>&copy; 2026 Character AI Bots. For entertainment purposes only.</p>
        </div>
    </footer>

    <script src="../js/rating.js"></script>
</body>
</html>`;
}

// 生成所有角色页面
console.log('Generating character pages...');
charactersData.forEach(character => {
  const html = generateCharacterPage(character);
  const filename = path.join(outputDir, `${character.id}.html`);
  fs.writeFileSync(filename, html);
  console.log(`✓ Generated: ${character.id}.html`);
});

console.log(`\n✅ Successfully generated ${charactersData.length} character pages!`);
console.log(`📁 Output directory: ${outputDir}`);
