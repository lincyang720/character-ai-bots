#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const blogDir = path.join(__dirname, 'blog');
if (!fs.existsSync(blogDir)) fs.mkdirSync(blogDir, { recursive: true });

function escapeHtml(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// Load blog post content from blog-data/ directory
const dataDir = path.join(__dirname, 'blog-data');
const posts = JSON.parse(fs.readFileSync(path.join(dataDir, 'posts.json'), 'utf8'));

// Load HTML content for each post
posts.forEach(post => {
  const contentFile = path.join(dataDir, `${post.slug}.html`);
  if (fs.existsSync(contentFile)) {
    post.content = fs.readFileSync(contentFile, 'utf8');
  } else {
    console.warn(`⚠ Missing content file: ${contentFile}`);
    post.content = '<p>Coming soon...</p>';
  }
});

// Generate individual blog post pages
posts.forEach(post => {
  const otherPosts = posts.filter(p => p.slug !== post.slug).slice(0, 3);

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
    <title>${escapeHtml(post.title)} | Character AI Bots Blog</title>
    <meta name="description" content="${escapeHtml(post.description)}">
    <meta name="keywords" content="${post.keywords}">

    <meta property="og:title" content="${escapeHtml(post.title)}">
    <meta property="og:description" content="${escapeHtml(post.description)}">
    <meta property="og:type" content="article">
    <meta property="og:url" content="https://www.characteraibots.com/blog/${post.slug}">
    <meta property="article:published_time" content="${post.date}T00:00:00Z">

    <link rel="stylesheet" href="../style.css">
    <link rel="canonical" href="https://www.characteraibots.com/blog/${post.slug}">

    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": "${escapeHtml(post.title)}",
      "description": "${escapeHtml(post.description)}",
      "datePublished": "${post.date}",
      "dateModified": "${post.date}",
      "author": {"@type": "Organization", "name": "Character AI Bots"},
      "publisher": {"@type": "Organization", "name": "Character AI Bots"},
      "url": "https://www.characteraibots.com/blog/${post.slug}",
      "mainEntityOfPage": "https://www.characteraibots.com/blog/${post.slug}"
    }
    </script>
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.characteraibots.com"},
        {"@type": "ListItem", "position": 2, "name": "Blog", "item": "https://www.characteraibots.com/blog/"},
        {"@type": "ListItem", "position": 3, "name": "${escapeHtml(post.title)}"}
      ]
    }
    </script>
</head>
<body>
    <header>
        <nav>
            <div class="logo"><a href="../index.html" style="color: white; text-decoration: none;" title="Character AI Bots Home">🤖 Character AI Bots</a></div>
            <ul class="nav-links">
                <li><a href="../index.html">Home</a></li>
                <li><a href="../search.html">Search</a></li>
                <li><a href="./">Blog</a></li>
            </ul>
        </nav>
    </header>

    <main>
    <article class="blog-post">
        <div class="blog-hero">
            <nav class="breadcrumb" aria-label="Breadcrumb">
                <a href="../index.html">Home</a> &rsaquo; <a href="./">Blog</a> &rsaquo; <span>${escapeHtml(post.title)}</span>
            </nav>
            <div class="blog-hero-emoji">${post.heroEmoji}</div>
            <h1>${escapeHtml(post.title)}</h1>
            <div class="blog-meta">
                <span class="blog-date">📅 ${post.date}</span>
                <span class="blog-read-time">⏱ ${post.readTime}</span>
                <span class="blog-category">${post.category}</span>
            </div>
        </div>

        <div class="blog-content">
            ${post.content}
        </div>
    </article>

    <section class="blog-related">
        <h2>More from the Blog</h2>
        <div class="blog-grid">
            ${otherPosts.map(p => `
            <a href="${p.slug}.html" class="blog-card">
                <div class="blog-card-emoji">${p.heroEmoji}</div>
                <span class="blog-card-category">${p.category}</span>
                <h3>${escapeHtml(p.title)}</h3>
                <p>${escapeHtml(p.description.substring(0, 120))}...</p>
                <span class="blog-card-meta">${p.date} · ${p.readTime}</span>
            </a>`).join('\n')}
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
                    <li><a href="./">Blog</a></li>
                </ul>
            </div>
            <div class="footer-section">
                <h4>Character Types</h4>
                <ul>
                    <li><a href="../type/yandere.html">Yandere Bots</a></li>
                    <li><a href="../type/fantasy.html">Fantasy Bots</a></li>
                    <li><a href="../type/romance.html">Romance Bots</a></li>
                    <li><a href="../type/vampire.html">Vampire Bots</a></li>
                    <li><a href="../type/sci-fi.html">Sci-Fi Bots</a></li>
                </ul>
            </div>
        </div>
        <div class="footer-bottom">
            <p>&copy; 2026 Character AI Bots. For entertainment purposes only.</p>
        </div>
    </footer>
</body>
</html>`;

  fs.writeFileSync(path.join(blogDir, `${post.slug}.html`), html);
  console.log(`✓ Generated blog/${post.slug}.html`);
});

// Generate blog index page
const indexHtml = `<!DOCTYPE html>
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
    <title>AI Roleplay Blog — Tips, Guides & Character Reviews | Character AI Bots</title>
    <meta name="description" content="AI roleplay tips, platform comparisons, character guides, and more. Learn how to get the best experience from Character.AI, JanitorAI, and SpicyChat.">
    <meta name="keywords" content="ai roleplay blog, character ai tips, ai chatbot guide, roleplay tips, ai character reviews">

    <meta property="og:title" content="AI Roleplay Blog | Character AI Bots">
    <meta property="og:description" content="Tips, guides, and character reviews for AI roleplay across all platforms.">
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://www.characteraibots.com/blog/">

    <link rel="stylesheet" href="../style.css">
    <link rel="canonical" href="https://www.characteraibots.com/blog/">

    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Blog",
      "name": "Character AI Bots Blog",
      "description": "AI roleplay tips, guides, and character reviews",
      "url": "https://www.characteraibots.com/blog/",
      "blogPost": [${posts.map(p => `{"@type":"BlogPosting","headline":"${escapeHtml(p.title)}","datePublished":"${p.date}","url":"https://www.characteraibots.com/blog/${p.slug}"}`).join(',')}]
    }
    </script>
</head>
<body>
    <header>
        <nav>
            <div class="logo"><a href="../index.html" style="color: white; text-decoration: none;" title="Character AI Bots Home">🤖 Character AI Bots</a></div>
            <ul class="nav-links">
                <li><a href="../index.html">Home</a></li>
                <li><a href="../search.html">Search</a></li>
                <li><a href="./" class="active">Blog</a></li>
            </ul>
        </nav>
    </header>

    <main>
    <section class="blog-index-hero">
        <h1>AI Roleplay Blog</h1>
        <p>Tips, guides, platform comparisons, and character reviews to level up your AI roleplay experience.</p>
    </section>

    <section class="blog-index">
        <div class="blog-grid">
            ${posts.map(p => `
            <a href="${p.slug}.html" class="blog-card">
                <div class="blog-card-emoji">${p.heroEmoji}</div>
                <span class="blog-card-category">${p.category}</span>
                <h3>${escapeHtml(p.title)}</h3>
                <p>${escapeHtml(p.description)}</p>
                <span class="blog-card-meta">${p.date} · ${p.readTime}</span>
            </a>`).join('\n')}
        </div>
    </section>

    <section class="cta-section">
        <div class="cta-content">
            <h2>Ready to Start Roleplaying?</h2>
            <p>Browse our collection of 50+ AI characters across Character.AI, JanitorAI, and SpicyChat.</p>
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
                    <li><a href="./">Blog</a></li>
                </ul>
            </div>
            <div class="footer-section">
                <h4>Character Types</h4>
                <ul>
                    <li><a href="../type/yandere.html">Yandere Bots</a></li>
                    <li><a href="../type/fantasy.html">Fantasy Bots</a></li>
                    <li><a href="../type/romance.html">Romance Bots</a></li>
                    <li><a href="../type/vampire.html">Vampire Bots</a></li>
                    <li><a href="../type/sci-fi.html">Sci-Fi Bots</a></li>
                </ul>
            </div>
        </div>
        <div class="footer-bottom">
            <p>&copy; 2026 Character AI Bots. For entertainment purposes only.</p>
        </div>
    </footer>
</body>
</html>`;

fs.writeFileSync(path.join(blogDir, 'index.html'), indexHtml);
console.log(`✓ Generated blog/index.html`);

console.log(`\n✅ Generated ${posts.length} blog posts + index page!`);
