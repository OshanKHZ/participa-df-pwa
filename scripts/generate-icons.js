/* eslint-disable no-console */
import sharp from 'sharp'
import { promises as fs } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const sizes = [72, 96, 128, 144, 152, 192, 384, 512]
const iconsDir = path.join(process.cwd(), 'public', 'icons')
const pwaSvgPath = path.join(process.cwd(), 'public', 'pwa-logo.svg')
const faviconSvgPath = path.join(process.cwd(), 'public', 'favicon.svg')

async function generateIcons() {
  try {
    // Create icons directory if it doesn't exist
    await fs.mkdir(iconsDir, { recursive: true })

    // Check if PWA SVG exists
    await fs.access(pwaSvgPath)
    
    console.log('🎨 Generating PWA icons from pwa-logo.svg...')

    for (const size of sizes) {
      const outputPath = path.join(iconsDir, `icon-${size}x${size}.png`)

      // Generate PWA icons with transparent background
      await sharp(pwaSvgPath)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 }, 
        })
        .png()
        .toFile(outputPath)

      console.log(`  ✅ Generated ${size}x${size} icon`)
    }

    // Generate apple-touch-icon (180x180)
    await sharp(pwaSvgPath)
      .resize(180, 180, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .png()
      .toFile(path.join(iconsDir, 'apple-touch-icon.png'))
     console.log('  ✅ Generated apple-touch-icon.png')

    // Handle Favicon
    console.log('\n🎨 Generating Favicon from favicon.svg...')
    try {
        await fs.access(faviconSvgPath)
        
        // Generate 32x32 PNG favicon (transparent)
        await sharp(faviconSvgPath)
            .resize(32, 32, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
            .png()
            .toFile(path.join(process.cwd(), 'public', 'favicon.png'))
            
        console.log('  ✅ Generated favicon.png (32x32)')
        
         // Also generate a 16x16 as favicon.ico (technically png but often accepted) 
         // OR just copy the 32x32 as favicon.ico for compatibility if standard tools look for it
         // But let's actually make a 32x32 one named favicon.ico for simple compatibility
        await sharp(faviconSvgPath)
            .resize(32, 32, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
            .png()
            .toFile(path.join(process.cwd(), 'public', 'favicon.ico')) // Note: this is a PNG with .ico extension, which works in most modern browsers.

        console.log('  ✅ Generated favicon.ico (32x32)')

    } catch (e) {
        console.warn('⚠️ Could not find or process favicon.svg:', e)
    }

    console.log('\n✅ All icons generated successfully!')
  } catch (error) {
    console.error('❌ Error generating icons:', error)

    // Fallback: create simple placeholder icons
    console.log('\n⚠️  Creating fallback icons...')
    await createFallbackIcons()
  }
}

async function createFallbackIcons() {
  await fs.mkdir(iconsDir, { recursive: true })

  for (const size of sizes) {
    const svg = `
      <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
        <rect width="${size}" height="${size}" fill="#0055a4"/>
        <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
              font-family="Arial, sans-serif" font-size="${size * 0.4}" fill="white" font-weight="bold">
          DF
        </text>
      </svg>
    `

    const outputPath = path.join(iconsDir, `icon-${size}x${size}.png`)

    await sharp(Buffer.from(svg)).png().toFile(outputPath)

    console.log(`  ✅ Generated fallback ${size}x${size} icon`)
  }

  console.log('\n✅ Fallback icons generated!')
}

generateIcons()
