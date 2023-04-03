import fs from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(fileURLToPath(import.meta.url), '../..')
const CACHE_FILE = resolve(ROOT, 'osmium-cache.json')

fs.unlinkSync(CACHE_FILE)
