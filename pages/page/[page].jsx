import { config, clientConfig } from '@/lib/server/config'
import Database from '@/lib/server/notion-api/database'

import Container from '@/components/Container'
import PostList from '@/components/PostList'
import Pagination from '@/components/Pagination'

export async function getStaticPaths () {
  const db = new Database(config.databaseId)
  await db.syncAll()
  const posts = db.posts.map(post => post.toJson())
  const totalPosts = posts.length
  const totalPages = Math.ceil(totalPosts / clientConfig.postsPerPage)
  return {
    // remove first page, we 're not gonna handle that.
    paths: Array.from({ length: totalPages - 1 }, (_, i) => ({
      params: { page: '' + (i + 2) },
    })),
    fallback: true,
  }
}

export async function getStaticProps ({ params: { page } }) {
  const db = new Database(config.databaseId)
  await db.syncAll()
  const posts = db.posts.map(post => post.toJson())
  const postsToShow = posts.slice(
    clientConfig.postsPerPage * (page - 1),
    clientConfig.postsPerPage * page,
  )
  const totalPosts = posts.length
  const showNext = page * clientConfig.postsPerPage < totalPosts
  return {
    props: {
      page, // Current Page
      postsToShow,
      showNext,
    },
    revalidate: 1,
  }
}

export default function PagePage ({ postsToShow, page, showNext }) {
  return (
    <Container>
      <PostList posts={postsToShow}/>
      <Pagination page={page} showNext={showNext}/>
    </Container>
  )
}
