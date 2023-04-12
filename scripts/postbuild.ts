import fs from 'node:fs'
import { resolve } from 'node:path'

const ROOT = process.cwd()
const CACHE_FILE = resolve(ROOT, 'osmium-cache.json')

if (fs.existsSync(CACHE_FILE)) {
  // Why Vercel needs this?
  fs.writeFileSync(CACHE_FILE, '{}', 'utf-8')
}
