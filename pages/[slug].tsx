import { parsePageId } from 'notion-utils'
import { config } from '@/lib/server/config'
import api from '@/lib/server/notion-client'
import Database from '@/lib/server/database'
import Page from '@/lib/server/page'
//
import type { GetStaticPaths, InferGetStaticPropsType } from 'next'
import { useRouter } from 'next/router'
import type { PageBlock } from 'notion-types'

import { useLayout } from '@/contexts/layout'

type Params = {
  slug: string
}

export const getStaticPaths: GetStaticPaths = async () => {
  if (process.env.NODE_ENV === 'development') return { paths: [], fallback: true }

  const db = new Database()
  await db.sync()
  // TODO: Pre-building only latest posts should be enough
  const paths = [...db.all.values()].map(page => ({ params: { slug: page.slug || page.hash } }))
  return {
    paths,
    fallback: true,
  }
}

const NOT_FOUND = { notFound: true }

export const getStaticProps = async ({ params: { slug } }: { params: Params }) => {
  const id = parsePageId(slug)
  let post
  let recordMap
  let db

  // If it's a UUID access
  if (id) {
    recordMap = await api.getPage(id)
    const pageBlock = recordMap.block[id].value as PageBlock
    if (!pageBlock) return NOT_FOUND

    const collectionId = pageBlock.parent_id
    if (collectionId !== config.collectionId) return NOT_FOUND

    const collection = recordMap.collection[collectionId].value
    post = new Page(pageBlock, collection.schema)
    db = new Database()
    await db.sync()
  }
  // It's a normal slug access
  else {
    db = new Database()
    await db.sync()
    post = [...db.all.values()].find(page => (page.slug || page.hash) === slug)
    if (post) {
      recordMap = await api.getPage(post.id)
    }
  }

  if (!post) return NOT_FOUND

  return {
    props: {
      post: post.json(),
      recordMap,
    },
    revalidate: 1,
  }
}

export default function PagePost ({ post, recordMap }: InferGetStaticPropsType<typeof getStaticProps>) {
  const router = useRouter()
  const { Layout } = useLayout()

  // TODO: It would be better to render something
  if (router.isFallback) return null

  return <Layout.Post post={post} recordMap={recordMap}/>
}
