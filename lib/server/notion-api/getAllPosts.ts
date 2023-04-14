import { idToUuid } from 'notion-utils'
import dayjs from 'dayjs'
import { config as BLOG } from '@/lib/server/config'
import api from '../notion-client'
import { filterPublishedPosts, getAllPageIds } from './utils'
import getPageProperties from './getPageProperties'

const { NOTION_DATABASE_ID } = process.env

/**
 * @param includePages - false: posts only / true: include pages
 */
export async function getAllPosts ({ includePages = false }) {
  // TODO: To support url form
  const id = idToUuid(NOTION_DATABASE_ID)

  const recordMap = await api.getPage(id)

  const collection = Object.values(recordMap.collection)[0]?.value
  const collectionQuery = recordMap.collection_query
  const blockMap = recordMap.block
  const schema = collection?.schema

  const rawMetadata = blockMap[id].value

  // Check Type
  if (rawMetadata?.type !== 'collection_view_page' &&
    rawMetadata?.type !== 'collection_view') {
    console.error(`pageId "${id}" is not a database`)
    return null
  }

  // Construct Data
  const pageIds = getAllPageIds(collectionQuery)
  const data = []

  for (const id of pageIds) {
    const properties = await getPageProperties(id, blockMap, schema)

    /* Normalize several properties */

    // Ensure slugs are valid
    properties.slug = (properties.slug || '')
      .replace(/^\/+/, '')
      .replaceAll(/[;/?:@&=+$,# ]/g, '-')
    // Add fullwidth to properties
    properties.fullWidth = blockMap[id].value?.format?.page_full_width ?? false
    // Convert date (with timezone) to unix milliseconds timestamp
    properties.date = (
      properties.date?.start_date
        ? dayjs.tz(properties.date?.start_date)
        : dayjs(blockMap[id].value?.created_time)
    ).valueOf()

    // TODO: Better not to write normalized values in-place
    data.push(properties)
  }

  // remove all the items doesn't meet requirements
  const posts = filterPublishedPosts(data, includePages)

  // Sort by date
  if (BLOG.sortByDate) {
    posts.sort((a, b) => b.date - a.date)
  }
  return posts
}
