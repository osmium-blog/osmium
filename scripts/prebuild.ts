import { resolve } from 'node:path'
import fs from 'node:fs'
import { loadEnvConfig } from '@next/env'
import { NotionAPI } from 'notion-client'
import { getTextContent } from 'notion-utils'

const ROOT = process.cwd()
const CONFIG_FILE = resolve(ROOT, 'osmium-config.json')
const CACHE_FILE = resolve(ROOT, 'osmium-cache.json')

void async function main () {
  /* Config */

  // Only fetch config from Notion when no local config file is found
  if (fs.existsSync(CONFIG_FILE)) return

  console.log('Local config not found. Fetch from Notion...')

  loadEnvConfig(ROOT)
  const { NOTION_DATABASE_ID, NOTION_ACCESS_TOKEN } = process.env

  if (!NOTION_DATABASE_ID) abort('NOTION_DATABASE_ID is not set!')

  const api = new NotionAPI({ authToken: NOTION_ACCESS_TOKEN })
  const everything = await api.getPage(NOTION_DATABASE_ID)

  // Get the ID of database prop `type`
  const typeProp =
    Object.entries(Object.values(everything.collection)[0].value.schema)
      .find(([id, value]) => value.name === 'type')
  if (!typeProp) abort('Cannot find a `type` prop!')
  const typePropId = typeProp[0]

  // Get the first page whose `type` is `Config`
  const configRecord =
    Object.entries(everything.block)
      .find(([id, { value }]) => getTextContent(value?.properties?.[typePropId]) === 'Config')
  if (!configRecord) abort('Cannot find a remote config!')
  const [, { value: configPage }] = configRecord

  // We only treat the first code block as config source
  const configCodeBlockId = configPage.content?.find(id => everything.block[id].value?.type === 'code')
  if (!configCodeBlockId) abort('Cannot find a code block!')

  const configCodeBlock = everything.block[configCodeBlockId].value
  const config = (() => {
    try {
      return JSON.parse(getTextContent(configCodeBlock.properties.title))
    } catch {
      abort('The content of the first code block is not a valid JSON!')
    }
  })()

  fs.writeFileSync(
    CONFIG_FILE,
    JSON.stringify(config, null, 2),
    'utf-8',
  )

  console.log(`Remote config fetched successfully to \`${CONFIG_FILE}\``)

  /* Cache */

  // Create a cache file to mark build phase
  fs.writeFileSync(CACHE_FILE, '{}', 'utf-8')
}()

function abort (message: string): never {
  console.error(message)
  process.exit(1)
}
