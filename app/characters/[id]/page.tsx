import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { notFound } from 'next/navigation';

// 这个函数在服务器端每次请求时运行（SSR）
export default async function CharacterPage({ params }: { params: { id: string } }) {
  // 从 JSON 文件读取所有角色数据
  const charactersData = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'data', 'characters.json'), 'utf8')
  );

  // 找到当前角色
  const character = charactersData.find((c: any) => c.id === params.id);

  // 如果角色不存在，返回 404
  if (!character) {
    notFound();
  }

  // 找到相关角色
  const relatedCharacters = charactersData
    .filter((c: any) =>
      c.id !== character.id && (
        c.type === character.type ||
        c.tags.some((tag: string) => character.tags.includes(tag))
      )
    )
    .slice(0, 3);

  return (
    <>
      <head>
        <title>{character.name} - {character.type} AI Roleplay Bot</title>
        <meta name="description" content={`${character.description.substring(0, 140)} Free ${character.type.toLowerCase()} AI character bot for roleplay on Character.AI, JanitorAI & SpicyChat.`} />
        <meta name="keywords" content={`${character.tags.join(', ')}, ${character.type.toLowerCase()} ai bot, ${character.name.toLowerCase()}, character ai bots, ai roleplay`} />
        <link rel="canonical" href={`https://characteraibots.com/characters/${params.id}`} />
      </head>

      <header>
        <nav>
          <div className="logo">🤖 Character AI Bots</div>
          <ul className="nav-links">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/search">Search</Link></li>
          </ul>
        </nav>
      </header>

      <main>
        <div className="character-detail">
          <div className="character-header">
            <div className="character-icon-large">{character.image}</div>
            <div className="character-info">
              <h1>{character.name}</h1>
              <div className="character-meta">
                <span className="type-badge">{character.type}</span>
                <span className="rating">⭐ {character.rating}</span>
                <span className="popularity">👥 {character.popularity} interactions</span>
              </div>
              <p className="character-description">{character.description}</p>
            </div>
          </div>

          <div className="character-details-section">
            <h2>Character Details</h2>
            <div className="details-grid">
              <div className="detail-item">
                <strong>Type:</strong> {character.type}
              </div>
              <div className="detail-item">
                <strong>Rating:</strong> {character.rating}/5.0
              </div>
              <div className="detail-item">
                <strong>Popularity:</strong> {character.popularity} interactions
              </div>
            </div>
          </div>

          <div className="character-tags">
            <h3>Tags</h3>
            <div className="tags-list">
              {character.tags.map((tag: string) => (
                <span key={tag} className="tag">{tag}</span>
              ))}
            </div>
          </div>

          <div className="character-platforms">
            <h3>Available On</h3>
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

          {relatedCharacters.length > 0 && (
            <div className="related-characters">
              <h3>Related Characters</h3>
              <div className="characters-grid">
                {relatedCharacters.map((char: any) => (
                  <Link
                    key={char.id}
                    href={`/characters/${char.id}`}
                    className="character-card"
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

// 生成静态参数（可选，用于优化）
export async function generateStaticParams() {
  const charactersData = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'data', 'characters.json'), 'utf8')
  );

  return charactersData.map((char: any) => ({
    id: char.id,
  }));
}
