import Link from 'next/link'
import { parseURL } from 'ufo'

import { useConfig } from '@/contexts/config'
import { useLocale } from '@/contexts/locale'
import { useData } from '@/contexts/data'

export default function SiteNav () {
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

  return (
    <nav className="flex-shrink-0 ml-4">
      <ul className="flex flex-row space-x-4">
        {links.map((link, idx) => (
          <li key={idx} className="block text-black dark:text-gray-50 nav">
            <Link
              href={link.to}
              target={link.external ? '_blank' : undefined}
              className="hover:underline underline-offset-4"
            >
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
