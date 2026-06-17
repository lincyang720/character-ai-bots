import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Character Roleplay Blog — Tips, Guides & Platform Reviews (2026)',
  description: 'Read our blog for tips, guides, and news about AI character roleplay. Updated weekly with guides for Character.AI, JanitorAI, SpicyChat, and best anime waifu bots.',
  keywords: 'character ai blog, ai roleplay tips, anime waifu ai chatbot, janitorai guide, character ai tutorial, spicychat guide, waifu roleplay',
  alternates: {
    canonical: 'https://www.characteraibots.com/blog',
  },
  openGraph: {
    title: 'AI Character Roleplay Blog | Character AI Bots',
    description: 'Tips, guides, and insights for better AI conversations.',
    type: 'website',
    url: 'https://www.characteraibots.com/blog',
  },
}

interface BlogPostMeta {
  slug: string
  title: string
  excerpt: string
  date: string
  category: string
  readTime: string
}

const blogPosts: BlogPostMeta[] = [
  {
    slug: 'best-fantasy-ai-bots-2026',
    title: 'Best Fantasy AI Bots 2026 - Free Elves, Dragons & Magic Characters',
    excerpt: 'Embark on magical adventures with free Fantasy AI bots. Elves, dragons, wizards, knights & more. 100% free on Character.AI, JanitorAI & SpicyChat.',
    date: '2026-06-17',
    category: 'Best Of',
    readTime: '12 min read',
  },
  {
    slug: 'best-vampire-ai-bots-2026',
    title: 'Best Vampire AI Bots 2026 - Free Supernatural Night Creatures',
    excerpt: 'Chat with free Vampire AI bots — immortal, mysterious & dangerously seductive. Meet Professor Crimson, your Vampire GF & 10+ night creatures on CAI, JanitorAI & SpicyChat.',
    date: '2026-06-03',
    category: 'Best Of',
    readTime: '11 min read',
  },
  {
    slug: 'best-tsundere-ai-bots-2026',
    title: 'Best Tsundere AI Bots 2026 - Free Cold-to-Warm Roleplay Characters',
    excerpt: 'Chat with free Tsundere AI bots that start cold but secretly care. Featuring Sakura the nurse, Levi Ackerman, Jinx & 15+ tsundere characters on Character.AI, JanitorAI & SpicyChat.',
    date: '2026-05-27',
    category: 'Best Of',
    readTime: '11 min read',
  },
  {
    slug: 'best-romance-ai-bots-2026',
    title: 'Best Romance AI Bots 2026 - Free Dating & Love Roleplay Characters',
    excerpt: 'Find your perfect AI companion with free Romance bots. Sweet, caring & lovable characters for dating roleplay on Character.AI, JanitorAI & SpicyChat.',
    date: '2026-05-20',
    category: 'Best Of',
    readTime: '11 min read',
  },
  {
    slug: 'best-dandere-ai-bots-2026',
    title: 'Best Dandere AI Bots 2026 - Complete Guide to Shy & Sweet Characters',
    excerpt: 'Discover the best dandere AI bots for roleplay in 2026. Chat with shy, gentle characters who blossom into the sweetest companions once you earn their trust.',
    date: '2026-05-13',
    category: 'Best Of',
    readTime: '10 min read',
  },
  {
    slug: 'best-kuudere-ai-bots-2026',
    title: 'Best Kuudere AI Bots 2026 - Complete Guide to Cool & Reserved Characters',
    excerpt: 'Discover the best kuudere AI bots for roleplay in 2026. Chat with cool, emotionally reserved characters who show love through actions, not words.',
    date: '2026-05-06',
    category: 'Best Of',
    readTime: '9 min read',
  },
  {
    slug: 'best-anime-waifu-ai-chatbots-2026',
    title: 'Best Anime Waifu AI Chatbots 2026: Complete Guide to Free Waifu Roleplay',
    excerpt: 'Discover the best anime waifu AI chatbots for free roleplay in 2026. Chat with lovingly crafted waifu characters from top anime on Character.AI, JanitorAI & SpicyChat.',
    date: '2026-04-29',
    category: 'Anime Guide',
    readTime: '11 min read',
  },
]

export default function BlogPage() {
  const blogJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'AI Character Roleplay Blog',
    url: 'https://www.characteraibots.com/blog',
    description: 'Tips, guides, and insights for better AI conversations.',
    publisher: {
      '@type': 'Organization',
      name: 'Character AI Bots',
      url: 'https://www.characteraibots.com',
    },
    blogPost: blogPosts.map(post => ({
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.excerpt,
      datePublished: post.date,
      url: `https://www.characteraibots.com/blog/${post.slug}`,
    })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }} />

      <header>
        <nav>
          <div className="logo">🤖 Character AI Bots</div>
          <ul className="nav-links">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/search">Search</Link></li>
            <li><Link href="/guide">Guide</Link></li>
            <li><Link href="/blog" className="active">Blog</Link></li>
          </ul>
        </nav>
      </header>

      <main>
        <section className="blog-hero">
          <h1>AI Character Roleplay Blog</h1>
          <p>Tips, guides, and insights for better AI conversations</p>
        </section>

        <section className="blog-content">
          <div className="blog-container">
            <h2 className="section-title">Latest Articles</h2>

            <div className="blog-grid">
              {blogPosts.map((post) => (
                <article key={post.slug} className="blog-card">
                  <div className="blog-meta">
                    <span className="blog-category">{post.category}</span>
                    <span className="blog-date">{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  <h3>
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h3>
                  <p className="blog-excerpt">{post.excerpt}</p>
                  <div className="blog-footer">
                    <span className="read-time">{post.readTime}</span>
                    <Link href={`/blog/${post.slug}`} className="read-more">Read More →</Link>
                  </div>
                </article>
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
            <h3>Popular Categories</h3>
            <ul>
              <li><Link href="/category/yandere">Yandere</Link></li>
              <li><Link href="/category/tsundere">Tsundere</Link></li>
              <li><Link href="/category/vampire">Vampire</Link></li>
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
