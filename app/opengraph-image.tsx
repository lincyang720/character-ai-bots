import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'Character AI Bots - 50+ Free Roleplay Characters'
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 60,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontFamily: 'system-ui, sans-serif',
          padding: '40px',
        }}
      >
        <div style={{ fontSize: 80, fontWeight: 'bold', marginBottom: 20 }}>
          🤖 Character AI Bots
        </div>
        <div style={{ fontSize: 40, textAlign: 'center', opacity: 0.9 }}>
          50+ Free Roleplay Characters
        </div>
        <div style={{ fontSize: 30, marginTop: 30, opacity: 0.8 }}>
          Character.AI • JanitorAI • SpicyChat
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
