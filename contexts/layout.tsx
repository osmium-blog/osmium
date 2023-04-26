import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import dynamic from 'next/dynamic'
import type { ExtendedRecordMap } from 'notion-types'

import type { PageMeta } from '@/lib/server/page'
import { useConfig } from '@/contexts/config'
import type { Props as SearchLayoutProps } from '@/layouts/blog/search'

const requireLayout = (require as any).context('@/layouts', true, /^\.\/\w+\/(root|index|post|search)\.tsx$/, 'lazy')
const loadLayout = (name: string) => {
  const _require = (key: string) => requireLayout.keys().includes(key)
    ? requireLayout(key)
    : Promise.resolve(() => null)
  return {
    Root: dynamic<BasicProps>(() => requireLayout(`./${name}/root.tsx`)),
    Index: dynamic<Partial<{
      posts: PageMeta[]
      total: number
    }>>(() => _require(`./${name}/index.tsx`)),
    Post: dynamic<Partial<{
      post: PageMeta
      recordMap: ExtendedRecordMap
    }>>(() => _require(`./${name}/post.tsx`)),
    Search: dynamic<SearchLayoutProps>(() => _require(`./${name}/search.tsx`)),
  }
}

type Context = {
  layout: string
  setLayout: (layout: string) => void
  Layout: ReturnType<typeof loadLayout>
}

const LayoutContext = createContext<Context>(undefined as any)

export function LayoutProvider ({ children }: { children: ReactNode }) {
  const config = useConfig()
  const [layout, setLayout] = useState(config.layout)
  const Layout = loadLayout(layout)

  return (
    <LayoutContext.Provider value={{ layout, setLayout, Layout }}>
      <Layout.Root>
        {children}
      </Layout.Root>
    </LayoutContext.Provider>
  )
}

export const useLayout = () => useContext(LayoutContext)
