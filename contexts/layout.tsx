import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import dynamic from 'next/dynamic'

const requireLayout = (require as any).context('@/layouts', true, /^\.\/\w+\/(index|post-layout)\.tsx$/, 'lazy')
const loadLayout = (name: string) => ({
  Root: dynamic<{ children: ReactNode }>(() => requireLayout(`./${name}/index.tsx`)),
  Post: dynamic<any>(() => requireLayout(`./${name}/post-layout.tsx`)),
})

type Context = {
  layout: string
  setLayout: (layout: string) => void
  Layout: ReturnType<typeof loadLayout>
}

const LayoutContext = createContext<Context>(undefined as any)

export function LayoutProvider ({ children }: { children: ReactNode }) {
  const [layout, setLayout] = useState('blog')
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
