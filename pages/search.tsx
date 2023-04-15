import Database from '@/lib/server/notion-api/database'
import { config } from '@/lib/server/config'

import type { InferGetStaticPropsType } from 'next'

import SearchLayout from '@/layouts/search'

export async function getStaticProps () {
  const db = new Database(config.databaseId)
  await db.syncAll()
  return {
    props: {
      tags: db.tagMap,
      posts: db.posts.map(post => post.toJson()),
    },
    revalidate: 1,
  }
}

export default function PageSearch ({ tags, posts }: InferGetStaticPropsType<typeof getStaticProps>) {
  return <SearchLayout tags={tags} posts={posts}/>
}
