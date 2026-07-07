import { copyFileSync, cpSync, existsSync, mkdirSync, rmSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const repoRoot = join(__dirname, '..')
const distDir = join(repoRoot, 'dist')
const publicDir = join(repoRoot, 'public')

rmSync(distDir, { recursive: true, force: true })
mkdirSync(distDir, { recursive: true })
copyFileSync(join(repoRoot, 'index.html'), join(distDir, 'index.html'))

if (existsSync(publicDir)) {
  cpSync(publicDir, distDir, { recursive: true, force: true })
}

console.log('Build complete: copied stable entry and public assets into dist/.')