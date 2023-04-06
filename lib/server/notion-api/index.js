import fs from 'fs'
import { resolve } from 'path'
import { getAllPosts as _getAllPosts } from './getAllPosts'
import filterPublishedPosts from './filterPublishedPosts'

export { getAllTagsFromPosts } from './getAllTagsFromPosts'
export { getPostBlocks } from './getPostBlocks'

const CACHE_FILE = resolve(process.cwd(), 'osmium-cache.json')

export async function getAllPosts ({ includePages }) {
  const cache = new Cache()

  let posts
  if (cache.get('records')) {
    posts = cache.get('records')
  } else {
    if (cache.get('fetchingRecords')) {
      await new Promise(resolve => {
        setInterval(() => {
          posts = cache.get('records')
          if (posts) resolve()
        }, 0)
      })
    } else {
      cache.set('fetchingRecords', true)
      posts = await _getAllPosts({ includePages: true })
      cache.set('records', posts)
      cache.set('fetchingRecords', false)
    }
  }
  return filterPublishedPosts({ posts, includePages })
}

class Cache {
  constructor () {
    this.data = {}
    this.isEnabled = process.env.OSMIUM_CACHE === '1'
  }

  read () {
    if (this.isEnabled) {
      if (fs.existsSync(CACHE_FILE)) {
        this.data = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf-8'))
      } else {
        this.data = {}
        this.write()
      }
    }
  }

  write () {
    if (this.isEnabled) {
      fs.writeFileSync(CACHE_FILE, JSON.stringify(this.data), 'utf-8')
    }
  }

  get (key) {
    this.read()
    return this.data[key]
  }

  set (key, value) {
    this.read()
    this.data[key] = value
    this.write()
  }
}
