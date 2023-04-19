import Database from '@/lib/server/database'

import type { InferGetStaticPropsType } from 'next'

import SearchLayout from '@/layouts/search'

export async function getStaticPaths () {
  const db = new Database()
  await db.sync()
  const paths = Object.keys(db.tagStats).map(tag => ({ params: { tag } }))
  return {
    paths,
    fallback: true,
  }
}

export async function getStaticProps ({ params: { tag } }: { params: Record<string, string> }) {
  const db = new Database()
  await db.sync()
  const posts = [...db.posts.values()].map(post => post.json())
  const tags = db.tagStats
  return {
    props: {
      tags,
      posts: posts.filter(post => post.tags?.includes(tag)),
      currentTag: tag,
    },
    revalidate: 1,
  }
}

export default function PageTag ({ tags, posts, currentTag }: InferGetStaticPropsType<typeof getStaticProps>) {
  return <SearchLayout tags={tags} posts={posts} currentTag={currentTag}/>
}
