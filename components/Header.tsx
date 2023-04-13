import { useCallback, useEffect, useRef } from 'react'
import type { MouseEvent } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Image from 'next/image'
import { joinURL, parseURL } from 'ufo'
import { useConfig } from '@/lib/config'
import { useLocale } from '@/lib/locale'
import { usePages } from '@/contexts/pages'

type Props = {
  navBarTitle?: string
}

export default function Header ({ navBarTitle }: Props) {
  const navRef = useRef<HTMLDivElement>(null)
  const sentinelRef = useRef<HTMLDivElement>(null)
  const handler = useCallback<IntersectionObserverCallback>(([entry]) => {
    if (!navRef.current) return
    navRef.current.classList.toggle('sticky-nav-full', !entry.isIntersecting)
  }, [])

  useEffect(() => {
    if (!sentinelRef.current) return

    const sentinelEl = sentinelRef.current
    const observer = new window.IntersectionObserver(handler)
    observer.observe(sentinelEl)

    return () => {
      sentinelEl && observer.unobserve(sentinelEl)
    }
  }, [handler, sentinelRef])

  function handleClickHeader (ev: MouseEvent) {
    if (ev.target !== navRef.current) return

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  return (
    <>
      <div className="observer-element h-4 md:h-12" ref={sentinelRef}></div>
      <div
        ref={navRef}
        id="sticky-nav"
        className={`sticky-nav group m-auto w-full px-4 h-6 flex flex-row justify-between items-center mb-2 md:mb-12 py-8 bg-opacity-60`}
        onClick={handleClickHeader}
      >
        <svg
          viewBox="0 0 24 24"
          className="caret w-6 h-6 absolute inset-x-0 bottom-0 mx-auto pointer-events-none opacity-30 group-hover:opacity-100 transition duration-100"
        >
          <path
            d="M12 10.828l-4.95 4.95-1.414-1.414L12 8l6.364 6.364-1.414 1.414z"
            className="fill-black dark:fill-white"
          />
        </svg>
        <SiteTitle pageTitle={navBarTitle}/>
        <NavBar/>
      </div>
    </>
  )
}

type SiteTitleProps = {
  pageTitle?: string
}

function SiteTitle ({ pageTitle }: SiteTitleProps) {
  const router = useRouter()
  const { logo, path, title, description } = useConfig()
  const locale = useLocale()

  return (
    <Link href="/" aria-label={title} className="site-block-title">
      {logo && (
        <Image
          src={joinURL(path, logo)}
          alt={'Logo of ' + title}
          width={32}
          height={32}
          className="site-logo"
        />
      )}
      <span>
        {router.asPath !== '/' && <span className="back-to-home">{locale.NAV.BACK_TO_HOME}</span>}
        {pageTitle && <span className="page-title">{pageTitle}</span>}
        <span className="site-title">
          <span className="site-name">{title}</span>
          <span className="site-description">{description}</span>
        </span>
      </span>
    </Link>
  )
}

function NavBar () {
  const { showAbout } = useConfig()
  const locale = useLocale()

  let userPages = usePages()
  // Remove `/about` if user is using `showAbout` to avoid conflicts
  // TODO: Remove in v2.0
  if (typeof showAbout === 'boolean') {
    userPages = userPages.filter(p => p.slug !== 'about')
  }

  type NavLink = { name: string, to: string, external?: boolean, show: boolean }
  const links: NavLink[] = [
    { name: locale.NAV.INDEX, to: '/', show: true },
    { name: locale.NAV.ABOUT, to: '/about', show: showAbout },
    ...userPages.map(p => {
      const external = Boolean(parseURL(p.slug).protocol)
      return {
        name: p.title!,
        to: external ? p.slug! : '/' + (p.slug || p.hash),
        external,
        show: true,
      }
    }),
    { name: locale.NAV.RSS, to: '/-/feed', show: true },
    { name: locale.NAV.SEARCH, to: '/search', show: true },
  ]

  return (
    <nav className="flex-shrink-0">
      <ul className="flex flex-row space-x-4">
        {links.map((link, idx) =>
          link.show && (
            <li key={idx} className="block text-black dark:text-gray-50 nav">
              <Link
                href={link.to}
                target={link.external ? '_blank' : undefined}
                className="hover:underline underline-offset-4"
              >
                {link.name}
              </Link>
            </li>
          ),
        )}
      </ul>
    </nav>
  )
}
