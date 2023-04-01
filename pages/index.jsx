import { clientConfig } from '@/lib/server/config'

import Container from '@/components/Container'
import PostListItem from '@/components/PostListItem'
import Pagination from '@/components/Pagination'
import { getAllPosts } from 'lib/server/notion-api'
import { useConfig } from '@/lib/config'

export async function getStaticProps () {
  const posts = await getAllPosts({ includePages: false })
  const postsToShow = posts.slice(0, clientConfig.postsPerPage)
  const totalPosts = posts.length
  const showNext = totalPosts > clientConfig.postsPerPage
  return {
    props: {
      page: 1, // current page is 1
      postsToShow,
      showNext,
    },
    revalidate: 1,
  }
}

export default function PageIndex ({ postsToShow, page, showNext }) {
  const { title, description } = useConfig()

  return (
    <Container title={title} description={description}>
      <ul className="divide-y divide-gray-300 dark:divide-gray-700">
        {postsToShow.map(post => (
          <li key={post.id} className="py-5">
            <PostListItem post={post}/>
          </li>
        ))}
      </ul>
      {showNext && <Pagination page={page} showNext={showNext}/>}
    </Container>
  )
}
