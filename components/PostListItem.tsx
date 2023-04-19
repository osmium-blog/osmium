import Link from 'next/link'

import { useConfig } from '@/contexts/config'
import type { PageMeta } from '@/lib/server/page'
import FormattedDate from '@/components/FormattedDate'
import UserAvatar from '@/components/UserAvatar'

type Props = {
  post: PageMeta
}

export default function PostListItem ({ post }: Props) {
  const { hasContent } = post
  switch (hasContent) {
    case false:
      return <ProverbPost post={post}/>
    default:
      return <NormalPost post={post}/>
  }
}

function NormalPost ({ post }: Props) {
  return (
    <Link href={'/' + (post.slug || post.hash)}>
      <article className="py-5">
        <header className="flex flex-col justify-between md:flex-row md:items-baseline">
          <h2 className="text-lg md:text-xl font-medium mb-2 cursor-pointer text-black dark:text-gray-100">
            {post.title}
          </h2>
          <FormattedDate date={post.date} className="flex-shrink-0 text-gray-600 dark:text-gray-400"/>
        </header>
        <p className="hidden md:block leading-8 text-gray-700 dark:text-gray-300">
          {post.summary}
        </p>
      </article>
    </Link>
  )
}

function ProverbPost ({ post }: Props) {
  const { author } = useConfig()

  return (
    <article className="post-type-proverb">
      <p className="post-author">
        <UserAvatar className="post-author-avatar"/>
        <span>{author}</span>
      </p>
      <p className="post-title">{post.title}</p>
      <p className="post-date">
        <FormattedDate date={post.date}/>
      </p>
    </article>
  )
}
