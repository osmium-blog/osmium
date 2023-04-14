import { config } from '@/lib/server/config'
import Database from '@/lib/server/notion-api/database'

import SearchLayout from '@/layouts/search'

export async function getStaticPaths () {
  const db = new Database(config.databaseId)
  await db.syncAll()
  const paths = Object.keys(db.tagMap).map(tag => ({ params: { tag } }))
  return {
    paths,
    fallback: true,
  }
}

export async function getStaticProps ({ params: { tag } }) {
  const db = new Database(config.databaseId)
  await db.syncAll()
  const posts = db.posts.map(post => post.toJson())
  const tags = db.tagMap
  return {
    props: {
      tags,
      posts: posts.filter(post => post.tags?.includes(tag)),
      currentTag: tag,
    },
    revalidate: 1,
  }
}

export default function PageTag ({ tags, posts, currentTag }) {
  return <SearchLayout tags={tags} posts={posts} currentTag={currentTag}/>
}
