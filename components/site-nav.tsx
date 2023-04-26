import cn from 'classnames'
import { stopPropa } from '@/lib/utils'
import Link from 'next/link'
import { useCallback, useRef } from 'react'
import { useConfig } from '@/contexts/config'
import { useTheme } from '@/contexts/theme'
import { useLocale } from '@/contexts/locale'

type NavItem = {
  label: string
  href: string
  icon?: string
}

type Props = BasicProps & {
  items: NavItem[]
}

export default function SiteNav ({ items, className, children }: Props) {
  const config = useConfig()
  const locale = useLocale()

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
    <nav ref={root} className={cn(className, 'site-nav')}>
      <ul className="site-nav-list">
        {items.map((it, idx) => (
          <li key={idx}>
            <Link href={it.href} target={/^\w+:\/\//.test(it.href) ? '_blank' : undefined}>
              {it.icon && <i className={it.icon}/>}
              <span>{it.label}</span>
            </Link>
          </li>
        ))}
        {config.rss && (
          <li className="site-nav-item-feed">
            <Link href="/-/feed" title={locale.NAV.RSS} target="_blank">
              <i/>
              <span>Feed</span>
            </Link>
          </li>
        )}
        {config.appearance === 'auto' && <ThemeSwitch/>}
      </ul>
      {children}
      <button type="button" className="site-nav-item-more" onClick={stopPropa(toggleMenu)}>
        <i/>
      </button>
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
    <li ref={root} data-theme={theme} className={cn(className, 'site-theme-switch')}>
      <button type="button" onClick={stopPropa(() => toggleMenu())}>
        <i/>
      </button>
      <ul className="site-theme-list">
        <li data-theme="light" data-active={theme === 'light' || null}>
          <button type="button" onClick={() => setTheme('light')}>
            <i/>
            <span>Light</span>
          </button>
        </li>
        <li data-theme="dark" data-active={theme === 'dark' || null}>
          <button type="button" onClick={() => setTheme('dark')}>
            <i/>
            <span>Dark</span>
          </button>
        </li>
        <li data-theme="system" data-active={theme === 'system' || null}>
          <button type="button" onClick={() => setTheme('system')}>
            <i/>
            <span>System</span>
          </button>
        </li>
      </ul>
    </li>
  )
}
