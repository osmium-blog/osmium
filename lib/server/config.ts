import fs from 'node:fs'
import { resolve } from 'node:path'
import { createDefu } from 'defu'

const applyDefaults = createDefu((obj, key, value) => {
  if (value === '') {
    return true
  }
})

const raw = JSON.parse(fs.readFileSync(resolve(process.cwd(), 'osmium-config.json'), 'utf-8'))
const config: Osmium.Config = applyDefaults(
  raw,
  {
    path: '/',
    ogImageGenerateURL: `${raw.link}/api/og-image?title=$title`,
  },
)

// If we need to stripe out some private fields
const clientConfig = config

export {
  config,
  clientConfig,
}
