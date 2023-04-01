import { getAllPosts, getAllTagsFromPosts } from 'lib/server/notion-api'
import SearchLayout from '@/layouts/search'

export async function getStaticPaths () {
  const posts = await getAllPosts({ includePages: false })
  const tags = getAllTagsFromPosts(posts)
  return {
    paths: Object.keys(tags).map(tag => ({ params: { tag } })),
    fallback: true,
  }
}

export async function getStaticProps ({ params }) {
  const currentTag = params.tag
  const posts = await getAllPosts({ includePages: false })
  const tags = getAllTagsFromPosts(posts)
  const filteredPosts = posts.filter(
    post => post && post.tags && post.tags.includes(currentTag),
  )
  return {
    props: {
      tags,
      posts: filteredPosts,
      currentTag,
    },
    revalidate: 1,
  }
}

export default function PageTag ({ tags, posts, currentTag }) {
  return <SearchLayout tags={tags} posts={posts} currentTag={currentTag}/>
}
