import Link from 'next/link'
import { useState } from 'react'

import css from './styles.module.scss'
import type { PageMeta } from '@/lib/server/page'
import { useLocale } from '@/contexts/locale'
import PostList from '@/components/PostList'
import cn from 'classnames'

export type Props = {
  tags: Record<string, number>
  activeTag?: string
  posts?: PageMeta[]
}

export default function SearchLayout ({ tags, activeTag, posts = [] }: Props) {
  const [searchValue, setSearchValue] = useState('')
  const keyword = searchValue.toLowerCase()

  // TODO: Improve performance
  const results = posts.filter(p => {
    const searchTarget = (p.title + p.summary + p.tags.join(' ')).toLowerCase()
    return searchTarget.includes(keyword)
  })

  const locale = useLocale()

  return <>
    <div className={css.search_input}>
      <input
        type="text"
        placeholder={
          activeTag
            ? locale.PAGE.SEARCH.INPUT_PLACEHOLDER.SEARCH_IN_TAG.replace('%s', activeTag)
            : locale.PAGE.SEARCH.INPUT_PLACEHOLDER.SEARCH_ARTICLES
        }
        onChange={ev => setSearchValue(ev.target.value)}
      />
      <button type="button"/>
    </div>
    <ul className={css.search_tag_list}>
      {Object.entries(tags).map(([tag, count]) => (
        <li key={tag}>
          <Tag tag={tag} count={count} active={tag === activeTag}/>
        </li>
      ))}
    </ul>
    <PostList posts={results}/>
  </>
}

type TagProps = BasicProps & {
  tag: string
  count?: number
  active?: boolean
}

function Tag ({ tag, count = 0, active = false }: TagProps) {
  const href = active ? '/search' : `/tag/${tag}`
  const className = cn(css.search_tag_link, { [css.active]: active })
  return (
    <Link href={href} className={className}>{tag}{count ? ` (${count})` : ''}</Link>
  )
}
