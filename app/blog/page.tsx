import Link from 'next/link'

// 强制使用 SSR
export const dynamic = 'force-dynamic'

interface BlogPost {
  slug: string
  title: string
  excerpt: string
  date: string
  category: string
  readTime: string
}

const blogPosts: BlogPost[] = [
  {
    slug: 'getting-started-with-character-ai',
    title: 'Getting Started with Character.AI: A Beginner\'s Guide',
    excerpt: 'Learn how to create your first AI character conversation and make the most of Character.AI\'s features.',
    date: '2026-02-01',
    category: 'Tutorial',
    readTime: '5 min read'
  },
  {
    slug: 'yandere-characters-explained',
    title: 'Understanding Yandere Characters in AI Roleplay',
    excerpt: 'Explore the psychology and appeal of yandere characters in AI roleplay scenarios.',
    date: '2026-01-28',
    category: 'Character Types',
    readTime: '7 min read'
  },
  {
    slug: 'janitorai-vs-characterai',
    title: 'JanitorAI vs Character.AI: Which Platform is Right for You?',
    excerpt: 'A comprehensive comparison of the two most popular AI roleplay platforms.',
    date: '2026-01-25',
    category: 'Comparison',
    readTime: '8 min read'
  },
  {
    slug: 'best-roleplay-tips',
    title: '10 Tips for Better AI Roleplay Conversations',
    excerpt: 'Master the art of AI roleplay with these proven techniques and best practices.',
    date: '2026-01-20',
    category: 'Tips & Tricks',
    readTime: '6 min read'
  },
  {
    slug: 'spicychat-guide',
    title: 'SpicyChat: Everything You Need to Know',
    excerpt: 'A complete guide to SpicyChat, the adult-oriented AI character platform.',
    date: '2026-01-15',
    category: 'Platform Guide',
    readTime: '5 min read'
  }
]

export default function BlogPage() {
  return (
    <>
      <head>
        <meta name="google-adsense-account" content="ca-pub-9200275562093244" />
        <title>AI Character Roleplay Blog - Tips, Guides & News</title>
        <meta name="description" content="Read our blog for tips, guides, and news about AI character roleplay. Learn about Character.AI, JanitorAI, SpicyChat and more." />
        <meta name="keywords" content="character ai blog, ai roleplay tips, janitorai guide, character ai tutorial, spicychat guide" />
        <link rel="canonical" href="https://www.characteraibots.com/blog" />
      </head>

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
