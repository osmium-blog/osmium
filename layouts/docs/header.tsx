import type { MouseEvent } from 'react'
import { parseURL } from 'ufo'

import css from './styles.module.scss'
import { useData } from '@/contexts/data'
import SiteNav from '@/components/site-nav'
import SiteTitle from './site-title'
import { stopPropa } from '@/lib/utils'

export default function Header ({ className }: BasicProps) {
  function handleClickHeader (ev: MouseEvent) {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function openMenu (ev: MouseEvent) {
    const root = (ev.target as Element).closest('[data-layout-root]') as HTMLDivElement
    if (root) {
      if (root.dataset.layoutMenuOpen) delete root.dataset.layoutMenuOpen
      else root.dataset.layoutMenuOpen = 'true'
    }
  }

  /* Site Nav */

  const { pages } = useData()
  const navItems = pages
    .filter(p => p.type === 'Page')
    .map(p => {
      const external = Boolean(parseURL(p.slug).protocol)
      return {
        label: p.title,
        href: external ? p.slug! : '/' + (p.slug || p.hash),
      }
    })

  return <>
    <div className={className} onClick={handleClickHeader}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={css.layout_header_caret}>
        <path d="M12 10.828l-4.95 4.95-1.414-1.414L12 8l6.364 6.364-1.414 1.414z"/>
      </svg>
      <button type="button" className={css.layout_header_burger} onClick={stopPropa(openMenu)}/>
      <SiteTitle/>
      <SiteNav items={navItems} className={css.layout_header_nav}/>
    </div>
  </>
}
