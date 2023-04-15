import { clientConfig, config } from '@/lib/server/config'
import Database from '@/lib/server/notion-api/database'

import type { InferGetStaticPropsType } from 'next'

import { useConfig } from '@/lib/config'
import Container from '@/components/Container'
import PostList from '@/components/PostList'
import Pagination from '@/components/Pagination'

export async function getStaticProps () {
  const db = new Database(config.databaseId)
  await db.syncAll()
  const posts = db.posts.map(post => post.toJson())
  const postsToShow = posts.slice(0, clientConfig.postsPerPage)
  return {
    props: {
      page: 1, // current page is 1
      postsToShow,
      showNext: posts.length > clientConfig.postsPerPage,
    },
    revalidate: 1,
  }
}

export default function PageIndex ({ postsToShow, page, showNext }: InferGetStaticPropsType<typeof getStaticProps>) {
  const { title, description } = useConfig()

  return (
    <Container title={title} description={description}>
      <PostList posts={postsToShow}/>
      {showNext && <Pagination page={page} showNext={showNext}/>}
    </Container>
  )
}
