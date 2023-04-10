import { config, clientConfig } from '@/lib/server/config'

import { useRouter } from 'next/router'
import { getAllPosts, getPage } from '@/lib/server/notion-api'
import Page from '@/lib/server/notion-api/page'
import { createHash } from 'crypto'
import Container from '@/components/Container'
import Post from '@/components/Post'
import Comments from '@/components/comments'
import { parsePageId } from 'notion-utils'

export async function getStaticPaths () {
  if (process.env.NODE_ENV === 'development') return { paths: [], fallback: true }

  const posts = await getAllPosts({ includePages: true })
  return {
    // TODO: Pre-building only latest posts should be enough
    paths: posts.map(post => ({ params: { slug: post.slug } })),
    fallback: true,
  }
}

export async function getStaticProps ({ params: { slug } }) {
  let id = parsePageId(slug)
  /** @type {PageMeta} */
  let post
  let blockMap
  if (id) {
    blockMap = await getPage(id)
    const pageBlock = blockMap.block[id].value
    if (pageBlock) {
      const collectionId = pageBlock.parent_id
      if (collectionId === config.collectionId) {
        const collection = blockMap.collection[collectionId].value
        post = new Page(pageBlock, collection.schema).toJson()
      }
    }
  } else {
    const posts = await getAllPosts({ includePages: true })
    post = posts.find(t => t.slug === slug)
    if (post) {
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
    props: { post, blockMap, emailHash },
    revalidate: 1,
  }
}

export default function PagePost ({ post, blockMap, emailHash }) {
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
        blockMap={blockMap}
        emailHash={emailHash}
        fullWidth={fullWidth}
      />
      <Comments post={post}/>
    </Container>
  )
}
