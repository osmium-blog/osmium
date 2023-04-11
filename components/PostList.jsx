import PostListItem from '@/components/PostListItem'

export default function PostList ({ posts }) {
  return (
    <ul className="divide-y divide-gray-300 dark:divide-gray-700">
      {posts.map(post => (
        <li key={post.id} className="py-5">
          <PostListItem post={post}/>
        </li>
      ))}
    </ul>
  )
}
