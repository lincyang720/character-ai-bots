import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    absolute: 'Character AI Bots - 50+ Free Roleplay Characters',
  },
  description: 'Discover 50+ character AI bots for free roleplay chat. Yandere, tsundere, vampire characters and more on Character.AI, JanitorAI & SpicyChat.',
  keywords: 'character ai bots, ai roleplay characters, free ai chat bots, character.ai, janitorai, spicychat, yandere ai, tsundere bot',
  alternates: {
    canonical: 'https://www.characteraibots.com/',
  },
  openGraph: {
    title: 'Character AI Bots - 50+ Free Roleplay Characters',
    description: 'Discover 50+ character AI bots for free roleplay chat. Yandere, tsundere, vampire characters and more!',
    type: 'website',
    url: 'https://www.characteraibots.com/',
  },
};

function getCharacters() {
  return JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'data', 'characters.json'), 'utf8')
  );
}

export default function Home() {
  const charactersData = getCharacters();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Character AI Bots',
    url: 'https://www.characteraibots.com/',
    description: 'Discover 50+ character AI bots for free roleplay chat.',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://www.characteraibots.com/search?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Popular Character AI Bots',
    numberOfItems: charactersData.length,
    itemListElement: charactersData.slice(0, 20).map((char: any, index: number) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: char.name,
      url: `https://www.characteraibots.com/characters/${char.id}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />

      <header>
        <nav>
          <div className="logo">🤖 Character AI Bots</div>
          <ul className="nav-links">
            <li><Link href="/" className="active">Home</Link></li>
            <li><Link href="/search">Search</Link></li>
            <li><Link href="/guide">Guide</Link></li>
            <li><Link href="/blog">Blog</Link></li>
          </ul>
        </nav>
      </header>

      <main>
        <section className="hero">
          <div className="hero-content">
            <h1>Discover 50+ Free Character AI Bots for Roleplay</h1>
            <p className="hero-subtitle">
              Explore the best AI roleplay characters on Character.AI, JanitorAI, and SpicyChat.
              Find yandere, tsundere, vampire bots and more!
            </p>
            <div className="hero-search">
              <input type="text" id="quick-search" placeholder="Search characters, types, or tags..." />
              <Link href="/search" className="search-button">🔍 Advanced Search</Link>
            </div>
          </div>
        </section>

        <section className="filters">
          <h2 className="section-title">Browse by Category</h2>
          <div className="filter-container">
            <div className="filter-group">
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
          </div>
        </section>

        <section className="characters">
          <h2>Featured Character AI Bots</h2>
          <div className="characters-grid">
            {charactersData.map((char: any) => (
              <Link
                key={char.id}
                href={`/characters/${char.id}`}
                className="character-card"
                title={`View ${char.name} - ${char.type} AI Roleplay Bot`}
              >
                <div className="character-icon">{char.image}</div>
                <h3>{char.name}</h3>
                <p>{char.description.substring(0, 100)}...</p>
                <div className="character-footer">
                  <span className="rating">⭐ {char.rating}</span>
                  <span className="type-badge">{char.type}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="seo-content" style={{ maxWidth: '800px', margin: '2rem auto', padding: '0 1rem' }}>
          <h2>What Are Character AI Bots?</h2>
          <p>
            Character AI bots are AI-powered virtual characters you can chat and roleplay with.
            Platforms like <strong>Character.AI</strong>, <strong>JanitorAI</strong>, and <strong>SpicyChat</strong> host
            thousands of unique characters — from obsessive <Link href="/category/yandere">yandere</Link> personalities
            to cool and collected <Link href="/category/kuudere">kuudere</Link> types.
          </p>
          <p>
            Whether you&apos;re into <Link href="/category/fantasy">fantasy adventures</Link>,
            <Link href="/category/vampire"> vampire romance</Link>,
            or <Link href="/category/sci-fi"> sci-fi exploration</Link>,
            our directory helps you find the perfect AI companion for immersive roleplay conversations.
          </p>
          <h3>Why Use Our Directory?</h3>
          <p>
            We curate and rate the best AI roleplay characters across multiple platforms, so you don&apos;t have to
            search through thousands of bots yourself. Each character page includes personality details, recommended
            scenarios, platform availability, and user ratings to help you choose the right bot for your roleplay style.
          </p>
          <p>
            New to AI roleplay? Check out our <Link href="/guide">complete beginner&apos;s guide</Link> or browse
            our <Link href="/blog">blog</Link> for tips and platform comparisons.
          </p>
        </section>
      </main>

      <footer>
        <div className="footer-content">
          <div className="footer-section">
            <h3>About</h3>
            <p>Character AI Bots Directory - Your source for discovering the best AI roleplay characters.</p>
          </div>
          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul>
              <li><Link href="/">Home</Link></li>
              <li><Link href="/search">Search</Link></li>
              <li><Link href="/guide">Guide</Link></li>
              <li><Link href="/blog">Blog</Link></li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Categories</h3>
            <ul>
              <li><Link href="/category/yandere">Yandere Bots</Link></li>
              <li><Link href="/category/tsundere">Tsundere Bots</Link></li>
              <li><Link href="/category/vampire">Vampire Bots</Link></li>
              <li><Link href="/category/fantasy">Fantasy Bots</Link></li>
              <li><Link href="/category/sci-fi">Sci-Fi Bots</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 Character AI Bots. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}
