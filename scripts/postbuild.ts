import { resolve } from 'node:path'
import fs from 'node:fs'

const ROOT = process.cwd()
const CACHE_FILE = resolve(ROOT, 'osmium-cache.json')

fs.writeFileSync(CACHE_FILE, '{}', 'utf-8')
