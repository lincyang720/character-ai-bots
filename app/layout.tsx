import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Character AI Bots - 50+ Free Roleplay Characters',
  description: 'Discover 50+ character AI bots for free roleplay chat. Yandere, tsundere, vampire characters and more on Character.AI, JanitorAI & SpicyChat.',
  keywords: 'character ai bots, ai roleplay characters, free ai chat bots, character.ai, janitorai, spicychat, yandere ai, tsundere bot',
  openGraph: {
    title: 'Character AI Bots - 50+ Free Roleplay Characters',
    description: 'Discover 50+ character AI bots for free roleplay chat. Yandere, tsundere, vampire characters and more!',
    type: 'website',
    url: 'https://characteraibots.com/',
    siteName: 'Character AI Bots',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Character AI Bots - 50+ Free Roleplay Characters',
    description: 'Discover 50+ character AI bots for free roleplay chat. Yandere, tsundere, vampire characters and more!',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
