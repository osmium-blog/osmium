import type { PageMeta } from '@/lib/server/page'
import PostListItem from '@/components/PostListItem'

type Props = {
  posts?: PageMeta[]
}

export default function PostList ({ posts }: Props) {
  return (
    <ul className="post-list divide-y divide-gray-300 dark:divide-gray-700">
      {posts?.map(post => (
        <li key={post.id}>
          <PostListItem post={post}/>
        </li>
      ))}
    </ul>
  )
}
