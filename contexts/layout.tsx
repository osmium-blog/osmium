import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'

import Layout from '@/layouts'

type LayoutContext = {
  layout: string
  setLayout: (layout: string) => void
}

const LayoutContext = createContext<LayoutContext | undefined>(undefined)

export function LayoutProvider ({ children }: { children: ReactNode }) {
  const [layout, setLayout] = useState('blog')

  return (
    <LayoutContext.Provider value={{ layout, setLayout }}>
      <Layout name={layout}>
        {children}
      </Layout>
    </LayoutContext.Provider>
  )
}

export const useLayout = () => useContext(LayoutContext)
