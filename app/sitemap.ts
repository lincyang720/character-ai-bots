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
  const categories = ['yandere', 'tsundere', 'kuudere', 'dandere', 'vampire', 'fantasy', 'modern', 'sci-fi', 'mystery', 'adventure']
  const categoryPages = categories.map((category) => ({
    url: `${baseUrl}/category/${category}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  // Blog post pages
  const blogSlugs = [
    'getting-started-with-character-ai',
    'yandere-characters-explained',
    'janitorai-vs-characterai',
    'best-roleplay-tips',
    'spicychat-guide'
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
