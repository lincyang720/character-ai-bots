import './globals.css'
import type { Metadata } from 'next'
import Script from 'next/script'

export const metadata: Metadata = {
  metadataBase: new URL('https://www.characteraibots.com'),
  title: {
    default: 'Character AI Bots - 50+ Free Roleplay Characters',
    template: '%s | Character AI Bots',
  },
  description: 'Discover 50+ character AI bots for free roleplay chat. Yandere, tsundere, vampire characters and more on Character.AI, JanitorAI & SpicyChat.',
  keywords: 'character ai bots, ai roleplay characters, free ai chat bots, character.ai, janitorai, spicychat, yandere ai, tsundere bot',
  openGraph: {
    title: 'Character AI Bots - 50+ Free Roleplay Characters',
    description: 'Discover 50+ character AI bots for free roleplay chat. Yandere, tsundere, vampire characters and more!',
    type: 'website',
    url: 'https://www.characteraibots.com/',
    siteName: 'Character AI Bots',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Character AI Bots - 50+ Free Roleplay Characters',
    description: 'Discover 50+ character AI bots for free roleplay chat.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'OPQH_dX0XnvAd0ODbk5cDms96DTDRcgDkwoFUZw_eHw',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="google-adsense-account" content="ca-pub-9200275562093244" />
      </head>
      <body>
        {children}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-1JQKX49JMM"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-1JQKX49JMM');
          `}
        </Script>
      </body>
    </html>
  )
}
