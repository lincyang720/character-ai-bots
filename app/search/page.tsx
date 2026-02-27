import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import SearchClient from './SearchClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Search Character AI Bots - Find Perfect Roleplay Bot',
  description: 'Search 50+ character AI bots by type, personality, and tags. Find yandere, tsundere, vampire bots and more for Character.AI, JanitorAI & SpicyChat.',
  keywords: 'search character ai, find ai bots, character ai search, roleplay bot finder, ai character directory',
  alternates: {
    canonical: 'https://www.characteraibots.com/search',
  },
  openGraph: {
    title: 'Search Character AI Bots | Character AI Bots',
    description: 'Search 50+ character AI bots by type, personality, and tags.',
    type: 'website',
    url: 'https://www.characteraibots.com/search',
  },
}

export default async function SearchPage() {
  const charactersData = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'data', 'characters.json'), 'utf8')
  );

  const searchJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Search Character AI Bots',
    description: 'Search 50+ character AI bots by type, personality, and tags.',
    url: 'https://www.characteraibots.com/search',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://www.characteraibots.com/search?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(searchJsonLd) }} />

      <header>
        <nav>
          <div className="logo">🤖 Character AI Bots</div>
          <ul className="nav-links">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/search" className="active">Search</Link></li>
            <li><Link href="/guide">Guide</Link></li>
            <li><Link href="/blog">Blog</Link></li>
          </ul>
        </nav>
      </header>

      <main>
        <section className="search-hero">
          <h1>Search Character AI Bots</h1>
          <p>Find your perfect AI roleplay character from our collection of 50+ bots</p>
        </section>

        <SearchClient characters={charactersData} />
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
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 Character AI Bots. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}
