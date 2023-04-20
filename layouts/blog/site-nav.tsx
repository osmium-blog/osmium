import { useRef } from 'react'
import Link from 'next/link'
import { parseURL } from 'ufo'
import cn from 'classnames'

import css from './styles.module.scss'
import { useConfig } from '@/contexts/config'
import { useLocale } from '@/contexts/locale'
import { useData } from '@/contexts/data'
import { stopPropa } from '@/lib/utils'

export default function SiteNav ({ className }: BasicProps) {
  const config = useConfig()
  const locale = useLocale()

  const { pages} = useData()
  let favorites = pages.filter(page => page.type === 'Page')
  // Remove `/about` if user is using `showAbout` to avoid conflicts
  // TODO: Remove in v2.0
  if (typeof config.showAbout === 'boolean') {
    favorites = favorites.filter(p => p.slug !== 'about')
  }

  type NavLink = { name: string, to: string, external?: boolean }
  const links: NavLink[] = [
    { name: locale.NAV.INDEX, to: '/' },
    config.showAbout && { name: locale.NAV.ABOUT, to: '/about' },
    ...favorites.map(p => {
      const external = Boolean(parseURL(p.slug).protocol)
      return {
        name: p.title!,
        to: external ? p.slug! : '/' + (p.slug || p.hash),
        external,
      }
    }),
    config.rss && { name: locale.NAV.RSS, to: '/-/feed', external: true },
    { name: locale.NAV.SEARCH, to: '/search' },
  ].filter(Boolean)

  const root = useRef<HTMLElement>(null)

  function toggleMenu () {
    if (!root.current) return
    if (root.current.dataset.menuOpen) {
      delete root.current.dataset.menuOpen
    } else {
      root.current.dataset.menuOpen = 'true'
    }
  }

  return (
    <nav ref={root} className={cn(className, css.site_nav)}>
      <ul className={css.site_nav_list}>
        {links.map((link, idx) => (
          <li key={idx} className={css.site_nav_item}>
            <Link href={link.to} target={link.external ? '_blank' : undefined}>{link.name}</Link>
          </li>
        ))}
      </ul>
      <button type="button" className={css.site_nav_more} onClick={stopPropa(toggleMenu)}/>
    </nav>
  )
}
