import fs from 'node:fs'
import { resolve } from 'node:path'

const config: Osmium.Config = JSON.parse(fs.readFileSync(resolve(process.cwd(), 'osmium-config.json'), 'utf-8'))

// If we need to stripe out some private fields
const clientConfig = config

module.exports = {
  config,
  clientConfig,
}
