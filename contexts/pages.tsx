import { createContext, useContext } from 'react'
import type { ReactNode } from 'react'
import type { PageProps } from '@/lib/server/notion-api/page'

const PagesContext = createContext<PageProps[]>([])

type Props = {
  pages: PageProps[]
  children: ReactNode
}

export function PagesProvider ({ pages, children }: Props) {
  return <PagesContext.Provider value={pages}>{children}</PagesContext.Provider>
}

export function usePages () {
  return useContext(PagesContext)
}
