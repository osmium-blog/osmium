import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import { useRouter } from 'next/router'

import { useData } from '@/contexts/data'
import css from './styles.module.scss'
import Header from './header'
import LayoutHead from '@/layouts/blog/head'
import LayoutNav from './nav'
import LayoutFooter from './footer'

const LayoutStateContext = createContext(undefined as any)

export function useLayoutState () {
  return useContext(LayoutStateContext)
}

export default function DocsLayout ({ children }: { children: ReactNode }) {
  const router = useRouter()
  const { current: post } = useData()

  const [hasNav, setHasNav] = useState(false)
  const layoutState = {
    hasNav: setHasNav,
  }

  return (
    <LayoutStateContext.Provider value={layoutState}>
      <LayoutHead post={post}/>
      <div
        data-layout-root={true}
        data-page={router.pathname}
        data-no-nav={hasNav ? null : 'true'}
        className={css.layout}
      >
        <Header className={css.layout_header}/>
        <main className={css.layout_main}>
          <nav className={css.layout_nav}>
            <LayoutNav/>
          </nav>
          <div className={css.layout_page}>
            {children}
            <LayoutFooter/>
          </div>
        </main>
      </div>
    </LayoutStateContext.Provider>
  )
}
