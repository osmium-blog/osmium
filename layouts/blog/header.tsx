import { useCallback, useEffect, useRef } from 'react'
import type { MouseEvent } from 'react'

import SiteTitle from './site-title'
import SiteNav from './site-nav'

type Props = {
  title?: string
}

export default function Header ({ title }: Props) {
  const navRef = useRef<HTMLDivElement | null>(null)
  const sentinelRef = useRef<HTMLDivElement | null>(null)
  const handler = useCallback<IntersectionObserverCallback>(([entry]) => {
    navRef.current?.classList.toggle('sticky-nav-full', !entry.isIntersecting)
  }, [])

  useEffect(() => {
    if (!sentinelRef.current) return

    const sentinelEl = sentinelRef.current
    const observer = new IntersectionObserver(handler)
    observer.observe(sentinelEl)

    return () => {
      sentinelEl && observer.unobserve(sentinelEl)
    }
  }, [handler, sentinelRef])

  function handleClickHeader (ev: MouseEvent) {
    if (ev.target === navRef.current) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return <>
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
      <SiteTitle pageTitle={title}/>
      <SiteNav/>
    </div>
  </>
}
