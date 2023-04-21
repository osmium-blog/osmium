import { useCallback, useRef } from 'react'
import Link from 'next/link'
import { parseURL } from 'ufo'
import cn from 'classnames'

import css from './styles.module.scss'
import { useConfig } from '@/contexts/config'
import { useLocale } from '@/contexts/locale'
import { useData } from '@/contexts/data'
import { stopPropa } from '@/lib/utils'
import { useTheme } from '@/contexts/theme'

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
        {config.rss && (
          <li className={cn(css.site_nav_item, css.site_nav_feed)}>
            <Link href="/-/feed" title={locale.NAV.RSS} target="_blank">
              <i/>
              <span>Feed</span>
            </Link>
          </li>
        )}
        {config.appearance === 'auto' && <ThemeSwitch className={css.site_nav_item}/>}
      </ul>
      <Link href="/search" title={locale.NAV.SEARCH} className={css.site_nav_search}/>
      <button type="button" className={css.site_nav_more} onClick={stopPropa(toggleMenu)}/>
    </nav>
  )
}

function ThemeSwitch ({ className }: BasicProps) {
  const { theme, setTheme: _setTheme } = useTheme()

  const root = useRef<HTMLLIElement>(null)

  function toggleMenu (force?: boolean) {
    if (!root.current) return
    if (force === false || (force == null && root.current.dataset.menuOpen)) {
      delete root.current.dataset.menuOpen
      document.removeEventListener('click', onClickOutside, true)
    } else {
      root.current.dataset.menuOpen = 'true'
      document.addEventListener('click', onClickOutside, true)
    }
  }

  const onClickOutside = useCallback(
    (ev: globalThis.MouseEvent) => {
      if (root.current && !ev.composedPath().includes(root.current)) {
        toggleMenu(false)
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  const setTheme: typeof _setTheme = value => {
    _setTheme(value)
    toggleMenu(false)
  }

  return (
    <li ref={root} className={cn(className, css.site_nav_theme)}>
      <button data-theme={theme} type="button" onClick={stopPropa(() => toggleMenu())}>
        <i/>
      </button>
      <ul>
        <li className={css.site_theme_item}>
          <button
            type="button"
            data-theme="light"
            data-active={theme === 'light' || null}
            onClick={() => setTheme('light')}
          >
            <i/>
            <span>Light</span>
          </button>
        </li>
        <li className={css.site_theme_item}>
          <button
            type="button"
            data-theme="dark"
            data-active={theme === 'dark' || null}
            onClick={() => setTheme('dark')}
          >
            <i/>
            <span>Dark</span>
          </button>
        </li>
        <li className={css.site_theme_item}>
          <button
            type="button"
            data-theme="system"
            data-active={theme === 'system' || null}
            onClick={() => setTheme('system')}
          >
            <i/>
            <span>System</span>
          </button>
        </li>
      </ul>
    </li>
  )
}
