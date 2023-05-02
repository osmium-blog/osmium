import type { MouseEvent } from 'react'
import { parseURL } from 'ufo'

import css from './styles.module.scss'
import { useData } from '@/contexts/data'
import SiteNav from '@/components/site-nav'
import SiteTitle from './site-title'
import { stopPropa } from '@/lib/utils'
import { PageMeta } from '@/lib/server/page'

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

  const { pages, pageMap } = useData()
  const navItems = pages
    .filter(p => (
      p.type === 'Page' &&
      p.slug !== 'index'
    ))
    .map(p => ({
      label: p.title,
      href: resolveHref(p, pageMap),
    }))

  return <>
    <div className={className} onClick={handleClickHeader}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={css.layout_header_caret}>
        <path d="M12 10.828l-4.95 4.95-1.414-1.414L12 8l6.364 6.364-1.414 1.414z"/>
      </svg>
      <button type="button" className={css.layout_header_burger} onClick={stopPropa(openMenu)}>
        <i/>
      </button>
      <SiteTitle/>
      <SiteNav items={navItems} className={css.layout_header_nav}/>
    </div>
  </>
}

function resolveHref (page: PageMeta, pageMap: Record<string, PageMeta>): string {
  function getFirstOpenableChild (page: PageMeta): PageMeta | null {
    for (const id of page.child ?? []) {
      const p = pageMap[id]
      if (p.slug || p.hasContent) {
        return p
      } else if (p.child?.length) {
        const found = getFirstOpenableChild(p)
        if (found) {
          return found
        }
      }
    }
    return null
  }

  // If it's an external link, use it
  if (parseURL(page.slug).protocol) {
    return page.slug!
  }
  // Otherwise, try to find an openable child
  let firstOpenableChild: PageMeta | null
  if (!page.hasContent && (firstOpenableChild = getFirstOpenableChild(page))) {
    return '/' + (firstOpenableChild.slug || firstOpenableChild.hash)
  }
  // Finally, use the page itself no matter what
  return '/' + (page.slug || page.hash)
}
