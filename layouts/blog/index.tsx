import type { ReactNode } from 'react'
import cn from 'classnames'

import type { PageProps } from '@/lib/server/notion-api/page'
import { useConfig } from '@/contexts/config'
import LayoutHead from './head'
import Header from './header'
import Footer from './footer'

type Props = {
  post?: PageProps
  children: ReactNode
}

export default function BlogLayout ({ post, children }: Props) {
  const config = useConfig()

  return <>
    <LayoutHead post={post}/>
    <div className={cn('wrapper', config.font === 'serif' ? 'font-serif' : 'font-sans')}>
      <Header title={post?.title}/>
      <main className={cn(
        'flex-1 transition-all',
        { 'self-center px-4 w-full max-w-2xl': !post },
      )}>
        {children}
      </main>
      <Footer fullWidth={post?.fullWidth}/>
    </div>
  </>
}
