import fs from 'fs';
import path from 'path';
import Link from 'next/link';

// 这个函数在服务器端每次请求时运行（SSR）
export default async function Home() {
  // 从 JSON 文件读取角色数据
  const charactersData = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'data', 'characters.json'), 'utf8')
  );

  return (
    <>
      <head>
        <title>Character AI Bots - 50+ Free Roleplay Characters</title>
        <meta name="description" content="Discover 50+ character AI bots for free roleplay chat. Yandere, tsundere, vampire characters and more on Character.AI, JanitorAI & SpicyChat." />
        <meta name="keywords" content="character ai bots, ai roleplay characters, free ai chat bots, character.ai, janitorai, spicychat, yandere ai, tsundere bot" />
        <link rel="canonical" href="https://characteraibots.com/" />
        <meta name="google-site-verification" content="OPQH_dX0XnvAd0ODbk5cDms96DTDRcgDkwoFUZw_eHw" />

        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-1JQKX49JMM"></script>
        <script dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-1JQKX49JMM');
          `
        }} />
      </head>

      <header>
        <nav>
          <div className="logo">🤖 Character AI Bots</div>
          <ul className="nav-links">
            <li><Link href="/" className="active">Home</Link></li>
            <li><Link href="/search">Search</Link></li>
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
          <div className="footer-section">
            <h3>Categories</h3>
            <ul>
              <li><Link href="/search?type=Yandere">Yandere Bots</Link></li>
              <li><Link href="/search?type=Tsundere">Tsundere Bots</Link></li>
              <li><Link href="/search?type=Vampire">Vampire Bots</Link></li>
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
