import Database from '@/lib/server/database'
//
import type { InferGetStaticPropsType } from 'next'

import { useLayout } from '@/contexts/layout'

export async function getStaticProps () {
  const db = new Database()
  await db.sync()
  return {
    props: {
      tags: db.tagStats,
      posts: [...db.posts.values()].map(post => post.json()),
    },
    revalidate: 1,
  }
}

export default function PageSearch ({ tags, posts }: InferGetStaticPropsType<typeof getStaticProps>) {
  const { Layout } = useLayout()

  return <Layout.Search tags={tags} posts={posts}/>
}
