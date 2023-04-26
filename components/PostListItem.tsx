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
      <article className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3 py-5">
        <h2 className="text-lg md:text-xl leading-6 font-medium text-black dark:text-neutral-100">
          {post.title}
        </h2>
        <FormattedDate date={post.date} className="leading-6 text-neutral-600 dark:text-neutral-400"/>
        {post.summary && (
          <p className="col-span-full hidden md:block text-gray-700 dark:text-gray-300">
            {post.summary}
          </p>
        )}
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
