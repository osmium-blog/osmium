import { useCallback, useEffect, useRef } from 'react'
import type { MouseEvent } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Image from 'next/image'
import { useConfig } from '@/lib/config'
import { useLocale } from '@/lib/locale'

type Props = {
  navBarTitle?: string
  fullWidth?: boolean
}

export default function Header ({ navBarTitle, fullWidth }: Props) {
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
    <Link href={path} aria-label={title} className="site-block-title">
      {logo && (
        <Image
          src={path + logo}
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
  const BLOG = useConfig()
  const locale = useLocale()
  const links = [
    { id: 0, name: locale.NAV.INDEX, to: BLOG.path || '/', show: true },
    { id: 1, name: locale.NAV.ABOUT, to: '/about', show: BLOG.showAbout },
    { id: 2, name: locale.NAV.RSS, to: '/-/feed', show: true },
    { id: 3, name: locale.NAV.SEARCH, to: '/search', show: true },
  ]
  return (
    <div className="flex-shrink-0">
      <ul className="flex flex-row">
        {links.map(
          link =>
            link.show && (
              <li
                key={link.id}
                className="block ml-4 text-black dark:text-gray-50 nav"
              >
                <Link href={link.to}>{link.name}</Link>
              </li>
            ),
        )}
      </ul>
    </div>
  )
}
