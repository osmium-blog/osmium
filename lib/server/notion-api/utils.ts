import { idToUuid } from 'notion-utils'
import type { BasePageBlock, ExtendedRecordMap } from 'notion-types'

export function getAllPageIds (collectionQuery: ExtendedRecordMap['collection_query'], viewId?: string): string[] {
  const views = Object.values(collectionQuery)[0]
  if (viewId) {
    const id = idToUuid(viewId)
    return views[id]?.blockIds
  } else {
    const pageSet = new Set<string>()
    for (const view of Object.values(views)) {
      view?.collection_group_results?.blockIds?.forEach(id => pageSet.add(id))
    }
    return [...pageSet]
  }
}

// TODO: complete the definition
export type PostMeta = Record<string, any> & { id: string }

export function filterPublishedPosts (posts?: PostMeta[], includePages: boolean = false): PostMeta[] {
  if (!posts?.length) return []

  return posts.filter(post =>
    post &&
    (post.type?.[0] === 'Post' || (includePages && post.type?.[0] === 'Page')) &&
    post.title &&
    post.slug &&
    post.status?.[0] === 'Published' &&
    post.date <= new Date()
  )
}

export function getAllTagsFromPosts (posts: PostMeta[]): Record<string, number> {
  const taggedPosts = posts.filter(post => post?.tags)
  const tags = taggedPosts.map(post => post.tags).flat()
  const result = {} as Record<string, number>
  for (const tag of tags) {
    result[tag] ??= 0
    result[tag]++
  }
  return result
}

export function getMetadata (rawMetadata: BasePageBlock & { format: { page_font?: string } }) {
  return {
    locked: rawMetadata?.format?.block_locked,
    page_full_width: rawMetadata?.format?.page_full_width,
    page_font: rawMetadata?.format?.page_font,
    page_small_text: rawMetadata?.format?.page_small_text,
    created_time: rawMetadata.created_time,
    last_edited_time: rawMetadata.last_edited_time,
  }
}
