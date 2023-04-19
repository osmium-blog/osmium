import { useRouter } from 'next/router'

import type { PageMeta } from '@/lib/server/notion-api/page'

export default function IndexLayout ({ posts }: { posts: PageMeta[] }) {
  const firstPage = posts.find(p =>
    p.hasContent &&
    (p.slug ? /^(?!https?:\/\/)/.test(p.slug) : true)
  )

  const router = useRouter()
  router.replace('/' + (firstPage ? (firstPage.slug || firstPage.hash) : '404'))

  return null
}
