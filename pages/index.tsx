import { readConfig } from '@/lib/server/config'
import Database from '@/lib/server/database'
//
import type { InferGetStaticPropsType } from 'next'
import type { ExtendedRecordMap } from 'notion-types'
//
import { useLayout } from '@/contexts/layout'

export async function getStaticProps () {
  const config = readConfig()

  const db = new Database()
  await db.sync()

  if (db.index) {
    await db.index.sync()
    const recordMap: ExtendedRecordMap = db.index.data.recordMap!
    return {
      props: {
        post: db.index.json(),
        recordMap,
      },
      revalidate: 1,
    }
  } else {
    return {
      props: {
        posts: [...db.posts.values()].slice(0, config.postsPerPage).map(post => post.json()),
        total: db.posts.size,
      },
      revalidate: 1,
    }
  }
}

export default function PageIndex (props: InferGetStaticPropsType<typeof getStaticProps>) {
  const { Layout } = useLayout()
  return props.post
    ? <Layout.Post {...props}/>
    : <Layout.Index {...props}/>
}
