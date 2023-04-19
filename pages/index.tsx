import { clientConfig } from '@/lib/server/config'
import Database from '@/lib/server/notion-api/database'
//
import type { InferGetStaticPropsType } from 'next'
//
import { useLayout } from '@/contexts/layout'

export async function getStaticProps () {
  const db = new Database()
  await db.syncAll()

  return {
    props: {
      posts: db.posts.slice(0, clientConfig.postsPerPage).map(post => post.meta),
      total: db.posts.length,
    },
    revalidate: 1,
  }
}

export default function PageIndex (props: InferGetStaticPropsType<typeof getStaticProps>) {
  const { Layout } = useLayout()

  return <Layout.Index {...props}/>
}
