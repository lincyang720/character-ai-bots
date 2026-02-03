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
  ]

  // Character pages
  const characterPages = charactersData.map((char: any) => ({
    url: `${baseUrl}/characters/${char.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  return [...staticPages, ...characterPages]
}
