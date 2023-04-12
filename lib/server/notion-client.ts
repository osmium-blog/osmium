import fs from 'node:fs'
import { resolve } from 'node:path'
import chokidar from 'chokidar'
import { NotionAPI } from 'notion-client'

const { NOTION_ACCESS_TOKEN } = process.env

const client = new NotionAPI({ authToken: NOTION_ACCESS_TOKEN })

const PROXIED_METHODS = [
  'getPage',
]
const $client = new Proxy(client, {
  get (target: NotionAPI, prop: keyof NotionAPI) {
    // Just to reduce the length of IDE inlay hints
    type KeyofNotionAPI = NotionAPI[keyof NotionAPI]
    const raw: KeyofNotionAPI = target[prop]

    if (process.env.OSMIUM_CACHE !== '1') return raw

    if (!PROXIED_METHODS.includes(prop)) return raw

    const cache = new Cache()
    return new Proxy(raw, {
      async apply (target: any, thisArg: any, argArray: any[]) {
        const entry = cache.entry(prop, argArray)
        const cached = entry.get()
        switch (cached) {
          case undefined: {
            entry.set(Pending)
            console.log(`Calling \`${prop}\` with ${JSON.stringify(argArray)}`)
            const res = await target.apply(thisArg, argArray)
            entry.set({ value: res })
            return res
          }
          case Pending: {
            return new Promise(resolve => {
              const watcher = chokidar.watch(CACHE_FILE, { ignoreInitial: true })
              watcher.on('change', () => {
                const value = entry.get()
                if (value !== Pending) {
                  watcher.close().then(() => resolve(value))
                }
              })
            })
          }
          default:
            return cached
        }
      },
    })
  },
})

export default $client

const CACHE_FILE = resolve(process.cwd(), 'osmium-cache.json')
const Pending = Symbol('pending')
type CacheData = Record<string, typeof Pending | { value: any } | undefined>

class Cache {
  data!: CacheData

  constructor () {
    if (fs.existsSync(CACHE_FILE)) {
      this.read()
    } else {
      this.data = {}
      this.write()
    }
  }

  read () {
    this.data = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf-8'))
  }

  write () {
    fs.writeFileSync(CACHE_FILE, JSON.stringify(this.data, null, 2), 'utf-8')
  }

  entry (method: keyof NotionAPI, args: any[]) {
    const key = method + JSON.stringify(args)
    return new CacheEntry(this, key)
  }
}

class CacheEntry {
  constructor (private cache: Cache, private key: string) {}

  get () {
    this.cache.read()
    const raw = this.cache.data[this.key]
    return raw === Pending ? Pending : raw?.value
  }

  set (value: any) {
    this.cache.data[this.key] = value
    this.cache.write()
  }
}
