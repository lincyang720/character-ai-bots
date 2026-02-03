import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import SearchClient from './SearchClient';

// 这个函数在服务器端每次请求时运行（SSR）
export default async function SearchPage() {
  // 从 JSON 文件读取角色数据
  const charactersData = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'data', 'characters.json'), 'utf8')
  );

  return (
    <>
      <head>
        <title>Search Character AI Bots - Find Perfect Roleplay Bot</title>
        <meta name="description" content="Search 50+ character AI bots by type, personality, and tags. Find yandere, tsundere, vampire bots and more for Character.AI, JanitorAI & SpicyChat." />
        <link rel="canonical" href="https://www.characteraibots.com/search" />
      </head>

      <header>
        <nav>
          <div className="logo">🤖 Character AI Bots</div>
          <ul className="nav-links">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/search" className="active">Search</Link></li>
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
