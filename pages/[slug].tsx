import { createHash } from 'node:crypto'
import { parsePageId } from 'notion-utils'
import { clientConfig, config } from '@/lib/server/config'
import getPage from '@/lib/server/notion-api/getPage'
import Database from '@/lib/server/notion-api/database'
import Page from '@/lib/server/notion-api/page'

import type { GetStaticPaths, InferGetStaticPropsType } from 'next'
import { useRouter } from 'next/router'
import type { PageBlock } from 'notion-types'
import Container from '@/components/Container'
import Post from '@/components/Post'
import Comments from '@/components/comments'

type Params = {
  slug: string
}

export const getStaticPaths: GetStaticPaths = async () => {
  if (process.env.NODE_ENV === 'development') return { paths: [], fallback: true }

  const db = new Database(config.databaseId)
  await db.syncAll()
  // TODO: Pre-building only latest posts should be enough
  const paths = Object.values(db.pageMap).map(page => ({ params: { slug: page.slug } }))
  return {
    paths,
    fallback: true,
  }
}

export const getStaticProps = async ({ params: { slug } }: { params: Params }) => {
  const id = parsePageId(slug)
  let post
  let blockMap

  if (id) {
    blockMap = await getPage(id)
    const pageBlock = blockMap.block[id].value as PageBlock
    if (pageBlock) {
      const collectionId = pageBlock.parent_id
      if (collectionId === config.collectionId) {
        const collection = blockMap.collection[collectionId].value
        post = new Page(pageBlock, collection.schema)
      }
    }
  } else {
    // TODO: Only when user provided an unfamiliar slug should this be executed
    const db = new Database(config.databaseId)
    await db.syncAll()
    post = db.posts.find(page => page.slug === slug)
    if (post) {
      // TODO: Is this necessary?
      blockMap = await getPage(post.id)
    }
  }

  if (!post) return { notFound: true }

  const emailHash = createHash('md5')
    .update(clientConfig.email)
    .digest('hex')
    .trim()
    .toLowerCase()

  return {
    props: { post: post.toJson(), blockMap, emailHash },
    revalidate: 1,
  }
}

export default function PagePost ({ post, blockMap, emailHash }: InferGetStaticPropsType<typeof getStaticProps>) {
  const router = useRouter()

  // TODO: It would be better to render something
  if (router.isFallback) return null

  const fullWidth = post.fullWidth ?? false

  return (
    <Container
      layout="blog"
      title={post.title}
      description={post.summary}
      slug={post.slug}
      // date={new Date(post.publishedAt).toISOString()}
      type="article"
      fullWidth={fullWidth}
    >
      <Post
        post={post}
        blockMap={blockMap!}
        emailHash={emailHash}
        fullWidth={fullWidth}
      />
      <Comments post={post}/>
    </Container>
  )
}
