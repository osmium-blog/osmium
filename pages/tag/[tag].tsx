import Database from '@/lib/server/database'
//
import type { InferGetStaticPropsType } from 'next'

import { useLayout } from '@/contexts/layout'

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
      activeTag: tag,
    },
    revalidate: 1,
  }
}

export default function PageTag ({ tags, posts, activeTag }: InferGetStaticPropsType<typeof getStaticProps>) {
  const { Layout } = useLayout()

  return <Layout.Search tags={tags} posts={posts} activeTag={activeTag}/>
}
