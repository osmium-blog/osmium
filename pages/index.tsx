import { clientConfig } from '@/lib/server/config'
import Database from '@/lib/server/notion-api/database'
//
import type { InferGetStaticPropsType } from 'next'
//
import { useConfig } from '@/contexts/config'
import BlogLayout from '@/layouts/blog'
import PostList from '@/components/PostList'
import Pagination from '@/components/Pagination'

export async function getStaticProps () {
  const db = new Database()
  await db.syncAll()

  return {
    props: {
      posts: db.posts.slice(0, clientConfig.postsPerPage).map(post => post.toJson()),
      total: db.posts.length,
    },
    revalidate: 1,
  }
}

export default function PageIndex ({ posts, total }: InferGetStaticPropsType<typeof getStaticProps>) {
  const config = useConfig()

  const showNext = total > config.postsPerPage

  return (
    <BlogLayout>
      <PostList posts={posts}/>
      {showNext && <Pagination page={1} showNext={showNext}/>}
    </BlogLayout>
  )
}
