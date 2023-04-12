import { extname, resolve } from 'node:path'
import { promises as fs } from 'node:fs'
import { execSync } from 'node:child_process'
import { loadEnvConfig } from '@next/env'
import type { PageBlock, BlockMap, CodeBlock, CollectionViewPageBlock } from 'notion-types'
import { getTextContent, parsePageId } from 'notion-utils'
import { defaultMapImageUrl } from 'react-notion-x'
import { ofetch } from 'ofetch'
import * as cheerio from 'cheerio'
import sharp from 'sharp'
import destr from 'destr'

import api from '../lib/server/notion-client'

const ROOT = process.cwd()

void async function main () {
  loadEnvConfig(ROOT)
  const { NOTION_DATABASE_ID } = process.env
  const databaseId = parsePageId(NOTION_DATABASE_ID)

  if (!databaseId) abort('NOTION_DATABASE_ID is not set or valid!')

  console.log('Fetching config...')
  const everything = await api.getPage(databaseId)

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

  await prepareConfig(configPage as PageBlock, everything.block, {
    databaseId,
    collectionId: (everything.block[databaseId].value as CollectionViewPageBlock).collection_id!,
    version: await prepareVersion(),
    logo: await prepareLogo(configPage as PageBlock),
  })
}()

const CONFIG_FILE = resolve(ROOT, 'osmium-config.json')

type Extra = {
  databaseId: string
  collectionId: string
  version?: string
  logo?: string
}

async function prepareConfig (page: PageBlock, blockMap: BlockMap, extra: Extra) {
  // We only treat the first code block as config source
  const configCodeBlockId = page.content?.find(id => blockMap[id].value?.type === 'code')
  if (!configCodeBlockId) abort('Cannot find a code block!')

  const configCodeBlock = blockMap[configCodeBlockId].value as CodeBlock
  const config = (() => {
    const raw = getTextContent(configCodeBlock.properties.title)
    try {
      return eval(`(module => { ${/^[\s\n]*\{/.test(raw) ? 'module.exports =' : ''} ${raw}; return module.exports })({})`)
    } catch {
      abort('The content of the first code block is not a valid config!')
    }
  })()

  // Append extra entries
  Object.assign(config, extra)

  await fs.writeFile(
    CONFIG_FILE,
    JSON.stringify(config, null, 2),
    'utf-8',
  )
}

const PACKAGE_FILE = resolve(ROOT, 'package.json')

async function prepareVersion (): Promise<string | undefined> {
  const pkg = destr(await fs.readFile(PACKAGE_FILE, 'utf-8'))
  if (!pkg.version) return
  if (/^\d+\.\d+\.\d+$/.test(pkg.version)) return pkg.version

  // If the version is not a valid semver, try to use current git commit hash instead
  try {
    return execSync('git log -1 --format=format:%h HEAD', { stdio: [null, null, 'ignore'], encoding: 'ascii' })
  } catch {
    return
  }
}

async function prepareLogo (page: PageBlock) {
  const value = page.format?.page_icon
  // If no icon is set, assume user doesn't want a logo or is willing to use a local file
  if (!value) {
    console.log(`No icon is set`)
    return
  }

  let url: string
  let ext: string
  // It's a Notion icon
  if (value.startsWith('/icons/')) {
    ext = extname(value)
    url = 'https://notion.so' + value
  }
  // It's a user-uploaded image
  else if (value.startsWith('http')) {
    const urlObj = new URL(defaultMapImageUrl(value, page)!)
    ext = extname(urlObj.pathname)
    // Larger image won't help more
    urlObj.searchParams.set('width', '100')
    url = urlObj.toString()
  }
  // It's an emoji
  else {
    const res = await ofetch.raw(`https://emojipedia.org/search/?q=${encodeURI(value)}`, {
      responseType: 'text',
      redirect: 'manual',
    })
    const name = res.status === 302
      ? res.headers.get('location')!.slice(1, -1)
      : cheerio.load(res._data || '')('.search-results h2 a').eq(0).attr('href')?.slice(1, -1)
    if (!name) {
      console.warn('Failed to resolve the emoji name')
      return
    }
    const points = value.split('').reduce((points, unit) => {
      const code = unit.charCodeAt(0)
      if (code >> 10 === 0b110111) {
        const prev = points.pop()!
        const point = 0x10000 + Number('0b' + prev.toString(2).slice(-10) + code.toString(2).slice(-10))
        points.push(point)
      } else {
        points.push(code)
      }
      return points
    }, [] as number[])

    ext = '.png'
    url = `https://em-content.zobj.net/thumbs/120/apple/354/${name}_${points.map(code => code.toString(16)).join('-')}.png`
  }

  console.log('Fetching logo...')
  const filename = 'logo' + ext
  const data = await ofetch(url, { responseType: 'arrayBuffer' })
  await fs.writeFile(resolve(ROOT, `public/${filename}`), Buffer.from(data))

  // Generate favicon from the logo
  await sharp(data).resize(32, 32).toFormat('png').toFile(resolve(ROOT, 'public/favicon.png'))

  return filename
}

function abort (message: string): never {
  console.error(message)
  process.exit(1)
}
