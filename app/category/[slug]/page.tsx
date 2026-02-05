import fs from 'fs'
import path from 'path'
import Link from 'next/link'
import { notFound } from 'next/navigation'

// 定义支持的分类
const VALID_CATEGORIES = [
  'yandere',
  'tsundere',
  'kuudere',
  'dandere',
  'vampire',
  'fantasy',
  'modern',
  'sci-fi',
  'mystery',
  'adventure'
]

// 分类的显示名称和描述
const CATEGORY_INFO: Record<string, { title: string; description: string }> = {
  yandere: {
    title: 'Yandere AI Characters',
    description: 'Obsessive and devoted AI characters who will do anything for you. Experience intense roleplay with yandere personalities.'
  },
  tsundere: {
    title: 'Tsundere AI Characters',
    description: 'Tough on the outside, soft on the inside. Discover tsundere AI characters with complex personalities.'
  },
  kuudere: {
    title: 'Kuudere AI Characters',
    description: 'Cool, calm, and emotionless AI characters who rarely show their feelings.'
  },
  dandere: {
    title: 'Dandere AI Characters',
    description: 'Shy and quiet AI characters who open up once you get to know them.'
  },
  vampire: {
    title: 'Vampire AI Characters',
    description: 'Immortal and mysterious vampire AI characters for dark fantasy roleplay.'
  },
  fantasy: {
    title: 'Fantasy AI Characters',
    description: 'Magical and fantastical AI characters from enchanted worlds.'
  },
  modern: {
    title: 'Modern AI Characters',
    description: 'Contemporary AI characters set in modern-day scenarios.'
  },
  'sci-fi': {
    title: 'Sci-Fi AI Characters',
    description: 'Futuristic and science fiction AI characters for space adventures.'
  },
  mystery: {
    title: 'Mystery AI Characters',
    description: 'Enigmatic AI characters perfect for detective and mystery roleplay.'
  },
  adventure: {
    title: 'Adventure AI Characters',
    description: 'Brave and daring AI characters ready for exciting adventures.'
  }
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const category = params.slug.toLowerCase()

  // 检查分类是否有效
  if (!VALID_CATEGORIES.includes(category)) {
    notFound()
  }

  // 读取角色数据
  const charactersData = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'data', 'characters.json'), 'utf8')
  )

  // 筛选该分类的角色
  const categoryCharacters = charactersData.filter((char: any) => {
    const charType = char.type.toLowerCase()
    const charTags = char.tags.map((tag: string) => tag.toLowerCase())
    return charType === category || charTags.includes(category)
  })

  // 按评分排序
  categoryCharacters.sort((a: any, b: any) => b.rating - a.rating)

  const categoryInfo = CATEGORY_INFO[category]

  return (
    <>
      <head>
        <title>{categoryInfo.title} - Character AI Bots Directory</title>
        <meta name="description" content={categoryInfo.description} />
        <meta name="keywords" content={`${category} ai, ${category} character ai, ${category} bot, ${category} roleplay, ai ${category}`} />
        <link rel="canonical" href={`https://www.characteraibots.com/category/${category}`} />
      </head>

      <header>
        <nav>
          <div className="logo">🤖 Character AI Bots</div>
          <ul className="nav-links">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/search">Search</Link></li>
            <li><Link href="/guide">Guide</Link></li>
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
              <span>⭐ Average rating: {(categoryCharacters.reduce((sum: number, char: any) => sum + char.rating, 0) / categoryCharacters.length).toFixed(1)}</span>
            </div>
          </div>
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
              <p>No characters found in this category.</p>
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

// 生成静态参数
export async function generateStaticParams() {
  return VALID_CATEGORIES.map(category => ({
    slug: category,
  }))
}
