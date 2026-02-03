import fs from 'fs';
import path from 'path';
import Link from 'next/link';

// 这个函数在服务器端每次请求时运行（SSR）
export default async function SearchPage() {
  // 从 JSON 文件读取角色数据
  const charactersData = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'data', 'characters.json'), 'utf8')
  );

  // 获取最受欢迎的12个角色作为初始显示
  const topCharacters = charactersData
    .sort((a: any, b: any) => b.popularity - a.popularity)
    .slice(0, 12);

  return (
    <>
      <head>
        <title>Search Character AI Bots - Find Perfect Roleplay Bot</title>
        <meta name="description" content="Search 50+ character AI bots by type, personality, and tags. Find yandere, tsundere, vampire bots and more for Character.AI, JanitorAI & SpicyChat." />
        <link rel="canonical" href="https://characteraibots.com/search" />
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

        <section className="search-filters">
          <div className="filter-container">
            <div className="search-box">
              <input
                type="text"
                id="search-input"
                placeholder="Search by name, type, or tags..."
                className="search-input"
              />
            </div>

            <div className="filters-row">
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

              <div className="filter-group">
                <label>Sort By:</label>
                <select id="sort-filter">
                  <option value="popularity">Most Popular</option>
                  <option value="rating">Highest Rated</option>
                  <option value="name">Name (A-Z)</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        <section className="search-results">
          <div className="results-header">
            <h2>Search Results</h2>
            <span id="results-count">Showing 12 of {charactersData.length} characters</span>
          </div>

          <div id="results-grid" className="characters-grid">
            {topCharacters.map((char: any) => (
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
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 Character AI Bots. All rights reserved.</p>
        </div>
      </footer>

      {/* 客户端搜索脚本 */}
      <script dangerouslySetInnerHTML={{
        __html: `
          // 将所有角色数据传递给客户端
          window.charactersData = ${JSON.stringify(charactersData)};

          // 客户端搜索功能
          document.addEventListener('DOMContentLoaded', function() {
            const searchInput = document.getElementById('search-input');
            const typeFilter = document.getElementById('type-filter');
            const sortFilter = document.getElementById('sort-filter');
            const resultsGrid = document.getElementById('results-grid');
            const resultsCount = document.getElementById('results-count');

            function filterAndDisplayCharacters() {
              const searchTerm = searchInput.value.toLowerCase();
              const selectedType = typeFilter.value;
              const sortBy = sortFilter.value;

              let filtered = window.charactersData.filter(char => {
                const matchesSearch = !searchTerm ||
                  char.name.toLowerCase().includes(searchTerm) ||
                  char.description.toLowerCase().includes(searchTerm) ||
                  char.tags.some(tag => tag.toLowerCase().includes(searchTerm));

                const matchesType = !selectedType || char.type === selectedType;

                return matchesSearch && matchesType;
              });

              // 排序
              if (sortBy === 'popularity') {
                filtered.sort((a, b) => b.popularity - a.popularity);
              } else if (sortBy === 'rating') {
                filtered.sort((a, b) => b.rating - a.rating);
              } else if (sortBy === 'name') {
                filtered.sort((a, b) => a.name.localeCompare(b.name));
              }

              // 更新结果计数
              resultsCount.textContent = \`Showing \${filtered.length} of \${window.charactersData.length} characters\`;

              // 更新显示
              resultsGrid.innerHTML = filtered.map(char => \`
                <a href="/characters/\${char.id}" class="character-card" title="View \${char.name} - \${char.type} AI Roleplay Bot">
                  <div class="character-icon">\${char.image}</div>
                  <h3>\${char.name}</h3>
                  <p>\${char.description.substring(0, 100)}...</p>
                  <div class="character-footer">
                    <span class="rating">⭐ \${char.rating}</span>
                    <span class="type-badge">\${char.type}</span>
                  </div>
                </a>
              \`).join('');
            }

            searchInput.addEventListener('input', filterAndDisplayCharacters);
            typeFilter.addEventListener('change', filterAndDisplayCharacters);
            sortFilter.addEventListener('change', filterAndDisplayCharacters);
          });
        `
      }} />
    </>
  );
}
