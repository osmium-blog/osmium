import PostListItem from '@/components/PostListItem'

export default function PostList ({ posts }) {
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
