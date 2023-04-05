import { idToUuid } from 'notion-utils'
import dayjs from 'dayjs'
import { config as BLOG } from '@/lib/server/config'
import api from '@/lib/server/notion-client'
import getAllPageIds from './getAllPageIds'
import getPageProperties from './getPageProperties'
import filterPublishedPosts from './filterPublishedPosts'

const { NOTION_DATABASE_ID } = process.env

/**
 * @param {{ includePages: boolean }} - false: posts only / true: include pages
 */
export async function getAllPosts ({ includePages = false }) {
  const id = idToUuid(NOTION_DATABASE_ID)

  const response = await api.getPage(id)

  const collection = Object.values(response.collection)[0]?.value
  const collectionQuery = response.collection_query
  const block = response.block
  const schema = collection?.schema

  const rawMetadata = block[id].value

  // Check Type
  if (
    rawMetadata?.type !== 'collection_view_page' &&
    rawMetadata?.type !== 'collection_view'
  ) {
    console.error(`pageId "${id}" is not a database`)
    return null
  } else {
    // Construct Data
    const pageIds = getAllPageIds(collectionQuery)
    const data = []

    for (const id of pageIds) {
      const properties = await getPageProperties(id, block, schema)

      /* Normalize several properties */

      // Ensure slugs are valid
      properties.slug = (properties.slug || '')
        .replace(/^\/+/, '')
        .replaceAll(/[;/?:@&=+$,# ]/g, '-')
      // Add fullwidth to properties
      properties.fullWidth = block[id].value?.format?.page_full_width ?? false
      // Convert date (with timezone) to unix milliseconds timestamp
      properties.date = (
        properties.date?.start_date
          ? dayjs.tz(properties.date?.start_date)
          : dayjs(block[id].value?.created_time)
      ).valueOf()

      data.push(properties)
    }

    // remove all the items doesn't meet requirements
    const posts = filterPublishedPosts({ posts: data, includePages })

    // Sort by date
    if (BLOG.sortByDate) {
      posts.sort((a, b) => b.date - a.date)
    }
    return posts
  }
}
