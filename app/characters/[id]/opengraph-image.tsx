import { ImageResponse } from 'next/og'
import fs from 'fs'
import path from 'path'

export const runtime = 'nodejs'

export const alt = 'Character AI Bot'
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

export default async function Image({ params }: { params: { id: string } }) {
  // Read character data
  const charactersData = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'data', 'characters.json'), 'utf8')
  )

  const character = charactersData.find((c: any) => c.id === params.id)

  if (!character) {
    return new ImageResponse(
      (
        <div
          style={{
            fontSize: 60,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
          }}
        >
          Character Not Found
        </div>
      ),
      { ...size }
    )
  }

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
          padding: '60px',
        }}
      >
        <div style={{ fontSize: 100, marginBottom: 30 }}>
          {character.image}
        </div>
        <div style={{ fontSize: 70, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' }}>
          {character.name}
        </div>
        <div style={{
          fontSize: 35,
          opacity: 0.9,
          backgroundColor: 'rgba(255,255,255,0.2)',
          padding: '10px 30px',
          borderRadius: '10px',
          marginBottom: 20,
        }}>
          {character.type}
        </div>
        <div style={{ fontSize: 28, textAlign: 'center', opacity: 0.8, maxWidth: '900px' }}>
          {character.description.substring(0, 120)}...
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
