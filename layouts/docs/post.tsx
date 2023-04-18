import type { ExtendedRecordMap } from 'notion-types'
import cn from 'classnames'

import css from './styles.module.scss'
import type { PageProps } from '@/lib/server/notion-api/page'
import { useConfig } from '@/contexts/config'
import useTheme from '@/contexts/theme'
import NotionRenderer from '@/components/NotionRenderer'
import TableOfContents from '@/components/TableOfContents'
import UserAvatar from '@/components/UserAvatar'
import FormattedDate from '@/components/FormattedDate'
import TagItem from '@/components/TagItem'
import Comments from '@/components/comments'

type Props = {
  post: PageProps
  recordMap: ExtendedRecordMap
}

export default function SlugLayout ({ post, recordMap }: Props) {
  const config = useConfig()
  const { dark } = useTheme()

  const { title, type, date, tags } = post

  return <>
    <div className={css.post_layout}>
      <article>
        <h1 className={css.post_title}>{title}</h1>
        {type !== 'Page' && (
          <div className={css.post_info}>
            <div className="mr-2 mb-4 md:ml-0">
              Last updated:&nbsp;
              <FormattedDate date={date}/>
            </div>
          </div>
        )}
        <div className={css.post_content}>
          <NotionRenderer recordMap={recordMap} fullPage={false} darkMode={dark}/>
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
      <Comments post={post} className={css.post_comments}/>
    </div>
  </>
}
