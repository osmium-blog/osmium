import Link from 'next/link'

import type { PageProps } from '@/lib/server/notion-api/page'
import { useData } from '@/contexts/data'

export default function LayoutNav () {
  const { posts, entryMap } = useData()

  return (
    <ul>
      {posts.map(id => (
        <NavItem key={id} post={entryMap[id]}/>
      ))}
    </ul>
  )
}

function NavItem ({ post }: { post: PageProps }) {
  const href = '/' + (post.slug || post.hash)

  return (
    <li>
      <Link href={href}>{post.title}</Link>
    </li>
  )
}
