import { useCallback, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import defu from 'defu'
import { useConfig } from '@/lib/config'
import { useLocale } from '@/lib/locale'

const NavBar = () => {
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

export default function Header ({ navBarTitle, fullWidth }) {
  const BLOG = useConfig()

  const navRef = useRef(/** @type {HTMLDivElement} */ undefined)
  const sentinelRef = useRef(/** @type {HTMLDivElement} */ undefined)
  const handler = useCallback(([entry]) => {
    if (navRef.current) {
      navRef.current?.classList.toggle('sticky-nav-full', !entry.isIntersecting)
    } else {
      navRef.current?.classList.add('remove-sticky')
    }
  }, [])

  useEffect(() => {
    const sentinelEl = sentinelRef.current
    const observer = new window.IntersectionObserver(handler)
    observer.observe(sentinelEl)

    return () => {
      sentinelEl && observer.unobserve(sentinelEl)
    }
  }, [handler, sentinelRef])

  function handleClickHeader (/** @type {MouseEvent} */ ev) {
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
        className={`sticky-nav group m-auto w-full px-4 h-6 flex flex-row justify-between items-center mb-2 md:mb-12 py-8 bg-opacity-60`}
        id="sticky-nav"
        ref={navRef}
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
        <div className="flex items-center">
          {BLOG.logo && (
            <Link href={BLOG.path || '/'} aria-label={BLOG.title}>
              <Image src={(BLOG.path || '/') + BLOG.logo} alt={'The logo of ' + BLOG.title} width={32} height={32}/>
            </Link>
          )}
          <HeaderName postTitle={navBarTitle}/>
        </div>
        <NavBar/>
      </div>
    </>
  )
}

function HeaderName ({ postTitle }) {
  const { path, title, description } = defu(useConfig(), { path: '/' })
  const locale = useLocale()

  return (
    <Link
      href={path || '/'}
      className="header-name ml-2 font-medium text-gray-600 dark:text-gray-300 capture-pointer-events grid-rows-1 grid-cols-1"
    >
      {postTitle && <span className="post-title row-start-1 col-start-1">{postTitle}</span>}
      <span className="row-start-1 col-start-1">
        <span className="site-title">{title}</span>
        <span className="site-description font-normal">, {description}</span>
      </span>
      <span className="ui-back-to-home row-start-1 col-start-1">← {locale.NAV.BACK_TO_HOME}</span>
    </Link>
  )
}
