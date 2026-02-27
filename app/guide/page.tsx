import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Complete Guide to AI Character Roleplay',
  description: 'Learn how to use Character.AI, JanitorAI, and SpicyChat for AI roleplay. Complete guide for beginners with tips, platform comparison, and best practices.',
  keywords: 'character ai guide, how to use character ai, janitorai tutorial, spicychat guide, ai roleplay tips, ai roleplay guide',
  alternates: {
    canonical: 'https://www.characteraibots.com/guide',
  },
  openGraph: {
    title: 'Complete Guide to AI Character Roleplay | Character AI Bots',
    description: 'Learn how to use Character.AI, JanitorAI, and SpicyChat for AI roleplay.',
    type: 'article',
    url: 'https://www.characteraibots.com/guide',
  },
}

export default function GuidePage() {
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Complete Guide to AI Character Roleplay',
    description: 'Learn how to use Character.AI, JanitorAI, and SpicyChat for AI roleplay.',
    url: 'https://www.characteraibots.com/guide',
    publisher: {
      '@type': 'Organization',
      name: 'Character AI Bots',
      url: 'https://www.characteraibots.com',
    },
  }

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Is it free to use these platforms?',
        acceptedAnswer: { '@type': 'Answer', text: 'Yes! Character.AI, JanitorAI, and SpicyChat all offer free tiers. Some platforms have premium options for additional features.' },
      },
      {
        '@type': 'Question',
        name: 'Do I need to create an account?',
        acceptedAnswer: { '@type': 'Answer', text: 'Yes, you\'ll need to create a free account on your chosen platform to start chatting with characters.' },
      },
      {
        '@type': 'Question',
        name: 'Can I create my own characters?',
        acceptedAnswer: { '@type': 'Answer', text: 'Yes! All three platforms allow users to create and share their own AI characters.' },
      },
      {
        '@type': 'Question',
        name: 'Are conversations private?',
        acceptedAnswer: { '@type': 'Answer', text: 'Your conversations are private between you and the AI. However, always check each platform\'s privacy policy.' },
      },
      {
        '@type': 'Question',
        name: 'What if the AI says something inappropriate?',
        acceptedAnswer: { '@type': 'Answer', text: 'You can regenerate responses or report issues to the platform. Character.AI has the strictest content filters.' },
      },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <header>
        <nav>
          <div className="logo">🤖 Character AI Bots</div>
          <ul className="nav-links">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/search">Search</Link></li>
            <li><Link href="/guide" className="active">Guide</Link></li>
            <li><Link href="/blog">Blog</Link></li>
          </ul>
        </nav>
      </header>

      <main>
        <section className="guide-hero">
          <h1>Complete Guide to AI Character Roleplay</h1>
          <p>Learn how to get started with Character.AI, JanitorAI, and SpicyChat</p>
        </section>

        <section className="guide-content">
          <div className="guide-container">

            <div className="guide-section">
              <h2>🚀 Getting Started</h2>
              <p>AI character roleplay allows you to have conversations with AI-powered characters that have unique personalities, backgrounds, and traits. Here&apos;s how to begin:</p>

              <div className="steps">
                <div className="step">
                  <div className="step-number">1</div>
                  <div className="step-content">
                    <h3>Choose a Platform</h3>
                    <p>Select from Character.AI (family-friendly), JanitorAI (more freedom), or SpicyChat (adult-oriented).</p>
                  </div>
                </div>

                <div className="step">
                  <div className="step-number">2</div>
                  <div className="step-content">
                    <h3>Browse Characters</h3>
                    <p>Use our <Link href="/search">search page</Link> to find characters by type, tags, or ratings.</p>
                  </div>
                </div>

                <div className="step">
                  <div className="step-number">3</div>
                  <div className="step-content">
                    <h3>Start Chatting</h3>
                    <p>Click on a character to visit their page on the platform and begin your conversation.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="guide-section">
              <h2>🎭 Platform Comparison</h2>

              <div className="comparison-cards">
                <div className="comparison-card">
                  <h3>Character.AI</h3>
                  <div className="pros-cons">
                    <div className="pros">
                      <h4>✅ Pros:</h4>
                      <ul>
                        <li>Largest character library</li>
                        <li>Free to use</li>
                        <li>Family-friendly content</li>
                        <li>Active community</li>
                      </ul>
                    </div>
                    <div className="cons">
                      <h4>❌ Cons:</h4>
                      <ul>
                        <li>Strict content filters</li>
                        <li>Can be slow during peak hours</li>
                        <li>Limited customization</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="comparison-card">
                  <h3>JanitorAI</h3>
                  <div className="pros-cons">
                    <div className="pros">
                      <h4>✅ Pros:</h4>
                      <ul>
                        <li>More freedom in content</li>
                        <li>Community-driven</li>
                        <li>Free to use</li>
                        <li>Less restrictive filters</li>
                      </ul>
                    </div>
                    <div className="cons">
                      <h4>❌ Cons:</h4>
                      <ul>
                        <li>Smaller character library</li>
                        <li>Requires API key for some features</li>
                        <li>Less polished UI</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="comparison-card">
                  <h3>SpicyChat</h3>
                  <div className="pros-cons">
                    <div className="pros">
                      <h4>✅ Pros:</h4>
                      <ul>
                        <li>Adult-oriented content</li>
                        <li>Minimal restrictions</li>
                        <li>Free tier available</li>
                        <li>Fast responses</li>
                      </ul>
                    </div>
                    <div className="cons">
                      <h4>❌ Cons:</h4>
                      <ul>
                        <li>Smaller community</li>
                        <li>Limited free messages</li>
                        <li>18+ only</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="guide-section">
              <h2>💡 Tips for Better Roleplay</h2>

              <div className="tips-grid">
                <div className="tip-card">
                  <h3>1. Set the Scene</h3>
                  <p>Start with a detailed scenario instead of just &quot;Hi&quot;. Describe the setting, time, and situation.</p>
                  <div className="tip-example">
                    <strong>Example:</strong> &quot;It&apos;s late at night in the library. I&apos;m studying alone when I hear footsteps approaching...&quot;
                  </div>
                </div>

                <div className="tip-card">
                  <h3>2. Be Descriptive</h3>
                  <p>Use descriptive language to make the roleplay more immersive. Describe actions, emotions, and surroundings.</p>
                  <div className="tip-example">
                    <strong>Example:</strong> &quot;*I look up nervously from my book, my heart racing as I see you standing there*&quot;
                  </div>
                </div>

                <div className="tip-card">
                  <h3>3. Stay in Character</h3>
                  <p>Respond in a way that fits the scenario and your character&apos;s personality.</p>
                </div>

                <div className="tip-card">
                  <h3>4. Use Asterisks for Actions</h3>
                  <p>Use *asterisks* to indicate actions and regular text for dialogue.</p>
                  <div className="tip-example">
                    <strong>Example:</strong> *walks closer* &quot;I&apos;ve been looking for you...&quot;
                  </div>
                </div>

                <div className="tip-card">
                  <h3>5. Read Character Descriptions</h3>
                  <p>Before starting, read the character&apos;s description to understand their personality and background.</p>
                </div>

                <div className="tip-card">
                  <h3>6. Be Patient</h3>
                  <p>AI responses may take a few seconds. Give the AI time to generate quality responses.</p>
                </div>
              </div>
            </div>

            <div className="guide-section">
              <h2>📚 Character Types Explained</h2>
              <div className="type-cards">
                <div className="type-card">
                  <h3>🎭 Yandere</h3>
                  <p>Obsessive and devoted characters who will do anything for their love interest. Often possessive and jealous.</p>
                  <Link href="/category/yandere">Browse Yandere Characters →</Link>
                </div>
                <div className="type-card">
                  <h3>😤 Tsundere</h3>
                  <p>Characters who act tough and cold but secretly care deeply. Their gradual warmth makes for rewarding roleplay.</p>
                  <Link href="/category/tsundere">Browse Tsundere Characters →</Link>
                </div>
                <div className="type-card">
                  <h3>❄️ Kuudere</h3>
                  <p>Cool and emotionless on the surface, with hidden depths of feeling waiting to be discovered.</p>
                  <Link href="/category/kuudere">Browse Kuudere Characters →</Link>
                </div>
                <div className="type-card">
                  <h3>🧛 Vampire</h3>
                  <p>Immortal, mysterious, and dangerously alluring. Perfect for dark fantasy and gothic romance scenarios.</p>
                  <Link href="/category/vampire">Browse Vampire Characters →</Link>
                </div>
              </div>
            </div>

            <div className="guide-section">
              <h2>❓ Frequently Asked Questions</h2>
              <div className="faq-list">
                <div className="faq-item">
                  <h3>Is it free to use these platforms?</h3>
                  <p>Yes! Character.AI, JanitorAI, and SpicyChat all offer free tiers. Some platforms have premium options for additional features.</p>
                </div>
                <div className="faq-item">
                  <h3>Do I need to create an account?</h3>
                  <p>Yes, you&apos;ll need to create a free account on your chosen platform to start chatting with characters.</p>
                </div>
                <div className="faq-item">
                  <h3>Can I create my own characters?</h3>
                  <p>Yes! All three platforms allow users to create and share their own AI characters.</p>
                </div>
                <div className="faq-item">
                  <h3>Are conversations private?</h3>
                  <p>Your conversations are private between you and the AI. However, always check each platform&apos;s privacy policy.</p>
                </div>
                <div className="faq-item">
                  <h3>What if the AI says something inappropriate?</h3>
                  <p>You can regenerate responses or report issues to the platform. Character.AI has the strictest content filters.</p>
                </div>
              </div>
            </div>

            <div className="guide-section cta-section">
              <h2>Ready to Start?</h2>
              <p>Browse our collection of 50+ AI characters and find your perfect roleplay companion!</p>
              <div className="cta-buttons">
                <Link href="/search" className="btn-primary">Browse All Characters</Link>
                <Link href="/" className="btn-secondary">Back to Home</Link>
              </div>
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
