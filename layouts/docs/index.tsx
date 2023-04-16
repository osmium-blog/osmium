import type { ReactNode } from 'react'
import cn from 'classnames'

import css from './styles.module.scss'
import Header from '@/layouts/blog/header'
import LayoutNav from './nav'

export default function DocsLayout ({ children }: { children: ReactNode }) {
  return (
    <div className={css.layout}>
      <Header full className={css.layout_header}/>
      <main className={css.layout_main}>
        <nav className={css.layout_nav}>
          <LayoutNav/>
        </nav>
        <article className={css.page_content}>
          {children}
        </article>
        <div className={css.page_aside}>
        </div>
      </main>
    </div>
  )
}
