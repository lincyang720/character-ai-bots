import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

function getCharacters() {
  return JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'data', 'characters.json'), 'utf8')
  );
}

function getCharacter(id: string) {
  const data = getCharacters();
  return data.find((c: any) => c.id === id);
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const character = getCharacter(params.id);
  if (!character) return {};

  const title = `${character.name} - ${character.type} AI Roleplay Character`;
  const description = `${character.description} Chat with ${character.name}, a ${character.type.toLowerCase()} AI character with ${character.personality.slice(0, 3).join(', ').toLowerCase()} traits. Available on ${Object.keys(character.platforms).join(', ')}.`;

  return {
    title,
    description: description.substring(0, 160),
    keywords: [...character.tags, `${character.type.toLowerCase()} ai bot`, character.name.toLowerCase(), 'character ai bots', 'ai roleplay'].join(', '),
    alternates: {
      canonical: `https://www.characteraibots.com/characters/${params.id}`,
    },
    openGraph: {
      title,
      description: description.substring(0, 160),
      type: 'article',
      url: `https://www.characteraibots.com/characters/${params.id}`,
    },
  };
}

const DIFFICULTY_TIPS: Record<string, string> = {
  Easy: 'This character is beginner-friendly. They respond well to simple prompts and are forgiving if you break character. A great choice if you\'re new to AI roleplay.',
  Medium: 'This character works best with moderate detail in your messages. Set the scene, describe your actions, and stay consistent with the scenario for the best experience.',
  Hard: 'This is an advanced character that rewards detailed, immersive roleplay. Use rich descriptions, stay in character, and build on the narrative for deeply engaging conversations.',
};

export default function CharacterPage({ params }: { params: { id: string } }) {
  const charactersData = getCharacters();
  const character = charactersData.find((c: any) => c.id === params.id);

  if (!character) {
    notFound();
  }

  const relatedCharacters = charactersData
    .filter((c: any) =>
      c.id !== character.id && (
        c.type === character.type ||
        c.tags.some((tag: string) => character.tags.includes(tag))
      )
    )
    .slice(0, 4);

  const platformNames = Object.keys(character.platforms);

  const faqItems = [
    {
      question: `Is ${character.name} suitable for beginners?`,
      answer: character.difficulty === 'Easy'
        ? `Yes! ${character.name} is rated as Easy difficulty, making them perfect for newcomers to AI roleplay.`
        : character.difficulty === 'Medium'
        ? `${character.name} is rated Medium difficulty. Some roleplay experience helps, but beginners can still enjoy chatting with this character.`
        : `${character.name} is rated Hard difficulty. They work best for experienced roleplayers who enjoy detailed, immersive scenarios.`,
    },
    {
      question: `Which platform is best for chatting with ${character.name}?`,
      answer: platformNames.includes('characterai')
        ? `Character.AI offers the most polished experience for ${character.name}. ${platformNames.includes('janitorai') ? 'JanitorAI is a great alternative if you want fewer content restrictions.' : ''}`
        : `${character.name} is available on ${platformNames.join(' and ')}, each offering a unique chat experience.`,
    },
    {
      question: `What type of character is ${character.name}?`,
      answer: `${character.name} is a ${character.type} character known for being ${character.personality.slice(0, 3).join(', ').toLowerCase()}. ${character.type} characters are popular in AI roleplay for their ${character.type === 'Yandere' ? 'intense devotion and possessive nature' : character.type === 'Tsundere' ? 'contrasting cold exterior and warm heart' : character.type === 'Kuudere' ? 'calm, emotionless demeanor hiding deep feelings' : character.type === 'Vampire' ? 'mysterious and seductive dark fantasy appeal' : 'unique and engaging personality traits'}.`,
    },
    {
      question: `Is it free to chat with ${character.name}?`,
      answer: `Yes! You can chat with ${character.name} for free on ${platformNames.includes('characterai') ? 'Character.AI' : platformNames[0]}. Some platforms offer premium tiers for faster responses and extra features.`,
    },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: character.name,
    description: character.description,
    url: `https://www.characteraibots.com/characters/${params.id}`,
    genre: `${character.type} AI Roleplay`,
    keywords: character.tags.join(', '),
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: character.rating,
      bestRating: 5,
      worstRating: 1,
      ratingCount: character.reviews,
    },
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <header>
        <nav>
          <div className="logo">🤖 Character AI Bots</div>
          <ul className="nav-links">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/search">Search</Link></li>
            <li><Link href="/guide">Guide</Link></li>
            <li><Link href="/blog">Blog</Link></li>
          </ul>
        </nav>
      </header>

      <main>
        <div className="character-detail">
          <div className="character-header">
            <div className="character-icon-large">{character.image}</div>
            <div className="character-info">
              <h1>{character.name} - {character.type} AI Roleplay Character</h1>
              <div className="character-meta">
                <span className="type-badge">{character.type}</span>
                <span className="rating">⭐ {character.rating}/5.0 ({character.reviews} reviews)</span>
                <span className="popularity">👥 {character.popularity} interactions</span>
                <span className="difficulty">📊 {character.difficulty} difficulty</span>
              </div>
              <p className="character-description">{character.description}</p>
            </div>
          </div>

          <section className="character-personality" style={{ margin: '2rem 0' }}>
            <h2>Personality Traits</h2>
            <p>{character.name} stands out with a rich blend of personality traits that make every conversation unique:</p>
            <div className="tags-list" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', margin: '1rem 0' }}>
              {character.personality.map((trait: string) => (
                <span key={trait} className="tag" style={{ padding: '0.4rem 0.8rem', borderRadius: '20px', background: '#f0f0f0' }}>
                  {trait}
                </span>
              ))}
            </div>
            <p>
              As a {character.type.toLowerCase()} character, {character.name} brings
              {character.personality.length > 2
                ? ` a compelling mix of ${character.personality[0].toLowerCase()} and ${character.personality[1].toLowerCase()} energy`
                : ` a distinctive ${character.personality[0].toLowerCase()} personality`}
              {' '}to every interaction. Whether you prefer lighthearted banter or deep, emotional roleplay,
              this character adapts to create memorable conversations.
            </p>
          </section>

          <section className="character-scenarios" style={{ margin: '2rem 0' }}>
            <h2>Roleplay Scenarios</h2>
            <p>Explore these curated scenarios designed to bring out the best of {character.name}&apos;s personality:</p>
            <div style={{ display: 'grid', gap: '1rem', margin: '1rem 0' }}>
              {character.scenarios.map((scenario: string, i: number) => (
                <div key={i} style={{ padding: '1rem', background: '#f8f9fa', borderRadius: '8px', borderLeft: '3px solid #6c5ce7' }}>
                  <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>🎭 {scenario}</h3>
                  <p style={{ margin: 0, color: '#666' }}>
                    Set the scene and let {character.name} guide the story. Use descriptive language and *actions* to make it immersive.
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="character-howto" style={{ margin: '2rem 0' }}>
            <h2>How to Chat with {character.name}</h2>
            <p>{DIFFICULTY_TIPS[character.difficulty] || DIFFICULTY_TIPS['Medium']}</p>
            <h3>Getting Started</h3>
            <ol>
              <li>Choose your platform: {character.name} is available on {platformNames.join(', ')}.</li>
              <li>Read the character description to understand their personality and background.</li>
              <li>Start with a scenario from the list above, or create your own.</li>
              <li>Use *asterisks* for actions and regular text for dialogue.</li>
              <li>Stay in character and build on the narrative for the best experience.</li>
            </ol>
            <h3>Pro Tips</h3>
            <ul>
              <li>Reference {character.name}&apos;s {character.personality[0].toLowerCase()} nature to trigger unique responses.</li>
              <li>Try different scenarios to discover hidden personality layers.</li>
              <li>Use the regenerate button if a response doesn&apos;t fit the mood you&apos;re going for.</li>
            </ul>
          </section>

          <div className="character-details-section">
            <h2>Character Details</h2>
            <div className="details-grid">
              <div className="detail-item">
                <strong>Type:</strong> <Link href={`/category/${character.type.toLowerCase()}`}>{character.type}</Link>
              </div>
              <div className="detail-item">
                <strong>Category:</strong> {character.category}
              </div>
              <div className="detail-item">
                <strong>Rating:</strong> {character.rating}/5.0 ({character.reviews} reviews)
              </div>
              <div className="detail-item">
                <strong>Difficulty:</strong> {character.difficulty}
              </div>
              <div className="detail-item">
                <strong>Popularity:</strong> {character.popularity} interactions
              </div>
            </div>
          </div>

          <div className="character-tags">
            <h2>Tags</h2>
            <div className="tags-list">
              {character.tags.map((tag: string) => (
                <Link key={tag} href={`/search?tag=${tag}`} className="tag">{tag}</Link>
              ))}
            </div>
          </div>

          <div className="character-platforms">
            <h2>Available On</h2>
            <div className="platforms-list">
              {Object.entries(character.platforms).map(([name, url]) => (
                <a
                  key={name}
                  href={url as string}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="platform-link"
                >
                  <span className="platform-name">{name}</span>
                  <span className="platform-arrow">→</span>
                </a>
              ))}
            </div>
          </div>

          <section className="character-faq" style={{ margin: '2rem 0' }}>
            <h2>Frequently Asked Questions</h2>
            {faqItems.map((item, i) => (
              <div key={i} style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{item.question}</h3>
                <p style={{ color: '#555', lineHeight: 1.6 }}>{item.answer}</p>
              </div>
            ))}
          </section>

          {relatedCharacters.length > 0 && (
            <div className="related-characters">
              <h2>Related Characters You Might Like</h2>
              <div className="characters-grid">
                {relatedCharacters.map((char: any) => (
                  <Link
                    key={char.id}
                    href={`/characters/${char.id}`}
                    className="character-card"
                    title={`${char.name} - ${char.type} AI Roleplay Character`}
                  >
                    <div className="character-icon">{char.image}</div>
                    <h4>{char.name}</h4>
                    <p>{char.description.substring(0, 80)}...</p>
                    <div className="character-footer">
                      <span className="rating">⭐ {char.rating}</span>
                      <span className="type-badge">{char.type}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
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
              <li><Link href="/category/yandere">Yandere</Link></li>
              <li><Link href="/category/tsundere">Tsundere</Link></li>
              <li><Link href="/category/vampire">Vampire</Link></li>
              <li><Link href="/category/fantasy">Fantasy</Link></li>
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

export async function generateStaticParams() {
  const charactersData = getCharacters();
  return charactersData.map((char: any) => ({
    id: char.id,
  }));
}
