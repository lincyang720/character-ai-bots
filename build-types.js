#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { SITE_URL, SITE_NAME, LAST_REVIEWED, DISCLAIMER } = require('./site-config');

const charactersData = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'data', 'characters.json'), 'utf8')
);

function matchesKeywords(character, keywords) {
  const haystack = [character.name, character.type, character.category, ...character.tags].join(' ').toLowerCase();
  return keywords.some(keyword => haystack.includes(keyword));
}

// Group similar types into SEO-friendly category pages
// SEO-OPTIMIZED: Titles include target keywords, 2026 update, and unique value propositions
const typeGroups = {
  'yandere': {
    title: 'Character AI Yandere Bots - Free Yandere Roleplay Characters',
    h1: 'Character AI Yandere Bots for Intense Roleplay',
    description: 'Chat with free Yandere AI bots - obsessive, possessive & dangerously loyal. Meet Makima, Kafka & 20+ Yandere characters. 100% free on Character.AI, JanitorAI & SpicyChat.',
    intro: 'Yandere characters are among the most popular AI roleplay archetypes. These obsessively devoted characters will stop at nothing to keep you close. Whether you love the thrill of a possessive librarian or a jealous classmate, our yandere AI bots deliver intense, emotionally charged conversations that keep you coming back.',
    keywords: 'yandere ai bot, yandere character ai, yandere roleplay, obsessive ai character, possessive ai bot, yandere chat bot, free yandere ai',
    filter: c => c.type === 'Yandere'
  },
  'tsundere': {
    title: 'Character AI Tsundere Bots - Free Tsundere Roleplay Characters',
    h1: 'Character AI Tsundere Bots for Roleplay',
    description: 'Free Tsundere AI bots that start cold but warm up to you. 15+ characters including classic anime tsundere. 100% free on Character.AI, JanitorAI & SpicyChat.',
    intro: 'Tsundere characters are the classic hot-and-cold personalities that make AI roleplay exciting. They\'ll scold you one moment and blush the next. The fun is in breaking through their tough exterior to find the warmth underneath. Our tsundere AI bots capture this dynamic perfectly.',
    keywords: 'tsundere ai bot, tsundere character ai, tsundere roleplay, hot cold ai character, tsundere chat, free tsundere ai',
    filter: c => c.type === 'Tsundere' || c.type === 'Kuudere' || c.type === 'Dandere'
  },
  'vampire': {
    title: 'Character AI Vampire Bots - Free Supernatural Roleplay Characters',
    h1: 'Character AI Vampire & Supernatural Bots',
    description: 'Satisfy your gothic cravings with free Vampire AI bots. Dark, mysterious & immortal characters. 100% free on Character.AI, JanitorAI & SpicyChat.',
    intro: 'From ancient vampires to powerful demons and mysterious werewolves, supernatural AI characters offer some of the most immersive roleplay experiences. These characters bring centuries of lore, dark romance, and otherworldly powers to your conversations. Perfect for fans of Twilight, Vampire Diaries, or dark fantasy.',
    keywords: 'vampire ai bot, supernatural ai character, demon ai roleplay, werewolf ai bot, dark romance ai, vampire chat bot, free vampire ai',
    filter: c => ['Vampire', 'Supernatural', 'Dominant'].includes(c.type) || ['Werewolf', 'Angel', 'Ghost'].includes(c.category)
  },
  'fantasy': {
    title: 'Character AI Fantasy Bots - Free Fantasy Roleplay Characters',
    h1: 'Character AI Fantasy Bots for Free Roleplay',
    description: 'Embark on magical adventures with free Fantasy AI bots. Elves, dragons, wizards & more. 100% free on Character.AI, JanitorAI & SpicyChat.',
    intro: 'Step into magical worlds with our fantasy AI roleplay bots. From noble knights and powerful witches to ancient dragons and royal guards, these characters bring epic fantasy storytelling to life. Each character has deep lore, unique abilities, and immersive scenarios that transport you to another world.',
    keywords: 'fantasy ai bot, fantasy roleplay ai, knight ai character, witch ai bot, dragon ai roleplay, fantasy chat bot, medieval ai roleplay, free fantasy ai',
    filter: c => ['Fantasy', 'Mystical', 'Traditional'].includes(c.type) || ['Knight', 'Witch', 'Dragon', 'Shrine', 'Guard', 'Pirate'].includes(c.category)
  },
  'romance': {
    title: 'Character AI Romance Bots - Free Romance Roleplay Characters',
    h1: 'Character AI Romance Bots for Roleplay & Dating Chat',
    description: 'Find your perfect AI companion with free Romance bots. Sweet, caring & lovable characters. 100% free on Character.AI, JanitorAI & SpicyChat.',
    intro: 'Looking for sweet, heartwarming AI conversations? Our romance AI bots range from childhood friends who\'ve secretly loved you for years to charming café owners and gentle florists. These characters specialize in building emotional connections, slow-burn romance, and feel-good storylines.',
    keywords: 'romance ai bot, ai boyfriend, ai girlfriend, wholesome ai roleplay, love ai character, romance chat bot, dating ai, free romance ai',
    filter: c => ['Wholesome', 'Passionate', 'Elegant', 'Modern'].includes(c.type) || ['Friend', 'Cafe', 'Florist', 'Clerk', 'Bartender'].includes(c.category)
  },
  'action-adventure': {
    title: 'Character AI Action Adventure Bots - Free Hero Roleplay Characters',
    h1: 'Character AI Action & Adventure Roleplay Bots',
    description: 'Live dangerously with free Action Adventure AI bots. Heroes, villains & everything in between. 100% free on Character.AI, JanitorAI & SpicyChat.',
    intro: 'For those who crave excitement, our action and adventure AI bots deliver thrilling storylines. Team up with a pirate captain on the high seas, solve mysteries with a brilliant detective, or survive dangerous missions with an elite assassin. These characters bring non-stop action to your roleplay sessions.',
    keywords: 'adventure ai bot, action ai roleplay, pirate ai character, detective ai bot, assassin ai roleplay, adventure chat bot, free action ai',
    filter: c => ['Adventure', 'Action', 'Competitive', 'Athletic', 'Adventurous', 'Heroic'].includes(c.type) || ['Assassin', 'Detective', 'Racer', 'Athlete', 'Chaser', 'Archaeologist', 'Lifeguard'].includes(c.category)
  },
  'sci-fi': {
    title: 'Character AI Sci-Fi Bots - Free Robot and Space Roleplay',
    h1: 'Character AI Sci-Fi Roleplay Bots',
    description: 'Explore the future with free Sci-Fi AI bots. Robots, AI assistants & space explorers. 100% free on Character.AI, JanitorAI & SpicyChat.',
    intro: 'Explore the future with our sci-fi AI roleplay bots. From sentient androids discovering emotions to space commanders leading galactic missions, these characters bring science fiction to life. Perfect for fans of cyberpunk, space opera, and futuristic storytelling.',
    keywords: 'sci-fi ai bot, android ai character, space ai roleplay, cyberpunk ai bot, futuristic ai chat, robot ai roleplay, free sci-fi ai',
    filter: c => ['Sci-Fi', 'Tech'].includes(c.type) || ['Robot', 'Hacker', 'Developer'].includes(c.category)
  },
  'creative': {
    title: 'Character AI Creative Bots - Free Artist and Genius Characters',
    h1: 'Character AI Creative & Intellectual Bots',
    description: 'Get inspired with free Creative AI bots. Artists, geniuses, writers & more. 100% free on Character.AI, JanitorAI & SpicyChat.',
    intro: 'For thoughtful, stimulating conversations, our creative and intellectual AI bots offer a unique roleplay experience. Chat with passionate artists, eccentric scientists, elegant conductors, and wise mentors. These characters inspire creativity and deep discussions.',
    keywords: 'creative ai bot, intellectual ai character, artist ai roleplay, scientist ai bot, mentor ai chat, smart ai character, free creative ai',
    filter: c => ['Creative', 'Intellectual', 'Eccentric', 'Whimsical', 'Charismatic', 'Mature', 'Celebrity', 'Mystery'].includes(c.type) || ['Artist', 'Scientist', 'Conductor', 'Curator', 'Designer', 'Photographer', 'Host', 'Performer', 'Chef', 'Instructor', 'Fortune Teller', 'Tea Master', 'Biologist', 'Hermit'].includes(c.category)
  },
  'anime': {
    title: 'Character AI Anime Bots - Best Anime Roleplay Characters',
    h1: 'Character AI Anime Bots & Roleplay Chatbots',
    description: 'Explore anime-inspired AI characters for roleplay, including heroes, rivals, supernatural personalities and characters inspired by popular series and games.',
    intro: 'Anime AI characters work especially well for expressive, story-driven roleplay. This collection brings together recognizable archetypes, dramatic personalities, supernatural powers, school settings and action-focused scenarios. Compare each character’s difficulty, personality and supported chat platforms before starting a conversation.',
    keywords: 'anime ai characters, anime character ai bots, anime roleplay bots, anime ai chat, best anime ai characters',
    filter: c => matchesKeywords(c, ['anime', 'genshin', 'jujutsu', 'demon slayer', 'spy x family', 'chainsaw', 'attack on titan', 'persona', 'honkai', 'league'])
  },
  'game': {
    title: 'Character AI Game Bots - Free Video Game Roleplay Characters',
    h1: 'Character AI Video Game Bots',
    description: 'Find AI roleplay characters inspired by popular video games, fantasy RPGs and science-fiction adventures.',
    intro: 'Game-inspired AI characters are a strong choice when you want familiar worlds, clear quests and established personality traits. This collection includes characters and archetypes connected with fantasy RPGs, competitive games and story-rich adventures, with scenario ideas for both newcomers and experienced roleplayers.',
    keywords: 'video game ai characters, game character ai bots, rpg ai roleplay, gaming ai chat characters',
    filter: c => matchesKeywords(c, ['genshin', 'persona', 'honkai', 'league', 'game'])
  },
  'horror': {
    title: 'Character AI Horror Bots - Free Dark Roleplay Characters',
    h1: 'Character AI Horror Bots for Roleplay',
    description: 'Discover horror AI characters for suspenseful roleplay, from obsessive personalities to demons, ghosts, vampires and other dark supernatural characters.',
    intro: 'Horror roleplay depends on atmosphere, tension and clear boundaries. These characters support darker story hooks involving supernatural encounters, psychological suspense and dangerous devotion. Review the difficulty and scenario suggestions on each page, and choose a platform whose safety controls fit your preferences.',
    keywords: 'horror ai bots, scary character ai, dark roleplay ai, supernatural horror chatbots, yandere horror ai',
    filter: c => matchesKeywords(c, ['horror', 'yandere', 'demon', 'ghost', 'vampire', 'werewolf', 'succubus'])
  },
  'supernatural': {
    title: 'Character AI Supernatural Bots - Free Ghost and Demon Characters',
    h1: 'Character AI Supernatural Bots',
    description: 'Chat with supernatural AI characters including ghosts, vampires, demons, angels, witches, spirits and werewolves.',
    intro: 'Supernatural characters open the door to folklore, magic, mystery and dark fantasy. This collection covers both gentle and intense personalities, so you can compare tone, roleplay difficulty and platform availability before choosing a character for your next story.',
    keywords: 'supernatural ai characters, ghost ai bot, vampire character ai, demon ai chat, witch ai roleplay',
    filter: c => matchesKeywords(c, ['supernatural', 'ghost', 'vampire', 'demon', 'angel', 'witch', 'spirit', 'werewolf'])
  },
  'wholesome': {
    title: 'Character AI Wholesome Bots - Free Comfort Chat Characters',
    h1: 'Character AI Wholesome Bots',
    description: 'Find friendly, comforting AI characters for relaxed conversations, gentle roleplay and supportive slice-of-life stories.',
    intro: 'Not every roleplay needs high stakes. Wholesome AI characters focus on friendship, encouragement, everyday settings and slow-paced storytelling. These picks are suited to users who prefer café conversations, creative hobbies, supportive companions and low-pressure scenarios.',
    keywords: 'wholesome ai characters, comfort ai chat, friendly character ai bots, slice of life ai roleplay',
    filter: c => matchesKeywords(c, ['wholesome', 'comfort', 'friend', 'cafe', 'florist'])
  },
  'mystery': {
    title: 'Character AI Mystery Bots - Free Detective Roleplay Characters',
    h1: 'Character AI Mystery & Detective Bots',
    description: 'Solve cases and uncover secrets with detective, hacker, phantom thief and fortune-teller AI characters.',
    intro: 'Mystery AI roleplay works best when a character has a goal, clues and room for collaborative problem-solving. These characters support investigations, secret identities, supernatural mysteries and technology-driven plots. Start with a clear setting and let each reply advance the case.',
    keywords: 'mystery ai characters, detective ai bot, investigation roleplay ai, mystery character ai chat',
    filter: c => matchesKeywords(c, ['mystery', 'detective', 'hacker', 'phantom', 'fortune'])
  },
  'companions': {
    title: 'Character AI Companion Bots - Free AI Friend Characters',
    h1: 'Character AI Companion Bots',
    description: 'Compare AI companion characters designed for friendship, romance, supportive conversation and ongoing roleplay.',
    intro: 'AI companion characters emphasize continuity, relationship-building and approachable conversation starters. This collection includes friends, partners, roommates and digital companions across several platforms. Use the character pages to compare personality, scenarios and roleplay difficulty.',
    keywords: 'ai companion characters, ai girlfriend character, ai boyfriend bot, virtual companion roleplay, companion ai chat',
    filter: c => matchesKeywords(c, ['companion', 'girlfriend', 'boyfriend', 'friend', 'roommate'])
  },
  'historical': {
    title: 'Character AI Historical Bots - Free Samurai and Medieval Characters',
    h1: 'Character AI Historical & Traditional Bots',
    description: 'Explore historical and traditional AI roleplay characters, including samurai, tea masters, shrine figures, pirates, knights and scholars.',
    intro: 'Historical and traditional character roleplay benefits from a strong setting and period-appropriate goals. These characters provide starting points for court intrigue, exploration, mentorship, folklore and adventure while remaining flexible enough for alternate-history stories.',
    keywords: 'historical ai characters, samurai ai bot, medieval character ai, traditional roleplay ai, historical chatbots',
    filter: c => matchesKeywords(c, ['historical', 'samurai', 'tea master', 'shrine', 'pirate', 'knight', 'archaeologist'])
  }
};

function escapeHtml(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function getTypeLabel(slug) {
  const labels = {
    'action-adventure': 'Action Adventure',
    'sci-fi': 'Sci-Fi',
  };
  return labels[slug] || slug.split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
}

const outputDir = path.join(__dirname, 'type');
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

Object.entries(typeGroups).forEach(([slug, group]) => {
  const chars = charactersData.filter(group.filter);
  if (chars.length === 0) return;
  const popularChars = [...chars].sort((a, b) => (b.popularity || 0) - (a.popularity || 0)).slice(0, 3);
  const typeLabel = getTypeLabel(slug);
  const pageTitle = `${typeLabel} Character AI Bots – Free ${typeLabel} AI Chat Characters | CharacterAIBots`;
  const categoryLabel = group.h1.replace(/^Best /, '').replace(/ for .+$/, '');
  const expandedIntro = `${group.intro} These Character AI bot lists are built to capture specific character ai searches by type and roleplay intent. Use the filters and profile details to compare personality, difficulty, rating and supported platform instead of choosing from a thumbnail alone. A strong match should fit the tone you want, provide a clear scenario and offer enough personality detail to sustain a longer conversation. Start with an Easy-rated option if you are new to AI roleplay, or choose a more demanding character when you want conflict, mystery or a slower relationship arc. Every listing links to a detailed profile with conversation ideas and similar recommendations. Because availability and platform behavior can change, review the destination platform's current rules before chatting. This directory is independent and does not host the conversations itself; it helps you compare characters across Character.AI, JanitorAI and SpicyChat.`;
  const faqs = [
    {
      question: `What are ${categoryLabel.toLowerCase()}?`,
      answer: `${categoryLabel} are AI-driven personalities designed for interactive conversation and story-based roleplay. The characters in this collection are organized by theme, personality and common scenarios.`
    },
    {
      question: `How do I choose a ${categoryLabel.toLowerCase()}?`,
      answer: `Compare the character's personality, difficulty, rating, scenario ideas and supported platforms. Beginners should start with a clear premise and an Easy-rated character before trying more complex storylines.`
    },
    {
      question: `Are these ${categoryLabel.toLowerCase()} free?`,
      answer: `The directory is free to browse. Linked platforms may apply their own account requirements, message limits or paid features, so verify the current terms on the platform before starting.`
    }
  ];

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
    <title>${escapeHtml(pageTitle)}</title>
    <meta name="description" content="${escapeHtml(group.description)}">
    <meta name="keywords" content="${group.keywords}">

    <meta property="og:title" content="${escapeHtml(pageTitle)}">
    <meta property="og:description" content="${escapeHtml(group.description)}">
    <meta property="og:type" content="website">
    <meta property="og:url" content="${SITE_URL}/type/${slug}">
    <meta property="og:image" content="${SITE_URL}/images/og-image.jpg">

    <link rel="stylesheet" href="../style.css">
    <link rel="canonical" href="${SITE_URL}/type/${slug}">

    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "${escapeHtml(pageTitle)}",
      "description": "${escapeHtml(group.description)}",
      "url": "${SITE_URL}/type/${slug}",
      "dateModified": "${LAST_REVIEWED}",
      "numberOfItems": ${chars.length},
      "hasPart": [${chars.map(c => `{"@type":"CreativeWork","name":"${escapeHtml(c.name)}","url":"https://www.characteraibots.com/characters/${c.id}"}`).join(',')}]
    }
    </script>
    <script type="application/ld+json">
    ${JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map(faq => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: { '@type': 'Answer', text: faq.answer }
      }))
    })}
    </script>
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.characteraibots.com"},
        {"@type": "ListItem", "position": 2, "name": "${escapeHtml(pageTitle)}"}
      ]
    }
    </script>
</head>
<body>
    <header>
        <nav>
            <div class="logo"><a href="../index.html" style="color: white; text-decoration: none;" title="${SITE_NAME} Home">🧭 ${SITE_NAME}</a></div>
            <ul class="nav-links">
                <li><a href="../index.html" title="Home">Home</a></li>
                <li><a href="../search.html" title="Search">Search</a></li>
                <li><a href="../blog/" title="Blog">Blog</a></li>
                <li><a href="../quiz.html" title="Quiz">Quiz</a></li>
            </ul>
        </nav>
    </header>

    <main>
    <section class="type-hero">
        <div class="type-hero-content">
            <nav class="breadcrumb" aria-label="Breadcrumb">
                <a href="../index.html">Home</a> &rsaquo; <span>${escapeHtml(pageTitle)}</span>
            </nav>
            <h1>${group.h1}</h1>
            <p class="type-hero-desc">${group.description}</p>
            <p class="type-hero-count">${chars.length} characters available — all free</p>
            <p class="last-reviewed">Editorially reviewed <time datetime="${LAST_REVIEWED}">${LAST_REVIEWED}</time></p>
        </div>
    </section>

    <section class="type-intro">
        <div class="type-intro-content">
            <p>${expandedIntro}</p>
        </div>
    </section>

    <section class="type-browse" aria-labelledby="popular-${slug}">
        <h2 id="popular-${slug}">Popular ${categoryLabel}</h2>
        <div class="type-links">
            ${popularChars.map(char => `<a href="../characters/${char.id}.html" class="type-link-card"><strong>${escapeHtml(char.name)}</strong><span>⭐ ${char.rating} · ${escapeHtml(char.type)}</span></a>`).join('\n            ')}
        </div>
    </section>

    <section class="characters-section">
        <h2>Browse ${group.h1} (${chars.length})</h2>
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

    <section class="type-intro" aria-labelledby="faq-${slug}">
        <div class="type-intro-content">
            <h2 id="faq-${slug}">${categoryLabel} FAQ</h2>
            ${faqs.map(faq => `<h3>${escapeHtml(faq.question)}</h3><p>${escapeHtml(faq.answer)}</p>`).join('\n            ')}
        </div>
    </section>

    <section class="cta-section">
        <div class="cta-content">
            <h2>Explore ${group.h1}</h2>
            <p>All characters are free on Character.AI, JanitorAI, and SpicyChat. Pick a character above and start your adventure!</p>
            <a href="../index.html" class="cta-button">Browse All Characters</a>
        </div>
    </section>
    </main>

    <footer>
        <div class="footer-content">
            <div class="footer-section">
                <h4>${SITE_NAME}</h4>
                <p>Discover the best AI roleplay character bots across multiple platforms.</p>
            </div>
            <div class="footer-section">
                <h4>Quick Links</h4>
                <ul>
                    <li><a href="../index.html">Home</a></li>
                    <li><a href="../search.html">Search</a></li>
                    <li><a href="../blog/">Blog</a></li>
                    <li><a href="../quiz.html">Quiz</a></li>
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
            <p>&copy; 2026 ${SITE_NAME}. Independent directory.</p>
            <p class="trademark-disclaimer"><strong>Disclaimer:</strong> ${DISCLAIMER}</p>
        </div>
    </footer>
</body>
</html>`;

  fs.writeFileSync(path.join(outputDir, `${slug}.html`), html);
  console.log(`✓ Generated type/${slug}.html (${chars.length} characters)`);
});

console.log(`\n✅ Generated ${Object.keys(typeGroups).length} type pages!`);
