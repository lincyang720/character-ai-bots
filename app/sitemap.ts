import fs from 'fs'
import path from 'path'

export default async function sitemap() {
  // Read characters data
  const charactersData = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'data', 'characters.json'), 'utf8')
  )

  const baseUrl = 'https://www.characteraibots.com'

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/guide`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ]

  // Category pages
  const categories = ['yandere', 'tsundere', 'kuudere', 'dandere', 'vampire', 'fantasy', 'modern', 'sci-fi', 'mystery', 'adventure', 'romance', 'supernatural']
  const categoryPages = categories.map((category) => ({
    url: `${baseUrl}/category/${category}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  // Blog post pages
  const blogSlugs = [
    'best-fantasy-ai-bots-2026',
    'best-vampire-ai-bots-2026',
    'best-tsundere-ai-bots-2026',
    'best-romance-ai-bots-2026',
    'best-dandere-ai-bots-2026',
    'best-kuudere-ai-bots-2026',
    'best-anime-waifu-ai-chatbots-2026',
    'anime-ai-chatbots-complete-guide-2026',
    'complete-beginners-guide-character-ai-2026',
    'how-to-have-more-engaging-ai-conversations',
    'top-anime-ai-chatbots-2026',
    'genshin-impact-ai-bots',
    'character-ai-alternative-2026',
    'best-yandere-ai-bots-2026',
    'character-ai-vs-janitorai-vs-spicychat',
    'how-to-roleplay-with-ai-characters',
    'top-fantasy-ai-roleplay-bots',
    'ai-roleplay-tips-better-conversations',
    'best-ai-chatbot-for-roleplay',
    'nsfw-ai-chat-bots-guide',
    'best-anime-ai-chatbots-2026',
  ]
  const blogPages = blogSlugs.map((slug) => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  // Character pages
  const characterPages = charactersData.map((char: any) => ({
    url: `${baseUrl}/characters/${char.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  return [...staticPages, ...categoryPages, ...blogPages, ...characterPages]
}
