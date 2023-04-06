import { createContext, useContext, useEffect } from 'react'
import type { ReactNode } from 'react'
import { useConfig } from '@/lib/config'
import { setDefaultTimezone } from '@/lib/dayjs'

const LocaleContext = createContext<Osmium.LocaleData | undefined>(undefined)

type Props = {
  value: Osmium.LocaleData
  children: ReactNode
}

export function LocaleProvider ({ value, children }: Props) {
  const { timezone } = useConfig()

  useEffect(() => {
    setDefaultTimezone(timezone)
  }, [timezone])

  return (
    <LocaleContext.Provider value={value}>
      {children}
    </LocaleContext.Provider>
  )
}

export const useLocale = () => useContext(LocaleContext)!
