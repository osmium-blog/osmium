import fs from 'node:fs'
import { resolve } from 'node:path'
import defu from 'defu'

const config: Osmium.Config = defu(
  JSON.parse(fs.readFileSync(resolve(process.cwd(), 'osmium-config.json'), 'utf-8')),
  {
    path: '/',
  },
)

// If we need to stripe out some private fields
const clientConfig = config

module.exports = {
  config,
  clientConfig,
}
