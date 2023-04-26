import type { ExtendedRecordMap } from 'notion-types'

import css from './styles.module.scss'
import type { PageMeta } from '@/lib/server/page'
import { useTheme } from '@/contexts/theme'
import NotionRenderer from '@/components/NotionRenderer'
import TableOfContents from '@/components/TableOfContents'
import FormattedDate from '@/components/FormattedDate'
import Comments from '@/components/comments'

type Props = {
  post: PageMeta
  recordMap: ExtendedRecordMap
}

export default function SlugLayout ({ post, recordMap }: Props) {
  const { scheme } = useTheme()

  const { title, type, date, tags } = post

  return <>
    <div className={css.post_layout}>
      <article>
        <h1 className={css.post_title}>{title}</h1>
        {post.summary && <p className={css.post_summary}>{post.summary}</p>}
        <div className={css.post_info}>
          <div className={css.post_update_time}>
            <span>Last update:&nbsp;</span>
            <FormattedDate date={date}/>
          </div>
        </div>
        <div className={css.post_content}>
          <NotionRenderer recordMap={recordMap} fullPage={false} darkMode={scheme === 'dark'}/>
        </div>
      </article>
      <aside>
        {/* @ts-ignore */}
        <TableOfContents recordMap={recordMap} className={css.post_toc}/>
      </aside>
      <Comments post={post} className={css.post_comments}/>
    </div>
  </>
}
