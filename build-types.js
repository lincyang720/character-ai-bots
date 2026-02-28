#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const charactersData = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'data', 'characters-enriched.json'), 'utf8')
);

// Group similar types into SEO-friendly category pages
const typeGroups = {
  'yandere': {
    title: 'Yandere AI Bots',
    h1: 'Best Yandere AI Bots for Roleplay',
    description: 'Discover the best yandere AI character bots — obsessive, possessive, and dangerously devoted. Chat with yandere characters on Character.AI, JanitorAI & SpicyChat for free.',
    intro: 'Yandere characters are among the most popular AI roleplay archetypes. These obsessively devoted characters will stop at nothing to keep you close. Whether you love the thrill of a possessive librarian or a jealous classmate, our yandere AI bots deliver intense, emotionally charged conversations that keep you coming back.',
    keywords: 'yandere ai bot, yandere character ai, yandere roleplay, obsessive ai character, possessive ai bot, yandere chat bot',
    filter: c => c.type === 'Yandere'
  },
  'tsundere': {
    title: 'Tsundere AI Bots',
    h1: 'Best Tsundere AI Bots for Roleplay',
    description: 'Chat with tsundere AI bots — characters who act cold but secretly care. Free tsundere roleplay on Character.AI, JanitorAI & SpicyChat.',
    intro: 'Tsundere characters are the classic hot-and-cold personalities that make AI roleplay exciting. They\'ll scold you one moment and blush the next. The fun is in breaking through their tough exterior to find the warmth underneath. Our tsundere AI bots capture this dynamic perfectly.',
    keywords: 'tsundere ai bot, tsundere character ai, tsundere roleplay, hot cold ai character, tsundere chat',
    filter: c => c.type === 'Tsundere' || c.type === 'Kuudere' || c.type === 'Dandere'
  },
  'vampire': {
    title: 'Vampire & Supernatural AI Bots',
    h1: 'Best Vampire & Supernatural AI Bots',
    description: 'Chat with vampire, demon, werewolf and supernatural AI bots. Dark romance and supernatural roleplay on Character.AI, JanitorAI & SpicyChat — free.',
    intro: 'From ancient vampires to powerful demons and mysterious werewolves, supernatural AI characters offer some of the most immersive roleplay experiences. These characters bring centuries of lore, dark romance, and otherworldly powers to your conversations. Perfect for fans of Twilight, Vampire Diaries, or dark fantasy.',
    keywords: 'vampire ai bot, supernatural ai character, demon ai roleplay, werewolf ai bot, dark romance ai, vampire chat bot',
    filter: c => ['Vampire', 'Supernatural', 'Dominant'].includes(c.type) || ['Werewolf', 'Angel', 'Ghost'].includes(c.category)
  },
  'fantasy': {
    title: 'Fantasy AI Roleplay Bots',
    h1: 'Best Fantasy AI Bots for Roleplay',
    description: 'Explore fantasy AI roleplay bots — knights, witches, dragons, and magical characters. Free fantasy roleplay on Character.AI, JanitorAI & SpicyChat.',
    intro: 'Step into magical worlds with our fantasy AI roleplay bots. From noble knights and powerful witches to ancient dragons and royal guards, these characters bring epic fantasy storytelling to life. Each character has deep lore, unique abilities, and immersive scenarios that transport you to another world.',
    keywords: 'fantasy ai bot, fantasy roleplay ai, knight ai character, witch ai bot, dragon ai roleplay, fantasy chat bot, medieval ai roleplay',
    filter: c => ['Fantasy', 'Mystical', 'Traditional'].includes(c.type) || ['Knight', 'Witch', 'Dragon', 'Shrine', 'Guard', 'Pirate'].includes(c.category)
  },
  'romance': {
    title: 'Romance AI Bots',
    h1: 'Best Romance AI Bots for Roleplay Chat',
    description: 'Chat with romance AI bots — childhood friends, café owners, and wholesome love interests. Free romance roleplay on Character.AI, JanitorAI & SpicyChat.',
    intro: 'Looking for sweet, heartwarming AI conversations? Our romance AI bots range from childhood friends who\'ve secretly loved you for years to charming café owners and gentle florists. These characters specialize in building emotional connections, slow-burn romance, and feel-good storylines.',
    keywords: 'romance ai bot, ai boyfriend, ai girlfriend, wholesome ai roleplay, love ai character, romance chat bot, dating ai',
    filter: c => ['Wholesome', 'Passionate', 'Elegant', 'Modern'].includes(c.type) || ['Friend', 'Cafe', 'Florist', 'Clerk', 'Bartender'].includes(c.category)
  },
  'action-adventure': {
    title: 'Action & Adventure AI Bots',
    h1: 'Best Action & Adventure AI Roleplay Bots',
    description: 'Chat with action & adventure AI bots — pirates, assassins, detectives, and explorers. Free adventure roleplay on Character.AI, JanitorAI & SpicyChat.',
    intro: 'For those who crave excitement, our action and adventure AI bots deliver thrilling storylines. Team up with a pirate captain on the high seas, solve mysteries with a brilliant detective, or survive dangerous missions with an elite assassin. These characters bring non-stop action to your roleplay sessions.',
    keywords: 'adventure ai bot, action ai roleplay, pirate ai character, detective ai bot, assassin ai roleplay, adventure chat bot',
    filter: c => ['Adventure', 'Action', 'Competitive', 'Athletic', 'Adventurous', 'Heroic'].includes(c.type) || ['Assassin', 'Detective', 'Racer', 'Athlete', 'Chaser', 'Archaeologist', 'Lifeguard'].includes(c.category)
  },
  'sci-fi': {
    title: 'Sci-Fi AI Bots',
    h1: 'Best Sci-Fi AI Roleplay Bots',
    description: 'Chat with sci-fi AI bots — androids, space commanders, time travelers, and hackers. Free sci-fi roleplay on Character.AI, JanitorAI & SpicyChat.',
    intro: 'Explore the future with our sci-fi AI roleplay bots. From sentient androids discovering emotions to space commanders leading galactic missions, these characters bring science fiction to life. Perfect for fans of cyberpunk, space opera, and futuristic storytelling.',
    keywords: 'sci-fi ai bot, android ai character, space ai roleplay, cyberpunk ai bot, futuristic ai chat, robot ai roleplay',
    filter: c => ['Sci-Fi', 'Tech'].includes(c.type) || ['Robot', 'Hacker', 'Developer'].includes(c.category)
  },
  'creative': {
    title: 'Creative & Intellectual AI Bots',
    h1: 'Best Creative & Intellectual AI Bots',
    description: 'Chat with creative AI bots — artists, musicians, scientists, and mentors. Free intellectual roleplay on Character.AI, JanitorAI & SpicyChat.',
    intro: 'For thoughtful, stimulating conversations, our creative and intellectual AI bots offer a unique roleplay experience. Chat with passionate artists, eccentric scientists, elegant conductors, and wise mentors. These characters inspire creativity and deep discussions.',
    keywords: 'creative ai bot, intellectual ai character, artist ai roleplay, scientist ai bot, mentor ai chat, smart ai character',
    filter: c => ['Creative', 'Intellectual', 'Eccentric', 'Whimsical', 'Charismatic', 'Mature', 'Celebrity', 'Mystery'].includes(c.type) || ['Artist', 'Scientist', 'Conductor', 'Curator', 'Designer', 'Photographer', 'Host', 'Performer', 'Chef', 'Instructor', 'Fortune Teller', 'Tea Master', 'Biologist', 'Hermit'].includes(c.category)
  }
};

function escapeHtml(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

const outputDir = path.join(__dirname, 'type');
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

Object.entries(typeGroups).forEach(([slug, group]) => {
  const chars = charactersData.filter(group.filter);
  if (chars.length === 0) return;

  // Also find related type pages for cross-linking
  const otherTypes = Object.entries(typeGroups)
    .filter(([s]) => s !== slug)
    .map(([s, g]) => ({ slug: s, title: g.title, count: charactersData.filter(g.filter).length }))
    .filter(t => t.count > 0);

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-1JQKX49JMM"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-1JQKX49JMM');
    </script>

    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${group.title} - Free AI Roleplay Characters | Character AI Bots</title>
    <meta name="description" content="${escapeHtml(group.description)}">
    <meta name="keywords" content="${group.keywords}">

    <meta property="og:title" content="${group.title} | Character AI Bots">
    <meta property="og:description" content="${escapeHtml(group.description)}">
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://www.characteraibots.com/type/${slug}">
    <meta property="og:image" content="https://www.characteraibots.com/images/og-image.jpg">

    <link rel="stylesheet" href="../style.css">
    <link rel="canonical" href="https://www.characteraibots.com/type/${slug}">

    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "${escapeHtml(group.title)}",
      "description": "${escapeHtml(group.description)}",
      "url": "https://www.characteraibots.com/type/${slug}",
      "numberOfItems": ${chars.length},
      "hasPart": [${chars.map(c => `{"@type":"CreativeWork","name":"${escapeHtml(c.name)}","url":"https://www.characteraibots.com/characters/${c.id}"}`).join(',')}]
    }
    </script>
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.characteraibots.com"},
        {"@type": "ListItem", "position": 2, "name": "${escapeHtml(group.title)}"}
      ]
    }
    </script>
</head>
<body>
    <header>
        <nav>
            <div class="logo"><a href="../index.html" style="color: white; text-decoration: none;" title="Character AI Bots Home">🤖 Character AI Bots</a></div>
            <ul class="nav-links">
                <li><a href="../index.html" title="Home">Home</a></li>
                <li><a href="../search.html" title="Search">Search</a></li>
                <li><a href="../blog/" title="Blog">Blog</a></li>
            </ul>
        </nav>
    </header>

    <main>
    <section class="type-hero">
        <div class="type-hero-content">
            <nav class="breadcrumb" aria-label="Breadcrumb">
                <a href="../index.html">Home</a> &rsaquo; <span>${group.title}</span>
            </nav>
            <h1>${group.h1}</h1>
            <p class="type-hero-desc">${group.description}</p>
            <p class="type-hero-count">${chars.length} characters available — all free</p>
        </div>
    </section>

    <section class="type-intro">
        <div class="type-intro-content">
            <p>${group.intro}</p>
        </div>
    </section>

    <section class="characters-section">
        <h2>All ${group.title} (${chars.length})</h2>
        <div class="characters-grid">
            ${chars.map(char => `
            <a href="../characters/${char.id}.html" class="character-card" title="Chat with ${escapeHtml(char.name)} - ${char.type} AI Bot">
                <div class="character-icon">${char.image}</div>
                <h3>${escapeHtml(char.name)}</h3>
                <p>${escapeHtml(char.description.substring(0, 120))}...</p>
                <div class="character-footer">
                    <span class="rating">⭐ ${char.rating}</span>
                    <span class="type-badge">${char.type}</span>
                </div>
            </a>`).join('\n')}
        </div>
    </section>

    <section class="type-browse">
        <h2>Browse More Character Types</h2>
        <div class="type-links">
            ${otherTypes.map(t => `<a href="${t.slug}.html" class="type-link-card" title="${escapeHtml(t.title)}">${escapeHtml(t.title)} <span>(${t.count})</span></a>`).join('\n            ')}
        </div>
    </section>

    <section class="cta-section">
        <div class="cta-content">
            <h2>Start Chatting with ${group.title} Now</h2>
            <p>All characters are free on Character.AI, JanitorAI, and SpicyChat. Pick a character above and start your adventure!</p>
            <a href="../index.html" class="cta-button">Browse All Characters</a>
        </div>
    </section>
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
                    <li><a href="../index.html">Home</a></li>
                    <li><a href="../search.html">Search</a></li>
                    <li><a href="../blog/">Blog</a></li>
                </ul>
            </div>
            <div class="footer-section">
                <h4>Character Types</h4>
                <ul>
                    ${otherTypes.slice(0, 5).map(t => `<li><a href="${t.slug}.html">${escapeHtml(t.title)}</a></li>`).join('\n                    ')}
                </ul>
            </div>
        </div>
        <div class="footer-bottom">
            <p>&copy; 2026 Character AI Bots. For entertainment purposes only.</p>
        </div>
    </footer>
</body>
</html>`;

  fs.writeFileSync(path.join(outputDir, `${slug}.html`), html);
  console.log(`✓ Generated type/${slug}.html (${chars.length} characters)`);
});

console.log(`\n✅ Generated ${Object.keys(typeGroups).length} type pages!`);
