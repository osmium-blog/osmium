import { clientConfig } from '@/lib/server/config'

import { useRouter } from 'next/router'
import cn from 'classnames'
import { getAllPosts, getPostBlocks } from 'lib/server/notion-api'
import { useLocale } from '@/lib/locale'
import { useConfig } from '@/lib/config'
import { createHash } from 'crypto'
import Container from '@/components/Container'
import Post from '@/components/Post'
import Comments from '@/components/comments'

export async function getStaticPaths () {
  const posts = await getAllPosts({ includePages: true })
  return {
    paths: posts.map(row => `${clientConfig.path || ''}/${row.slug}`),
    fallback: true,
  }
}

export async function getStaticProps ({ params: { slug } }) {
  const posts = await getAllPosts({ includePages: true })
  const post = posts.find(t => t.slug === slug)

  if (!post) return { notFound: true }

  const blockMap = await getPostBlocks(post.id)
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
