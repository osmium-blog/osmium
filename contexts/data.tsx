import { createContext, useContext } from 'react'
import type { ReactNode } from 'react'
import { useRouter } from 'next/router'

import type { PageMeta } from '@/lib/server/page'
import type { Data } from '@/pages/api/data'

type Context = Data & {
  current?: PageMeta
}

const DataContext = createContext<Context>(undefined as any)

type Props = {
  data: Data
  noRouter?: boolean
  children: ReactNode
}

export function DataProvider ({ data, noRouter = false, children }: Props) {
  if (noRouter) {
    return <DataContext.Provider value={data}>{children}</DataContext.Provider>
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const router = useRouter()
  const slug = router.query.slug
  const current: Context['current'] = slug ? Object.values(data.pageMap).find(it => (it.slug || it.hash) === slug) : undefined
  const value: Context = {
    ...data,
    current,
  }

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export function useData () {
  return useContext(DataContext)
}
