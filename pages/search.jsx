import { getAllPosts, getAllTagsFromPosts } from 'lib/server/notion-api'
import SearchLayout from '@/layouts/search'

export async function getStaticProps () {
  const posts = await getAllPosts({ includePages: false })
  const tags = getAllTagsFromPosts(posts)
  return {
    props: {
      tags,
      posts,
    },
    revalidate: 1,
  }
}

export default function PageSearch ({ tags, posts }) {
  return <SearchLayout tags={tags} posts={posts}/>
}
