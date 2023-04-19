import NotionDatabase from './notion-api/notion-database'
import { config } from './config'
import Page from './page'

export default class Database {
  data: NotionDatabase

  all: Map<string, Page> = new Map()
  posts: Map<string, Page> = new Map()
  pages: Map<string, Page> = new Map()

  tagStats: Record<string, number> = {}

  constructor (id: string = config.databaseId) {
    this.data = new NotionDatabase(id)
  }

  async sync () {
    await this.data.sync()

    for (const [id, record] of this.data.records) {
      const page = new Page(record)
      if (!page.isPublished) continue
      switch (page.type) {
        case 'Post':
        case 'Doc':
          this.all.set(id, page)
          this.posts.set(id, page)
          break
        case 'Page':
          this.all.set(id, page)
          this.pages.set(id, page)
          break
        default:
          continue
      }
      for (const tag of page.tags) {
        this.tagStats[tag] ??= 0
        this.tagStats[tag]++
      }
    }
  }
}
