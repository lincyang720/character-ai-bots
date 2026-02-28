#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// 读取enriched角色数据，fallback到原始数据
const dataFile = fs.existsSync(path.join(__dirname, 'data', 'characters-enriched.json'))
  ? 'characters-enriched.json'
  : 'characters.json';

const charactersData = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'data', dataFile), 'utf8')
);

console.log(`📖 Using data source: ${dataFile}`);

// 创建输出目录
const outputDir = path.join(__dirname, 'characters');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function escapeHtml(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// 角色详情页模板
function generateCharacterPage(character) {
  const relatedCharacters = charactersData
    .filter(c => c.id !== character.id && (
      c.type === character.type ||
      c.tags.some(tag => character.tags.includes(tag))
    ))
    .slice(0, 6);

  // Conversation examples HTML
  const convExamples = character.conversationExamples || [];
  const convHtml = convExamples.map(ex => `
                    <div class="conversation-example">
                        <div class="chat-bubble user-bubble">
                            <span class="bubble-label">You</span>
                            <p>${escapeHtml(ex.user)}</p>
                        </div>
                        <div class="chat-bubble char-bubble">
                            <span class="bubble-label">${escapeHtml(character.displayName.split(' ')[0])}</span>
                            <p>${escapeHtml(ex.char)}</p>
                        </div>
                    </div>`).join('\n');

  // Roleplay tips HTML
  const tips = character.roleplayTips || [];
  const tipsHtml = tips.map((tip, i) => `
                    <div class="tip-item">
                        <span class="tip-number">${i + 1}</span>
                        <p>${escapeHtml(tip)}</p>
                    </div>`).join('\n');

  // Platform guide HTML
  const platformGuide = character.platformGuide || {};
  const platformGuideHtml = Object.entries(platformGuide).map(([name, desc]) => `
                    <div class="platform-guide-item">
                        <h4>${escapeHtml(name)}</h4>
                        <p>${escapeHtml(desc)}</p>
                    </div>`).join('\n');

  // Backstory
  const backstory = character.backstory || '';

  // Extended FAQ with more questions for richer content
  const platformNames = Object.keys(character.platforms).map(p =>
    p === 'characterai' ? 'Character.AI' : p === 'janitorai' ? 'JanitorAI' : 'SpicyChat'
  ).join(', ');

  const faqItems = [
    { q: `What type of character is ${character.name}?`, a: `${character.name} is a ${character.type.toLowerCase()} character in the ${character.category.toLowerCase()} category. Key personality traits include ${character.personality.slice(0, 3).join(', ')}. This character is rated ${character.difficulty.toLowerCase()} difficulty, making it ${character.difficulty === 'Easy' ? 'great for beginners' : character.difficulty === 'Medium' ? 'suitable for most roleplayers' : 'best for experienced roleplayers'}.` },
    { q: `Where can I chat with ${character.name}?`, a: `You can chat with ${character.name} for free on ${platformNames}. Each platform offers a slightly different experience — check our platform comparison guide above to find the best fit for your roleplay style.` },
    { q: `Is ${character.name} free to use?`, a: `Yes, ${character.name} is available for free on all supported platforms. Some platforms may offer premium features for enhanced conversations, longer memory, or faster response times.` },
    { q: `How do I get the best roleplay experience with ${character.name}?`, a: `Start by setting the scene with descriptive actions using *asterisks*. Reference ${character.name}'s personality traits like ${character.personality[0].toLowerCase()} and ${character.personality[1].toLowerCase()} in your messages. Try beginning with the "${character.scenarios[0]}" scenario for the most natural introduction. Check our detailed roleplay tips section above for more strategies.` },
    { q: `What makes ${character.name} different from other ${character.type.toLowerCase()} characters?`, a: `${character.name} stands out with a unique combination of ${character.personality.join(', ').toLowerCase()} traits set in a ${character.category.toLowerCase()} context. The ${character.scenarios.length} built-in scenarios offer diverse roleplay paths, and the character's backstory adds depth that many similar characters lack.` },
  ];

  const faqJsonLd = faqItems.map(f => `{"@type": "Question", "name": "${escapeHtml(f.q)}", "acceptedAnswer": {"@type": "Answer", "text": "${escapeHtml(f.a)}"}}`).join(',\n        ');

  const faqSectionHtml = faqItems.map(f => `
                    <div class="faq-item">
                        <h4>${escapeHtml(f.q)}</h4>
                        <p>${escapeHtml(f.a)}</p>
                    </div>`).join('\n');

  return `<!DOCTYPE html>
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
    <title>${character.name} - Chat with ${character.displayName} | ${character.type} AI Roleplay Bot</title>
    <meta name="description" content="Chat with ${character.name} (${character.displayName}) - a ${character.type.toLowerCase()} ${character.category.toLowerCase()} AI roleplay bot. ${character.description.substring(0, 120)} Free on ${platformNames}.">
    <meta name="keywords" content="${character.tags.join(', ')}, ${character.type.toLowerCase()} ai bot, ${character.name.toLowerCase()}, ${character.displayName.toLowerCase()}, character ai bots, ai roleplay, ${character.category.toLowerCase()} roleplay">

    <!-- Open Graph -->
    <meta property="og:title" content="${character.name} - ${character.type} AI Roleplay Bot | Character AI Bots">
    <meta property="og:description" content="Chat with ${character.displayName} - ${character.description}">
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://www.characteraibots.com/characters/${character.id}">
    <meta property="og:image" content="https://www.characteraibots.com/images/og-image.jpg">
    <meta property="og:site_name" content="Character AI Bots">

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${character.name} - ${character.type} AI Roleplay Bot">
    <meta name="twitter:description" content="Chat with ${character.displayName} - ${character.description}">
    <meta name="twitter:image" content="https://www.characteraibots.com/images/og-image.jpg">

    <link rel="stylesheet" href="../style.css">
    <link rel="canonical" href="https://www.characteraibots.com/characters/${character.id}">

    <!-- Schema.org Structured Data -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "CreativeWork",
      "name": "${character.name}",
      "alternateName": "${character.displayName}",
      "description": "${escapeHtml(character.description)}",
      "genre": "${character.type}",
      "url": "https://www.characteraibots.com/characters/${character.id}",
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "${character.rating}",
        "reviewCount": "${character.reviews}",
        "bestRating": "5",
        "worstRating": "1"
      }
    }
    </script>
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.characteraibots.com"},
        {"@type": "ListItem", "position": 2, "name": "${character.type} Characters", "item": "https://www.characteraibots.com/search?type=${encodeURIComponent(character.type)}"},
        {"@type": "ListItem", "position": 3, "name": "${character.name}"}
      ]
    }
    </script>
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        ${faqJsonLd}
      ]
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
                <li><a href="../blog/" title="AI Roleplay Blog">Blog</a></li>
                <li><a href="../quiz.html" title="AI Character Quiz">Quiz</a></li>
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
            <div class="hero-cta">
                <p class="hero-cta-text">Start chatting with ${character.name} now — free on any platform:</p>
                <div class="hero-cta-buttons">
                    ${Object.entries(character.platforms).map(([platform, url]) => `<a href="${url}" target="_blank" rel="nofollow" class="hero-cta-btn" title="Chat with ${character.name} on ${platform === 'characterai' ? 'Character.AI' : platform === 'janitorai' ? 'JanitorAI' : 'SpicyChat'}">${platform === 'characterai' ? '💬 Character.AI' : platform === 'janitorai' ? '🎭 JanitorAI' : '🌶️ SpicyChat'}</a>`).join('\n                    ')}
                </div>
            </div>
        </div>
    </section>

    <nav class="page-nav" aria-label="Page sections">
        <a href="#about">About</a>
        ${backstory ? '<a href="#backstory">Backstory</a>' : ''}
        ${convExamples.length > 0 ? '<a href="#conversations">Conversations</a>' : ''}
        ${tips.length > 0 ? '<a href="#tips">Tips</a>' : ''}
        <a href="#platforms">Platforms</a>
        <a href="#faq">FAQ</a>
        ${relatedCharacters.length > 0 ? '<a href="#similar">Similar Characters</a>' : ''}
    </nav>

    <section class="character-detail-main">
        <div class="detail-container">
            <div class="detail-content">
                <h2 id="about">About ${character.name}</h2>
                <p class="description">${character.description}</p>

                ${backstory ? `
                <h3 id="backstory">Character Backstory</h3>
                <div class="backstory-section">
                    <p>${escapeHtml(backstory)}</p>
                </div>
                ` : ''}

                <h3>Personality Traits</h3>
                <div class="traits-grid">
                    ${character.personality.map(trait => `<span class="trait-badge">${trait}</span>`).join('')}
                </div>

                <h3>Roleplay Scenarios</h3>
                <ul class="scenarios-list">
                    ${character.scenarios.map(scenario => `<li>${scenario}</li>`).join('')}
                </ul>

                ${convExamples.length > 0 ? `
                <h3 id="conversations">Sample Conversations</h3>
                <p class="section-intro">Here's what chatting with ${character.name} looks like in action:</p>
                <div class="conversation-examples">
                    ${convHtml}
                </div>
                ` : ''}

                ${tips.length > 0 ? `
                <h3 id="tips">Roleplay Tips for ${character.name}</h3>
                <p class="section-intro">Get the most out of your conversations with these proven strategies:</p>
                <div class="tips-section">
                    ${tipsHtml}
                </div>
                ` : ''}

                ${Object.keys(platformGuide).length > 0 ? `
                <h3 id="platforms">Platform Comparison</h3>
                <p class="section-intro">Choose the best platform for your ${character.name} experience:</p>
                <div class="platform-guide">
                    ${platformGuideHtml}
                </div>
                ` : ''}

                <h3>Tags</h3>
                <div class="tags-container">
                    ${character.tags.map(tag => `<span class="tag">#${tag}</span>`).join('')}
                </div>

                <h3 id="where-to-chat">Where to Chat</h3>
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
                    <p>Start your conversation on any of the platforms above - completely free! ${character.name} is waiting to meet you.</p>
                </div>

                <div class="faq-section" id="faq">
                    <h3>Frequently Asked Questions</h3>
                    ${faqSectionHtml}
                </div>
            </div>

            <aside class="detail-sidebar">
                <div class="sidebar-card">
                    <h3>Quick Info</h3>
                    <ul class="info-list">
                        <li><strong>Name:</strong> ${character.displayName}</li>
                        <li><strong>Type:</strong> ${character.type}</li>
                        <li><strong>Category:</strong> ${character.category}</li>
                        <li><strong>Difficulty:</strong> ${character.difficulty}</li>
                        <li><strong>Popularity:</strong> ${character.popularity}/5.0</li>
                        <li><strong>Reviews:</strong> ${character.reviews}</li>
                        <li><strong>Platforms:</strong> ${Object.keys(character.platforms).length}</li>
                    </ul>
                </div>

                <div class="sidebar-card">
                    <h3>Best For</h3>
                    <ul class="info-list">
                        <li>${character.type} roleplay fans</li>
                        <li>${character.category} themed stories</li>
                        <li>${character.difficulty === 'Easy' ? 'Beginners and casual players' : character.difficulty === 'Medium' ? 'Intermediate roleplayers' : 'Advanced roleplay enthusiasts'}</li>
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
    <section class="related-characters" id="similar">
        <h2>Similar Characters You Might Like</h2>
        <p class="section-intro related-intro">Enjoyed ${character.name}? These characters share similar vibes — try them next!</p>
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
                    <li><a href="../blog/" title="AI Roleplay Blog">Blog</a></li>
                    <li><a href="../quiz.html" title="AI Character Quiz">Quiz</a></li>
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
