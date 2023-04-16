import { createContext, useContext } from 'react'
import type { ReactNode } from 'react'
import { useRouter } from 'next/router'

import type { PageProps } from '@/lib/server/notion-api/page'
import type { Data } from '@/pages/api/data'

type Context = Data & {
  current?: PageProps
}

const DataContext = createContext<Context>(undefined as any)

type Props = {
  data: Data
  children: ReactNode
}

export function DataProvider ({ data, children }: Props) {
  const router = useRouter()
  const slug = router.query.slug
  const current: Context['current'] = slug ? Object.values(data.entryMap).find(it => (it.slug || it.hash) === slug) : undefined
  const value: Context = {
    ...data,
    current,
  }

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export function useData () {
  return useContext(DataContext)
}
