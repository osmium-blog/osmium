import { createContext, useContext } from 'react'
import type { ReactNode } from 'react'

type PageMap = Record<string, string>

const PageMapContext = createContext<PageMap>({})

type Props = {
  pageMap: PageMap
  children: ReactNode
}

export function PageMapProvider ({ pageMap, children }: Props) {
  return <PageMapContext.Provider value={pageMap}>{children}</PageMapContext.Provider>
}

export function usePageMap () {
  return useContext(PageMapContext)
}
