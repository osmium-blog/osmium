import { parsePageId } from 'notion-utils'
import { config } from '@/lib/server/config'
import getPage from '@/lib/server/notion-api/getPage'
import Database from '@/lib/server/notion-api/database'
import Page from '@/lib/server/notion-api/page'

import type { GetStaticPaths, InferGetStaticPropsType } from 'next'
import { useRouter } from 'next/router'
import type { PageBlock } from 'notion-types'
import { PageMapProvider } from '@/contexts/pageMap'
import Container from '@/components/Container'
import Post from '@/components/Post'
import Comments from '@/components/comments'

type Params = {
  slug: string
}

export const getStaticPaths: GetStaticPaths = async () => {
  if (process.env.NODE_ENV === 'development') return { paths: [], fallback: true }

  const db = new Database()
  await db.syncAll()
  // TODO: Pre-building only latest posts should be enough
  const paths = Object.values(db.pageMap).map(page => ({ params: { slug: page.slug || page.hash } }))
  return {
    paths,
    fallback: true,
  }
}

const NOT_FOUND = { notFound: true }

export const getStaticProps = async ({ params: { slug } }: { params: Params }) => {
  const id = parsePageId(slug)
  let post
  let blockMap
  let db
  let pageMap

  // If it's a UUID access
  if (id) {
    blockMap = await getPage(id)
    const pageBlock = blockMap.block[id].value as PageBlock
    if (!pageBlock) return NOT_FOUND

    const collectionId = pageBlock.parent_id
    if (collectionId !== config.collectionId) return NOT_FOUND

    const collection = blockMap.collection[collectionId].value
    post = new Page(pageBlock, collection.schema)
    db = new Database()
    await db.syncAll()
  }
  // It's a normal slug access
  else {
    db = new Database()
    await db.syncAll()
    post = Object.values(db.pageMap).find(page => (page.slug || page.hash) === slug)
    if (post) {
      blockMap = await getPage(post.id)
    }
  }

  if (!post) return NOT_FOUND

  pageMap = Object.fromEntries(Object.values(db.pageMap).map(post => [post.id, post.slug || post.hash]))

  return {
    props: {
      post: post.toJson(),
      blockMap,
      pageMap,
    },
    revalidate: 1,
  }
}

export default function PagePost ({ post, blockMap, pageMap }: InferGetStaticPropsType<typeof getStaticProps>) {
  const router = useRouter()

  // TODO: It would be better to render something
  if (router.isFallback) return null

  return (
    <Container
      layout="blog"
      title={post.title}
      description={post.summary}
      slug={post.slug}
      // date={new Date(post.publishedAt).toISOString()}
      type="article"
      fullWidth={post.fullWidth}
    >
      <PageMapProvider pageMap={pageMap}>
        <Post post={post} blockMap={blockMap!}/>
      </PageMapProvider>
      <Comments post={post}/>
    </Container>
  )
}
