import type { ReactNode } from 'react'
import cn from 'classnames'

import css from './styles.module.scss'
import Header from './header'
import LayoutNav from './nav'
import { useData } from '@/contexts/data'

export default function DocsLayout ({ children }: { children: ReactNode }) {
  const { pages } = useData()
  const navPages = pages.filter(page => page.type === 'Post')

  return (
    <div data-layout-root={true} className={css.layout}>
      <Header className={css.layout_header}/>
      <main className={css.layout_main}>
        <nav className={css.layout_nav}>
          <LayoutNav pages={navPages}/>
        </nav>
        <div className={css.layout_page}>
          {children}
        </div>
      </main>
    </div>
  )
}
