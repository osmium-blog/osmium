import Database from '@/lib/server/database'

import type { InferGetStaticPropsType } from 'next'

import SearchLayout from '@/layouts/search'

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
  return <SearchLayout tags={tags} posts={posts}/>
}
