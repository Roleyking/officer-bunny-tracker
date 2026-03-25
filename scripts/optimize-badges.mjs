import fs from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const projectRoot = process.cwd()
const publicDir = path.join(projectRoot, 'public')
const files = [
  'badge-tier-1.png',
  'badge-tier-2.png',
  'badge-tier-3.png',
  'badge-tier-4.png'
]

const OUTPUT_SIZE = 320
const WEBP_QUALITY = 82

const optimize = async (file) => {
  const inputPath = path.join(publicDir, file)
  const outputPath = path.join(publicDir, file.replace('.png', '.webp'))

  try {
    await fs.access(inputPath)
  } catch {
    console.warn(`[skip] Missing ${file}`)
    return
  }

  await sharp(inputPath)
    .resize(OUTPUT_SIZE, OUTPUT_SIZE, { fit: 'cover' })
    .webp({ quality: WEBP_QUALITY })
    .toFile(outputPath)

  const stats = await fs.stat(outputPath)
  console.log(`[ok] ${path.basename(outputPath)} -> ${(stats.size / 1024).toFixed(1)} KB`)
}

const run = async () => {
  for (const file of files) {
    await optimize(file)
  }
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
