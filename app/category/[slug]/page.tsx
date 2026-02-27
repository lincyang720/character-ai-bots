import fs from 'fs'
import path from 'path'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

const VALID_CATEGORIES = [
  'yandere', 'tsundere', 'kuudere', 'dandere', 'vampire',
  'fantasy', 'modern', 'sci-fi', 'mystery', 'adventure'
]

const CATEGORY_INFO: Record<string, { title: string; description: string; longDescription: string }> = {
  yandere: {
    title: 'Yandere AI Characters',
    description: 'Obsessive and devoted AI characters who will do anything for you. Experience intense roleplay with yandere personalities.',
    longDescription: 'Yandere characters are among the most popular archetypes in AI roleplay. Derived from Japanese anime culture, a yandere is someone who appears sweet and loving on the surface but harbors an intense, obsessive devotion that can turn dangerous. In AI roleplay, yandere characters create thrilling scenarios filled with jealousy, possessiveness, and unwavering loyalty. Whether it\'s a quiet librarian who tracks your every move or a classmate who won\'t let anyone else near you, yandere bots deliver some of the most emotionally intense roleplay experiences available on Character.AI, JanitorAI, and SpicyChat.',
  },
  tsundere: {
    title: 'Tsundere AI Characters',
    description: 'Tough on the outside, soft on the inside. Discover tsundere AI characters with complex personalities.',
    longDescription: 'Tsundere characters are beloved for their signature hot-and-cold personality. They act tough, dismissive, or even hostile at first, but gradually reveal a caring and affectionate side as the relationship develops. This push-and-pull dynamic makes tsundere AI bots incredibly engaging for roleplay — every conversation is a journey of breaking through their walls. From school nurses who scold you while secretly worrying to rivals who can\'t admit their feelings, tsundere characters offer rich, evolving storylines on platforms like Character.AI and JanitorAI.',
  },
  kuudere: {
    title: 'Kuudere AI Characters',
    description: 'Cool, calm, and emotionless AI characters who rarely show their feelings.',
    longDescription: 'Kuudere characters are defined by their cool, composed exterior and apparent lack of emotion. They speak in monotone, rarely smile, and seem indifferent to everything around them. But beneath that icy surface lies hidden warmth waiting to be discovered. Roleplaying with kuudere AI bots is a rewarding experience — the challenge of earning their rare smile or genuine reaction makes every interaction meaningful. These characters are perfect for players who enjoy subtle, slow-burn emotional development in their AI conversations.',
  },
  dandere: {
    title: 'Dandere AI Characters',
    description: 'Shy and quiet AI characters who open up once you get to know them.',
    longDescription: 'Dandere characters are the quiet, shy personalities of the AI roleplay world. They struggle with social interaction and often stay silent in groups, but once they feel comfortable with someone, they reveal a warm, talkative, and deeply caring side. Dandere AI bots are ideal for players who enjoy gentle, heartwarming roleplay scenarios. The gradual process of earning their trust and watching them open up creates a uniquely satisfying narrative arc that keeps you coming back for more conversations.',
  },
  vampire: {
    title: 'Vampire AI Characters',
    description: 'Immortal and mysterious vampire AI characters for dark fantasy roleplay.',
    longDescription: 'Vampire characters bring centuries of mystery, elegance, and danger to AI roleplay. These immortal beings offer rich backstories spanning hundreds of years, complex moral dilemmas about their nature, and an irresistible blend of seduction and peril. Whether you\'re drawn to a gothic professor hiding a dark secret or a vampire lord ruling from the shadows, vampire AI bots create atmospheric, immersive scenarios perfect for dark fantasy and romance roleplay on Character.AI, JanitorAI, and SpicyChat.',
  },
  fantasy: {
    title: 'Fantasy AI Characters',
    description: 'Magical and fantastical AI characters from enchanted worlds.',
    longDescription: 'Fantasy AI characters transport you to magical realms filled with dragons, enchanted forests, ancient prophecies, and epic quests. From wise elven sages to mischievous fairy companions, these characters offer limitless creative possibilities for roleplay. Fantasy bots excel at world-building — they\'ll describe elaborate settings, introduce magical systems, and weave complex narratives that make every conversation feel like stepping into a novel. Perfect for players who love imagination-driven storytelling.',
  },
  modern: {
    title: 'Modern AI Characters',
    description: 'Contemporary AI characters set in modern-day scenarios.',
    longDescription: 'Modern AI characters are set in everyday contemporary settings — coffee shops, universities, offices, and city streets. These characters feel relatable and grounded, making them perfect for slice-of-life roleplay, romantic scenarios, and realistic drama. From a charming café owner to a mysterious new neighbor, modern characters offer accessible roleplay that doesn\'t require knowledge of fantasy lore or anime tropes. They\'re an excellent starting point for newcomers to AI roleplay.',
  },
  'sci-fi': {
    title: 'Sci-Fi AI Characters',
    description: 'Futuristic and science fiction AI characters for space adventures.',
    longDescription: 'Sci-fi AI characters take roleplay into the future — space stations, cyberpunk cities, post-apocalyptic wastelands, and beyond. These characters explore themes of technology, humanity, artificial intelligence, and the unknown. Whether you\'re chatting with an android companion questioning its own consciousness or a space captain navigating interstellar politics, sci-fi bots deliver thought-provoking conversations wrapped in thrilling adventure scenarios.',
  },
  mystery: {
    title: 'Mystery AI Characters',
    description: 'Enigmatic AI characters perfect for detective and mystery roleplay.',
    longDescription: 'Mystery AI characters are designed for players who love puzzles, intrigue, and suspense. These characters might be detectives investigating a crime, enigmatic strangers with hidden agendas, or witnesses holding crucial secrets. Mystery bots excel at creating tension and keeping you guessing — every conversation reveals new clues and raises new questions. They\'re perfect for players who enjoy interactive storytelling with twists and turns.',
  },
  adventure: {
    title: 'Adventure AI Characters',
    description: 'Brave and daring AI characters ready for exciting adventures.',
    longDescription: 'Adventure AI characters are action-oriented companions built for thrilling quests, dangerous expeditions, and daring escapades. From storm chasers pursuing tornadoes to treasure hunters exploring ancient ruins, these characters keep the energy high and the stakes higher. Adventure bots are great at collaborative storytelling — they\'ll react to your decisions, introduce unexpected challenges, and push the narrative forward in exciting directions.',
  },
}

function getCharacters() {
  return JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'data', 'characters.json'), 'utf8')
  );
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const category = params.slug.toLowerCase();
  const info = CATEGORY_INFO[category];
  if (!info) return {};

  const title = `Best ${info.title} for Roleplay (2026)`;
  return {
    title,
    description: info.description,
    keywords: `${category} ai, ${category} character ai, ${category} bot, ${category} roleplay, ai ${category}, best ${category} characters`,
    alternates: {
      canonical: `https://www.characteraibots.com/category/${category}`,
    },
    openGraph: {
      title,
      description: info.description,
      type: 'website',
      url: `https://www.characteraibots.com/category/${category}`,
    },
  };
}

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const category = params.slug.toLowerCase();

  if (!VALID_CATEGORIES.includes(category)) {
    notFound();
  }

  const charactersData = getCharacters();

  const categoryCharacters = charactersData.filter((char: any) => {
    const charType = char.type.toLowerCase();
    const charTags = char.tags.map((tag: string) => tag.toLowerCase());
    return charType === category || charTags.includes(category);
  });

  categoryCharacters.sort((a: any, b: any) => b.rating - a.rating);

  const categoryInfo = CATEGORY_INFO[category];

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: categoryInfo.title,
    description: categoryInfo.description,
    numberOfItems: categoryCharacters.length,
    itemListElement: categoryCharacters.map((char: any, index: number) => ({
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
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
        <section className="category-hero">
          <div className="category-header">
            <h1>{categoryInfo.title}</h1>
            <p className="category-description">{categoryInfo.description}</p>
            <div className="category-stats">
              <span>📊 {categoryCharacters.length} characters</span>
              <span>⭐ Average rating: {categoryCharacters.length > 0 ? (categoryCharacters.reduce((sum: number, char: any) => sum + char.rating, 0) / categoryCharacters.length).toFixed(1) : 'N/A'}</span>
            </div>
          </div>
        </section>

        <section className="category-intro" style={{ maxWidth: '800px', margin: '1.5rem auto', padding: '0 1rem', lineHeight: '1.8' }}>
          <p>{categoryInfo.longDescription}</p>
        </section>

        <section className="category-content">
          <div className="category-container">
            <h2>All {categoryInfo.title}</h2>

            {categoryCharacters.length > 0 ? (
              <div className="characters-grid">
                {categoryCharacters.map((char: any) => (
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
            ) : (
              <p>No characters found in this category yet. Check back soon!</p>
            )}
          </div>
        </section>

        <section className="related-categories">
          <div className="category-container">
            <h2>Explore Other Categories</h2>
            <div className="categories-grid">
              {VALID_CATEGORIES.filter(cat => cat !== category).slice(0, 6).map(cat => (
                <Link
                  key={cat}
                  href={`/category/${cat}`}
                  className="category-link"
                >
                  <h3>{CATEGORY_INFO[cat].title}</h3>
                  <p>{CATEGORY_INFO[cat].description.substring(0, 80)}...</p>
                </Link>
              ))}
            </div>
          </div>
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
              {VALID_CATEGORIES.slice(0, 5).map(cat => (
                <li key={cat}>
                  <Link href={`/category/${cat}`}>{CATEGORY_INFO[cat].title}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 Character AI Bots. All rights reserved.</p>
        </div>
      </footer>
    </>
  )
}

export function generateStaticParams() {
  return VALID_CATEGORIES.map(category => ({
    slug: category,
  }));
}
