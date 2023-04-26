import type { ReactNode } from 'react'
import { useRouter } from 'next/router'

import css from './styles.module.scss'
import Header from './header'
import LayoutNav from './nav'
import LayoutFooter from './footer'

export default function DocsLayout ({ children }: { children: ReactNode }) {
  const router = useRouter()

  return (
    <div data-layout-root={true} data-page={router.pathname} className={css.layout}>
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
  )
}
