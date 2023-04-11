import Link from 'next/link'
import { useConfig } from '@/lib/config'
import FormattedDate from '@/components/FormattedDate'

export default function PostListItem ({ post }) {
  const { path } = useConfig()
  const href = `${path || ''}/${post.slug}`.replaceAll(/\/{2,}/g, '/')

  return (
    <Link href={href}>
      <article key={post.id}>
        <header className="flex flex-col justify-between md:flex-row md:items-baseline">
          <h2 className="text-lg md:text-xl font-medium mb-2 cursor-pointer text-black dark:text-gray-100">
            {post.title}
          </h2>
          <time className="flex-shrink-0 text-gray-600 dark:text-gray-400">
            <FormattedDate date={post.date}/>
          </time>
        </header>
        <main>
          <p className="hidden md:block leading-8 text-gray-700 dark:text-gray-300">
            {post.summary}
          </p>
        </main>
      </article>
    </Link>
  )
}
