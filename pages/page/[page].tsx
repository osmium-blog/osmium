import { readConfigRaw } from '@/lib/server/config'
import Database from '@/lib/server/database'

import type { InferGetStaticPropsType } from 'next'

import PostList from '@/components/PostList'
import Pagination from '@/components/pagination'

export async function getStaticPaths () {
  const config = readConfigRaw()

  const db = new Database(config.databaseId)
  await db.sync()
  const posts = [...db.posts.values()].map(post => post.json())
  const totalPages = Math.ceil(posts.length / config.postsPerPage)

  return {
    paths: Array.from({ length: totalPages }, (_, idx) => ({
      params: { page: String(idx + 1) },
    })),
    fallback: true,
  }
}

export async function getStaticProps ({ params: { page } }: { params: Record<string, string> }) {
  const config = readConfigRaw()

  const pageNum = +page

  const db = new Database(config.databaseId)
  await db.sync()
  const posts = [...db.posts.values()]
    .slice(...[pageNum - 1, pageNum].map(n => n * config.postsPerPage))
    .map(p => p.json())
  console.log(db.posts.size, config.postsPerPage, posts.length)
  const showNext = db.posts.size > pageNum * config.postsPerPage

  return {
    props: { posts, pageNum, showNext },
    revalidate: 1,
  }
}

export default function PagePage ({ posts, pageNum, showNext }: InferGetStaticPropsType<typeof getStaticProps>) {
  return <>
    <PostList posts={posts}/>
    <Pagination page={pageNum} showNext={showNext}/>
  </>
}
