import type { PageMeta } from '@/lib/server/page'
import { useConfig } from '@/contexts/config'
import PostList from '@/components/PostList'
import Pagination from '@/components/pagination'

type Props = {
  posts: PageMeta[]
  total: number
}

export default function IndexLayout ({ posts, total }: Props) {
  const config = useConfig()

  const showNext = total > config.postsPerPage

  return <>
    <PostList posts={posts}/>
    {showNext && <Pagination page={1} showNext={showNext}/>}
  </>
}
