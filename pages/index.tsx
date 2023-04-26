import { clientConfig } from '@/lib/server/config'
import Database from '@/lib/server/database'
//
import type { InferGetStaticPropsType } from 'next'
//
import { useLayout } from '@/contexts/layout'

export async function getStaticProps () {
  const db = new Database()
  await db.sync()

  return {
    props: {
      posts: [...db.posts.values()].slice(0, clientConfig.postsPerPage).map(post => post.json()),
      total: db.posts.size,
    },
    revalidate: 1,
  }
}

export default function PageIndex (props: InferGetStaticPropsType<typeof getStaticProps>) {
  const { Layout } = useLayout()

  return <Layout.Index {...props}/>
}
