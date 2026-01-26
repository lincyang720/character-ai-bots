#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// 读取角色数据
const charactersData = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'data', 'characters.json'), 'utf8')
);

// 生成角色卡片 HTML
function generateCharacterCards(characters) {
  return characters.map(char => `
    <a href="characters/${char.id}.html" class="character-card" title="View ${char.name} - ${char.type} AI Roleplay Bot">
        <div class="character-icon">${char.image}</div>
        <h3>${char.name}</h3>
        <p>${char.description.substring(0, 100)}...</p>
        <div class="character-footer">
            <span class="rating">⭐ ${char.rating}</span>
            <span class="type-badge">${char.type}</span>
        </div>
    </a>
  `).join('');
}

// 生成完整的 index.html
const indexHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-1JQKX49JMM"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());

      gtag('config', 'G-1JQKX49JMM');
    </script>

    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Character AI Bots - 50+ Free Roleplay Characters</title>
    <meta name="description" content="Discover 50+ character AI bots for free roleplay chat. Yandere, tsundere, vampire characters and more on Character.AI, JanitorAI & SpicyChat.">
    <meta name="keywords" content="character ai bots, ai roleplay characters, free ai chat bots, character.ai, janitorai, spicychat, yandere ai, tsundere bot">
    <meta name="google-site-verification" content="OPQH_dX0XnvAd0ODbk5cDms96DTDRcgDkwoFUZw_eHw" />

    <!-- Open Graph -->
    <meta property="og:title" content="Character AI Bots - 50+ Free Roleplay Characters">
    <meta property="og:description" content="Discover 50+ character AI bots for free roleplay chat. Yandere, tsundere, vampire characters and more!">
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://characteraibots.com/">
    <meta property="og:image" content="https://characteraibots.com/images/og-image.jpg">
    <meta property="og:site_name" content="Character AI Bots">

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="Character AI Bots - 50+ Free Roleplay Characters">
    <meta name="twitter:description" content="Discover 50+ character AI bots for free roleplay chat. Yandere, tsundere, vampire characters and more!">
    <meta name="twitter:image" content="https://characteraibots.com/images/og-image.jpg">

    <link rel="stylesheet" href="style.css">
    <link rel="canonical" href="https://characteraibots.com/">

    <!-- Schema.org Structured Data -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Character AI Bots",
      "url": "https://characteraibots.com/",
      "description": "Discover 50+ free character AI bots for roleplay on Character.AI, JanitorAI, and SpicyChat",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://characteraibots.com/search.html?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    }
    </script>
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": "Character AI Bots Collection",
      "description": "A curated list of 50+ AI roleplay character bots",
      "numberOfItems": ${charactersData.length},
      "itemListElement": ${JSON.stringify(charactersData.slice(0, 10).map((char, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "CreativeWork",
          "name": char.name,
          "description": char.description,
          "url": `https://characteraibots.com/characters/${char.id}.html`
        }
      })))}
    }
    </script>
</head>
<body>
    <header>
        <nav>
            <div class="logo">🤖 Character AI Bots</div>
            <ul class="nav-links">
                <li><a href="index.html" class="active" title="Character AI Bots Home">Home</a></li>
                <li><a href="search.html" title="Search Character AI Bots">Search</a></li>
            </ul>
        </nav>
    </header>

    <main>
    <section class="hero">
        <div class="hero-content">
            <h1>Discover 50+ Free Character AI Bots for Roleplay</h1>
            <p class="hero-subtitle">Explore the best AI roleplay characters on Character.AI, JanitorAI, and SpicyChat. Find yandere, tsundere, vampire bots and more!</p>
            <div class="hero-search">
                <input type="text" id="quick-search" placeholder="Search characters, types, or tags...">
                <button onclick="window.location.href='search.html'">🔍 Advanced Search</button>
            </div>
        </div>
    </section>

    <section class="filters">
        <div class="filter-container">
            <div class="filter-group">
                <label>Type:</label>
                <select id="type-filter">
                    <option value="">All Types</option>
                    <option value="Yandere">Yandere</option>
                    <option value="Tsundere">Tsundere</option>
                    <option value="Kuudere">Kuudere</option>
                    <option value="Dandere">Dandere</option>
                    <option value="Vampire">Vampire</option>
                    <option value="Fantasy">Fantasy</option>
                    <option value="Modern">Modern</option>
                    <option value="Sci-Fi">Sci-Fi</option>
                </select>
            </div>
            <div class="filter-group">
                <label>Difficulty:</label>
                <select id="difficulty-filter">
                    <option value="">All Levels</option>
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                </select>
            </div>
            <div class="filter-group">
                <label>Sort by:</label>
                <select id="sort-filter">
                    <option value="popularity">Popularity</option>
                    <option value="rating">Rating</option>
                    <option value="name">Name</option>
                    <option value="reviews">Most Reviewed</option>
                </select>
            </div>
        </div>
    </section>

    <section class="stats">
        <div class="stats-container">
            <div class="stat-card">
                <div class="stat-number">${charactersData.length}+</div>
                <div class="stat-label">Characters</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">3</div>
                <div class="stat-label">Platforms</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">100%</div>
                <div class="stat-label">Free</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">24/7</div>
                <div class="stat-label">Available</div>
            </div>
        </div>
    </section>

    <section class="characters-section">
        <h2>Browse All Character AI Bots</h2>
        <div id="characters-grid" class="characters-grid">
            ${generateCharacterCards(charactersData)}
        </div>
    </section>

    <section class="features">
        <h2>Why Choose Our Character AI Bots?</h2>
        <div class="features-grid">
            <div class="feature-card">
                <div class="feature-icon">🎭</div>
                <h3>50+ AI Roleplay Characters</h3>
                <p>From yandere to vampire bots, discover diverse character AI personalities for every roleplay style and preference.</p>
            </div>
            <div class="feature-card">
                <div class="feature-icon">🆓</div>
                <h3>100% Free AI Chat Bots</h3>
                <p>All character AI bots are completely free on Character.AI, JanitorAI, and SpicyChat platforms. No hidden fees.</p>
            </div>
            <div class="feature-card">
                <div class="feature-icon">⭐</div>
                <h3>Community Rated Bots</h3>
                <p>See real user ratings and reviews to find the best character AI bots for your roleplay needs.</p>
            </div>
            <div class="feature-card">
                <div class="feature-icon">🔍</div>
                <h3>Easy Character Discovery</h3>
                <p>Filter AI bots by type, difficulty, and tags to quickly find your perfect roleplay character match.</p>
            </div>
        </div>
    </section>

    <section class="cta-section">
        <div class="cta-content">
            <h2>Ready to Start Chatting with AI Bots?</h2>
            <p>Browse our collection of 50+ character AI bots and find your perfect roleplay companion today!</p>
            <button onclick="document.getElementById('characters-grid').scrollIntoView({behavior: 'smooth'})">
                Explore Character AI Bots
            </button>
        </div>
    </section>

    <section class="faq-section">
        <h2>Frequently Asked Questions About Character AI Bots</h2>
        <div class="faq-container">
            <div class="faq-item">
                <h3>What are Character AI Bots?</h3>
                <p>Character AI bots are artificial intelligence-powered chatbots designed for roleplay and conversation. These AI characters have unique personalities, backgrounds, and speaking styles. You can chat with them on platforms like Character.AI, JanitorAI, and SpicyChat for free interactive storytelling and roleplay experiences.</p>
            </div>
            <div class="faq-item">
                <h3>Are these AI roleplay bots really free?</h3>
                <p>Yes! All character AI bots listed on our site are completely free to use. Character.AI, JanitorAI, and SpicyChat offer free access to thousands of AI characters. You can chat unlimited with these bots without any subscription or payment required.</p>
            </div>
            <div class="faq-item">
                <h3>What types of character AI bots are available?</h3>
                <p>We feature diverse AI character types including yandere (obsessive), tsundere (hot-cold personality), kuudere (emotionless), dandere (shy), vampires, fantasy characters, modern settings, sci-fi bots, and more. Each character AI bot has unique personality traits and roleplay scenarios.</p>
            </div>
            <div class="faq-item">
                <h3>Which platform is best for character AI bots?</h3>
                <p>Character.AI is the most popular platform with the largest user base. JanitorAI offers more flexible content policies. SpicyChat focuses on immersive roleplay experiences. All three platforms are free and offer excellent AI character bots. Try each to find your favorite!</p>
            </div>
            <div class="faq-item">
                <h3>How do I start chatting with an AI character bot?</h3>
                <p>Simply browse our character AI bot collection, click on a character that interests you, then click the platform link (Character.AI, JanitorAI, or SpicyChat). Create a free account on the platform and start chatting immediately. No technical knowledge required!</p>
            </div>
            <div class="faq-item">
                <h3>Can I create my own character AI bot?</h3>
                <p>Yes! All three platforms (Character.AI, JanitorAI, SpicyChat) allow users to create custom AI character bots. You can design unique personalities, backgrounds, and conversation styles. Many popular bots on our list were created by community members.</p>
            </div>
        </div>
    </section>

    </main>

    <footer>
        <div class="footer-content">
            <div class="footer-section">
                <h4>Character AI Bots</h4>
                <p>Your comprehensive guide to the best AI roleplay character bots across multiple platforms.</p>
            </div>
            <div class="footer-section">
                <h4>Quick Links</h4>
                <ul>
                    <li><a href="index.html" title="Character AI Bots Home">Home</a></li>
                    <li><a href="search.html" title="Search Character AI Bots">Search AI Bots</a></li>
                </ul>
            </div>
            <div class="footer-section">
                <h4>Platforms</h4>
                <ul>
                    <li><a href="https://character.ai" target="_blank" rel="nofollow noopener" title="Visit Character.AI Platform">Character.AI</a></li>
                    <li><a href="https://janitorai.com" target="_blank" rel="nofollow noopener" title="Visit JanitorAI Platform">JanitorAI</a></li>
                    <li><a href="https://spicychat.ai" target="_blank" rel="nofollow noopener" title="Visit SpicyChat Platform">SpicyChat</a></li>
                </ul>
            </div>
        </div>
        <div class="footer-bottom">
            <p>&copy; 2026 Character AI Bots. For entertainment purposes only.</p>
        </div>
    </footer>

    <script src="js/filters.js"></script>
</body>
</html>`;

// 写入文件
fs.writeFileSync(path.join(__dirname, 'index.html'), indexHTML);
console.log('✅ Generated index.html with server-side rendered character cards!');
console.log(`📊 Total characters: ${charactersData.length}`);
