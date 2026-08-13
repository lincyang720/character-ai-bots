#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { SITE_URL, SITE_NAME, LAST_REVIEWED, NEWSLETTER_ACTION, DISCLAIMER } = require('./site-config');

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
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI Character Directory – ${charactersData.length}+ Free AI Chatbots &amp; Roleplay Characters</title>
    <meta name="description" content="Free AI character directory with ${charactersData.length}+ chatbots from Character.AI, JanitorAI &amp; SpicyChat. Filter by platform, type and rating. Find your perfect AI roleplay character.">
    <meta name="keywords" content="ai character directory, ai roleplay characters, character ai bots, free ai chatbots, anime ai characters, character.ai, janitorai, spicychat">
    <meta name="google-site-verification" content="OPQH_dX0XnvAd0ODbk5cDms96DTDRcgDkwoFUZw_eHw" />

    <!-- Open Graph -->
    <meta property="og:title" content="AI Character Directory – ${charactersData.length}+ Free AI Chatbots">
    <meta property="og:description" content="Explore ${charactersData.length}+ AI roleplay characters across Character.AI, JanitorAI and SpicyChat. Filter by platform, type and rating.">
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://www.characteraibots.com/">
    <meta property="og:image" content="https://www.characteraibots.com/images/og-image.jpg">
    <meta property="og:site_name" content="${SITE_NAME}">

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="AI Character Directory – ${charactersData.length}+ Free AI Chatbots">
    <meta name="twitter:description" content="Explore ${charactersData.length}+ AI roleplay characters across Character.AI, JanitorAI and SpicyChat.">
    <meta name="twitter:image" content="https://www.characteraibots.com/images/og-image.jpg">

    <link rel="stylesheet" href="style.css">
    <link rel="canonical" href="https://www.characteraibots.com/">

    <!-- Schema.org Structured Data -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "AI Character Guide",
      "url": "https://www.characteraibots.com/",
      "description": "A free AI character directory with ${charactersData.length}+ roleplay chatbots across Character.AI, JanitorAI, and SpicyChat",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://www.characteraibots.com/search?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    }
    </script>
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": "AI Character Directory",
      "description": "A curated list of ${charactersData.length}+ AI roleplay character bots",
      "numberOfItems": ${charactersData.length},
      "itemListElement": ${JSON.stringify(charactersData.slice(0, 10).map((char, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "CreativeWork",
          "name": char.name,
          "description": char.description,
          "url": `https://www.characteraibots.com/characters/${char.id}`
        }
      })))}
    }
    </script>
</head>
<body>
    <header>
        <nav>
            <div class="logo">🧭 ${SITE_NAME}</div>
            <ul class="nav-links">
                <li><a href="index.html" class="active" title="AI Character Directory Home">Home</a></li>
                <li><a href="search.html" title="Search Character AI Bots">Search</a></li>
                <li><a href="ai-roleplay-characters.html" title="Browse AI Roleplay Characters">Roleplay Characters</a></li>
                <li><a href="submit-character.html" title="Submit an AI Character">Submit Character</a></li>
                <li><a href="blog/" title="AI Roleplay Blog">Blog</a></li>
                <li><a href="quiz.html" title="AI Character Quiz">Quiz</a></li>
            </ul>
        </nav>
    </header>

    <main>
    <section class="hero">
        <div class="hero-content">
            <h1>AI Character Directory – ${charactersData.length}+ Free AI Chatbots &amp; Roleplay Characters</h1>
            <p class="hero-subtitle">An independent, cross-platform directory of ${charactersData.length}+ AI roleplay characters on Character.AI, JanitorAI, and SpicyChat.</p>
            <p class="hero-description">This <strong>AI character directory</strong> curates ${charactersData.length}+ free roleplay bots across Character.AI, JanitorAI, and SpicyChat — one of the few independent directories that lets you compare characters by platform, type, difficulty, and rating before you start chatting.</p>
            <p class="last-reviewed">Directory reviewed <time datetime="${LAST_REVIEWED}">${LAST_REVIEWED}</time></p>
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
                <label>Platform:</label>
                <select id="platform-filter">
                    <option value="">All Platforms</option>
                    <option value="characterai">Character.AI</option>
                    <option value="janitorai">JanitorAI</option>
                    <option value="spicychat">SpicyChat</option>
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

    <section class="choice-guide" aria-labelledby="choice-guide-title">
        <div class="choice-guide-content">
            <p class="eyebrow">Quick start</p>
            <h2 id="choice-guide-title">How to Choose the Right Character AI Bot</h2>
            <p>Not sure where to begin? Start with the kind of story or conversation you want, then narrow the directory by platform, personality and difficulty. Every character page includes scenario ideas, personality traits, supported platforms and similar recommendations, so you can compare options before leaving the directory.</p>
            <div class="choice-guide-grid">
                <article>
                    <h3>For anime-style roleplay</h3>
                    <p>Browse <a href="type/anime.html">Anime Characters</a> for expressive personalities, dramatic story hooks and characters inspired by popular series and games.</p>
                </article>
                <article>
                    <h3>For quests and world-building</h3>
                    <p>Try <a href="type/fantasy.html">Fantasy</a>, <a href="type/game.html">Game Characters</a> or <a href="type/action-adventure.html">Action &amp; Adventure</a> for magic, missions and collaborative storytelling.</p>
                </article>
                <article>
                    <h3>For suspense and darker stories</h3>
                    <p>Explore <a href="type/horror.html">Horror</a>, <a href="type/supernatural.html">Supernatural</a> or <a href="type/mystery.html">Mystery</a>. Check each character’s difficulty and choose a platform with controls that fit your preferences.</p>
                </article>
                <article>
                    <h3>For relaxed conversation</h3>
                    <p>Start with <a href="type/wholesome.html">Wholesome Characters</a>, <a href="type/companions.html">AI Companions</a> or <a href="type/romance.html">Romance</a> for friendship, comfort and slower relationship-focused scenarios.</p>
                </article>
            </div>
            <p class="choice-guide-tip"><strong>First-time roleplayer?</strong> Choose an Easy character and begin with one of the suggested scenarios. Add a location, a goal and a short action in your opening message; this gives the bot enough context to respond consistently.</p>
            <p class="choice-guide-tip"><strong>Creator with a public bot?</strong> <a href="submit-character.html">Submit your AI character</a> for free editorial review and get a stable directory page you can share from your creator profile.</p>
        </div>
    </section>

    <section class="characters-section">
        <h2>Browse All AI Roleplay Characters</h2>
        <div id="characters-grid" class="characters-grid">
            ${generateCharacterCards([...charactersData].sort((a, b) => b.popularity - a.popularity).slice(0, 12))}
        </div>
        <p id="characters-count" class="characters-count" aria-live="polite">Showing 12 of ${charactersData.length} characters</p>
        <button id="load-more-characters" class="load-more-button" type="button">Load 12 more characters</button>
    </section>

    <section class="features">
        <h2>Why Choose Our AI Character Directory?</h2>
        <div class="features-grid">
            <div class="feature-card">
                <div class="feature-icon">🎭</div>
                <h3>${charactersData.length}+ AI Roleplay Characters</h3>
                <p>From yandere to vampire bots, discover diverse character AI personalities for every roleplay style and preference.</p>
            </div>
            <div class="feature-card">
                <div class="feature-icon">🆓</div>
                <h3>100% Free AI Chat Bots</h3>
                <p>All character AI bots are completely free on Character.AI, JanitorAI, and SpicyChat platforms. No hidden fees.</p>
            </div>
            <div class="feature-card">
                <div class="feature-icon">⭐</div>
                <h3>Comparable Directory Signals</h3>
                <p>Compare editorial ratings, platform availability, difficulty, tags, and scenario ideas in one consistent format.</p>
            </div>
            <div class="feature-card">
                <div class="feature-icon">🔍</div>
                <h3>Easy Character Discovery</h3>
                <p>Filter AI bots by type, difficulty, and tags to quickly find your perfect roleplay character match.</p>
            </div>
        </div>
    </section>

    <section class="use-cases" aria-labelledby="use-cases-title">
        <div class="use-cases-content">
            <p class="eyebrow">Ideas for your next conversation</p>
            <h2 id="use-cases-title">What Can You Do with Character AI Bots?</h2>
            <p>Character bots are most useful when you choose one that matches a clear activity. They are entertainment tools rather than professional advisers, but they can provide a flexible space for storytelling, brainstorming and low-pressure conversation.</p>
            <div class="use-cases-grid">
                <article>
                    <h3>Interactive roleplay</h3>
                    <p>Build an ongoing story with a defined setting, relationship and goal. Fantasy, anime and mystery characters work especially well when you open with a specific scene or conflict.</p>
                </article>
                <article>
                    <h3>Creative writing practice</h3>
                    <p>Test dialogue, explore alternate plot choices or improvise a scene from another character’s perspective. Treat generated details as creative suggestions and revise them in your own voice.</p>
                </article>
                <article>
                    <h3>Language and dialogue practice</h3>
                    <p>Use a friendly character for informal conversation practice, vocabulary prompts or fictional interview exercises. Verify important corrections with a reliable learning source.</p>
                </article>
                <article>
                    <h3>Casual character chat</h3>
                    <p>Choose a wholesome or companion character for relaxed, fictional conversation. Avoid sharing sensitive personal information and review the privacy controls of the platform you select.</p>
                </article>
            </div>
        </div>
    </section>

    <section class="newsletter-section" aria-labelledby="newsletter-title">
        <div class="newsletter-card">
            <p class="eyebrow">Monthly discovery digest</p>
            <h2 id="newsletter-title">Get new character guides without relying on search</h2>
            <p>One concise email with newly reviewed characters, themed collections, and platform changes.</p>
            ${NEWSLETTER_ACTION ? `<form action="${NEWSLETTER_ACTION}" method="post" class="newsletter-form">
                <label class="sr-only" for="newsletter-email">Email address</label>
                <input id="newsletter-email" type="email" name="email" placeholder="you@example.com" autocomplete="email" required>
                <button type="submit">Subscribe</button>
            </form>` : '<p class="newsletter-pending">Newsletter signups are opening soon. Bookmark this page and check back after the next directory update.</p>'}
        </div>
    </section>

    <section class="cta-section">
        <div class="cta-content">
            <h2>Ready to Start Chatting with AI Bots?</h2>
            <p>Browse our collection of ${charactersData.length}+ character AI bots and find your perfect roleplay companion today!</p>
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

    <section class="type-browse" style="max-width: 1200px; margin: 3rem auto; padding: 0 2rem;">
        <h2>Browse by Character Type</h2>
        <div class="type-links">
            <a href="type/yandere.html" class="type-link-card" title="Yandere AI Bots">🔪 Yandere Bots</a>
            <a href="type/tsundere.html" class="type-link-card" title="Tsundere AI Bots">😤 Tsundere Bots</a>
            <a href="type/vampire.html" class="type-link-card" title="Vampire & Supernatural AI Bots">🧛 Vampire &amp; Supernatural</a>
            <a href="type/fantasy.html" class="type-link-card" title="Fantasy AI Bots">⚔️ Fantasy Bots</a>
            <a href="type/romance.html" class="type-link-card" title="Romance AI Bots">💕 Romance Bots</a>
            <a href="type/sci-fi.html" class="type-link-card" title="Sci-Fi AI Bots">🚀 Sci-Fi Bots</a>
            <a href="type/action-adventure.html" class="type-link-card" title="Action & Adventure AI Bots">🏴‍☠️ Action &amp; Adventure</a>
            <a href="type/creative.html" class="type-link-card" title="Creative & Intellectual AI Bots">🎨 Creative &amp; Intellectual</a>
            <a href="type/anime.html" class="type-link-card" title="Anime AI Characters">🌸 Anime Characters</a>
            <a href="type/game.html" class="type-link-card" title="Video Game AI Characters">🎮 Game Characters</a>
            <a href="type/horror.html" class="type-link-card" title="Horror AI Bots">🕯️ Horror Bots</a>
            <a href="type/supernatural.html" class="type-link-card" title="Supernatural AI Characters">👻 Supernatural</a>
            <a href="type/wholesome.html" class="type-link-card" title="Wholesome AI Characters">🌿 Wholesome</a>
            <a href="type/mystery.html" class="type-link-card" title="Mystery AI Characters">🔎 Mystery</a>
            <a href="type/companions.html" class="type-link-card" title="AI Companion Characters">💬 Companions</a>
            <a href="type/historical.html" class="type-link-card" title="Historical AI Characters">📜 Historical</a>
        </div>
    </section>

    </main>

    <footer>
        <div class="footer-content">
            <div class="footer-section">
                <h4>${SITE_NAME}</h4>
                <p>Independent AI character discovery across multiple roleplay platforms.</p>
            </div>
            <div class="footer-section">
                <h4>Quick Links</h4>
                <ul>
                    <li><a href="index.html" title="Character AI Bots Home">Home</a></li>
                    <li><a href="search.html" title="Search Character AI Bots">Search AI Bots</a></li>
                    <li><a href="submit-character.html" title="Submit an AI Character">Submit Character</a></li>
                    <li><a href="blog/" title="AI Roleplay Blog">Blog</a></li>
                    <li><a href="quiz.html" title="AI Character Quiz">Quiz</a></li>
                </ul>
            </div>
            <div class="footer-section">
                <h4>Character Types</h4>
                <ul>
                    <li><a href="type/yandere.html">Yandere Bots</a></li>
                    <li><a href="type/fantasy.html">Fantasy Bots</a></li>
                    <li><a href="type/romance.html">Romance Bots</a></li>
                    <li><a href="type/vampire.html">Vampire Bots</a></li>
                    <li><a href="type/sci-fi.html">Sci-Fi Bots</a></li>
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
            <p>&copy; 2026 ${SITE_NAME}. Independent directory; not affiliated with any listed platform.</p>
            <p class="trademark-disclaimer"><strong>Disclaimer:</strong> ${DISCLAIMER}</p>
        </div>
    </footer>

    <script src="js/filters.js"></script>
    <script>
      window.addEventListener('load', function () {
        var startAnalytics = function () {
          window.dataLayer = window.dataLayer || [];
          window.gtag = function () { window.dataLayer.push(arguments); };
          window.gtag('js', new Date());
          window.gtag('config', 'G-1JQKX49JMM');
          var script = document.createElement('script');
          script.async = true;
          script.src = 'https://www.googletagmanager.com/gtag/js?id=G-1JQKX49JMM';
          document.head.appendChild(script);
        };
        if ('requestIdleCallback' in window) {
          window.requestIdleCallback(startAnalytics, { timeout: 3000 });
        } else {
          window.setTimeout(startAnalytics, 1500);
        }
      }, { once: true });
    </script>
</body>
</html>`;

// 写入文件
fs.writeFileSync(path.join(__dirname, 'index.html'), indexHTML);
console.log('✅ Generated index.html with server-side rendered character cards!');
console.log(`📊 Total characters: ${charactersData.length}`);
