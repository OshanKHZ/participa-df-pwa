import { ImageResponse } from 'next/og'
import { SITE_CONFIG, SITE_URL } from '@/lib/seo/config'

export const runtime = 'edge'
export const alt = `${SITE_CONFIG.name} - Ouvidoria do Distrito Federal`
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  // Construct full icon URL for OG image (must be absolute URL on edge runtime)
  const iconUrl = `${SITE_URL}/icons/icon-512x512.png`

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#1a2940',
          backgroundImage: 'linear-gradient(135deg, #1a2940 0%, #28477d 100%)',
        }}
      >
        {/* Content Container */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '60px',
            padding: '80px',
          }}
        >
          {/* Icon */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <img
              src={iconUrl}
              width="280"
              height="280"
              style={{
                borderRadius: '32px',
              }}
            />
          </div>

          {/* Text Content */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              maxWidth: '700px',
            }}
          >
            {/* Main Title */}
            <div
              style={{
                fontSize: 96,
                fontWeight: 'bold',
                color: 'white',
                letterSpacing: '-0.03em',
                lineHeight: 1.1,
                marginBottom: '16px',
              }}
            >
              {SITE_CONFIG.name}
            </div>

            {/* Subtitle */}
            <div
              style={{
                fontSize: 42,
                color: 'rgba(255, 255, 255, 0.85)',
                lineHeight: 1.3,
                marginBottom: '24px',
              }}
            >
              Ouvidoria do Distrito Federal
            </div>

            {/* Description */}
            <div
              style={{
                fontSize: 28,
                color: 'rgba(255, 255, 255, 0.65)',
                lineHeight: 1.4,
              }}
            >
              Registre reclamações, sugestões, elogios e denúncias de forma simples e rápida
            </div>

            {/* Badge */}
            <div
              style={{
                marginTop: '32px',
                display: 'flex',
                gap: '12px',
              }}
            >
              <div
                style={{
                  padding: '12px 24px',
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  borderRadius: '8px',
                  fontSize: 20,
                  color: 'white',
                  fontWeight: '600',
                  display: 'flex',
                }}
              >
                Portal Oficial
              </div>
              <div
                style={{
                  padding: '12px 24px',
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  borderRadius: '8px',
                  fontSize: 20,
                  color: 'white',
                  fontWeight: '600',
                  display: 'flex',
                }}
              >
                GDF
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
