import type { ExtendedRecordMap } from 'notion-types'
import cn from 'classnames'

import css from './styles.module.scss'
import type { PageMeta } from '@/lib/server/page'
import { useConfig } from '@/contexts/config'
import { useTheme } from '@/contexts/theme'
import NotionRenderer from '@/components/NotionRenderer'
import TableOfContents from '@/components/TableOfContents'
import UserAvatar from '@/components/UserAvatar'
import FormattedDate from '@/components/FormattedDate'
import TagItem from '@/components/TagItem'
import Comments from '@/components/comments'

type Props = {
  post: PageMeta
  recordMap: ExtendedRecordMap
}

export default function PostLayout ({ post, recordMap }: Props) {
  const config = useConfig()
  const { scheme } = useTheme()

  const { title, type, date, tags, fullWidth } = post

  // @ts-ignore
  return <>
    <div className={cn(css.post_layout, fullWidth && css.fullwidth)}>
      <article>
        <h1 className={css.post_title}>{title}</h1>
        {type !== 'Page' && (
          <div className={css.post_info}>
            <div className="flex">
              <a href={config.socialLink || '#'} className="flex">
                <UserAvatar className="rounded-full"/>
                <p className="ml-2 md:block">{config.author}</p>
              </a>
              <span className="hidden sm:block ml-2">/</span>
            </div>
            <FormattedDate date={date}/>
            {tags.length && (
              <div className="flex flex-nowrap max-w-full overflow-x-auto article-tags">
                {tags.map(tag => (
                  <TagItem key={tag} tag={tag}/>
                ))}
              </div>
            )}
          </div>
        )}
        <div className={css.post_content}>
          <NotionRenderer recordMap={recordMap} fullPage={false} darkMode={scheme === 'dark'}/>
        </div>
      </article>
      <aside>
        {/* `65px` is the height of expanded nav */}
        {/* Plus 16px to keep margin */}
        {/* TODO: Remove the magic number */}
        <TableOfContents
          recordMap={recordMap}
          className="lg:inline-block sticky lg:mr-4"
          style={{ top: 65 + 16 + 'px' }}
        />
      </aside>
    </div>
    {/* @ts-ignore */}
    <Comments
      post={post}
      className={cn(
        'px-4 font-medium text-gray-500 dark:text-gray-400 my-5',
        fullWidth ? 'md:px-24' : 'mx-auto max-w-2xl',
      )}
    />
  </>
}
