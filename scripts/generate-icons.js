import sharp from 'sharp'
import { promises as fs } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const sizes = [72, 96, 128, 144, 152, 192, 384, 512]
const iconsDir = path.join(process.cwd(), 'public', 'icons')
const svgPath = path.join(process.cwd(), 'public', 'logo.svg')

async function generateIcons() {
  try {
    // Create icons directory if it doesn't exist
    await fs.mkdir(iconsDir, { recursive: true })

    // Check if SVG exists
    await fs.access(svgPath)

    console.log('🎨 Generating PWA icons from logo.svg...')

    for (const size of sizes) {
      const outputPath = path.join(iconsDir, `icon-${size}x${size}.png`)

      await sharp(svgPath)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 1 },
        })
        .png()
        .toFile(outputPath)

      console.log(`  ✅ Generated ${size}x${size} icon`)
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
