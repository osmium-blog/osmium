import fs from 'node:fs'
import { resolve } from 'node:path'
import { createDefu } from 'defu'
import { joinURL } from 'ufo'
import { omit } from 'lodash'

import { md5 } from './utils'

const defu = createDefu((obj, key, value) => {
  if (value === '') {
    return true
  }
})
const applyDefaults = (raw: JsonValue) => defu(raw, {
  appearance: 'auto',
  path: '/',
  mode: 'blog',
  ogImageGenerateURL: joinURL(raw.link, raw.path, '/api/og-image?title={title}'),
  emailHash: raw.email && md5(raw.email),
  rss: true,
})

/** @deprecated */
const raw = readConfigRaw()
/** @deprecated */
const config: Osmium.Config = applyDefaults(raw)

// Stripe out some private fields
const { databaseId, collectionId, email, ...clientConfig } = config

function readConfigRaw () {
  const raw = JSON.parse(fs.readFileSync(resolve(process.cwd(), 'osmium-config.json'), 'utf-8'))
  return applyDefaults(raw)
}

const PRIVATE_FIELDS = ['databaseId', 'collectionId', 'email']

function readConfig (): Osmium.Config {
  return omit(readConfigRaw(), PRIVATE_FIELDS)
}

export {
  config,
  clientConfig,
  readConfigRaw,
  readConfig,
}
