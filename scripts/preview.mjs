import { createReadStream, existsSync, statSync } from 'node:fs'
import { createServer } from 'node:http'
import { extname, join, normalize, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const rootDir = join(__dirname, '..', 'dist')
const port = 4174

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.mp4': 'video/mp4',
  '.m4a': 'audio/mp4',
}

createServer((request, response) => {
  const requestPath = request.url === '/' ? '/index.html' : request.url
  const filePath = normalize(join(rootDir, requestPath))

  if (!filePath.startsWith(rootDir) || !existsSync(filePath) || statSync(filePath).isDirectory()) {
    response.statusCode = 404
    response.end('Not Found')
    return
  }

  response.setHeader('Content-Type', mimeTypes[extname(filePath)] || 'application/octet-stream')
  createReadStream(filePath).pipe(response)
}).listen(port, '127.0.0.1', () => {
  console.log(`Preview server running at http://127.0.0.1:${port}`)
})