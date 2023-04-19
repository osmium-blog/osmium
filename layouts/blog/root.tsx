import type { ReactNode } from 'react'
import cn from 'classnames'

import { useConfig } from '@/contexts/config'
import { useData } from '@/contexts/data'
import LayoutHead from './head'
import Header from './header'
import Footer from './footer'

export default function BlogLayout ({ children }: { children: ReactNode }) {
  const config = useConfig()
  const { current: post } = useData()

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
