import fs from 'node:fs'
import { resolve } from 'node:path'
import { createDefu } from 'defu'

const applyDefaults = createDefu((obj, key, value) => {
  if (value === '') {
    return true
  }
})

const config: Osmium.Config = applyDefaults(
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
