import { parsePageId } from 'notion-utils'
import type {
  CollectionPropertySchemaMap,
  CollectionViewPageBlock,
  ExtendedRecordMap,
  PageBlock,
} from 'notion-types'
import { config } from '../config'
import api from '../notion-client'
import Page from './page'

export default class Database {
  id: string

  recordMapRaw?: ExtendedRecordMap
  recordMap?: ExtendedRecordMap
  schema?: CollectionPropertySchemaMap

  pages: Page[] = []
  posts: Page[] = []
  pageMap: Record<string, Page> = {}
  tagMap: Record<string, number> = {}

  constructor (id: string = config.databaseId) {
    this.id = parsePageId(id)
  }

  async syncAll () {
    const { block: blockMap, collection: collectionMap, collection_query } = this.recordMapRaw = await api.getPage(this.id)

    const databasePage = blockMap[this.id].value as CollectionViewPageBlock
    // Check if this is a valid database
    if (
      databasePage.type !== 'collection_view_page' &&
      databasePage.type !== 'collection_view'
    ) {
      console.error(`Block ${this.id} is not a valid database`)
      return
    }

    const collectionId = (blockMap[this.id].value as CollectionViewPageBlock).collection_id!
    const collection = collectionMap[collectionId].value
    this.schema = collection.schema

    // Every page ID contained in the database
    const allPageIds = [...new Set(
      Object.values(collection_query[collection.id])
        .map(({ collection_group_results: results }) => {
          if (results?.hasMore) {
            console.error('Collection query result not complete!')
          }
          return results?.blockIds ?? []
        })
        .flat()
    )]

    // Store valid pages
    for (const id of allPageIds) {
      const block = blockMap[id].value as PageBlock
      if (!block) continue

      const page = new Page(block, this.schema!)
      if (!(page.type && page.status)) continue
      this.pageMap[id] = page

      switch (page.type) {
        case 'Page':
          this.pages.push(page)
          break
        case 'Post':
          this.posts.push(page)
          break
      }

      if (page.tags?.length) {
        page.tags.forEach(tag => {
          this.tagMap[tag] ??= 0
          this.tagMap[tag]++
        })
      }
    }

    this.generateRecordMap()
  }

  generateRecordMap () {
    this.recordMap = {
      block: Object.fromEntries(
        Object.values(this.pageMap).map(page => [page.id, { value: page.block }])
      ) as ExtendedRecordMap['block'],
      collection: this.recordMapRaw!.collection,
      collection_query: this.recordMapRaw!.collection_query,
      collection_view: this.recordMapRaw!.collection_view,
    } as ExtendedRecordMap
    return this.recordMap
  }
}
