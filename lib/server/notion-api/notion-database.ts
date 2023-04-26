import { parsePageId } from 'notion-utils'
import type {
  CollectionPropertySchemaMap,
  CollectionViewPageBlock,
  ExtendedRecordMap,
  PageBlock,
} from 'notion-types'

import api from '../notion-client'
import NotionPage from './notion-page'

export default class NotionDatabase {
  id: string
  records: Map<string, NotionPage> = new Map()

  recordMap?: ExtendedRecordMap
  schema?: CollectionPropertySchemaMap

  constructor (id: string) {
    this.id = parsePageId(id)
  }

  async sync () {
    const {
      block: blockMap,
      collection: collectionMap,
      collection_query: collectionQuery,
    } = this.recordMap = await api.getPage(this.id)

    const databasePage = blockMap[this.id].value as CollectionViewPageBlock
    // Check if this is a valid database
    if (
      databasePage.type !== 'collection_view_page' &&
      databasePage.type !== 'collection_view'
    ) {
      throw new Error(`${this.id} is not a valid database`)
    }

    const collectionId = (blockMap[this.id].value as CollectionViewPageBlock).collection_id!
    const collection = collectionMap[collectionId].value
    this.schema = collection.schema

    // Every page ID contained in the database
    const pageIds = [...new Set(
      Object.values(collectionQuery[collection.id])
        .map(({ collection_group_results: results }) => {
          if (results?.hasMore) {
            console.error('Collection query result not complete!')
          }
          return results?.blockIds ?? []
        })
        .flat()
    )]

    for (const id of pageIds) {
      const block = blockMap[id].value as PageBlock
      if (!block) continue

      this.records.set(id, new NotionPage(block, this.schema))
    }
  }
}
