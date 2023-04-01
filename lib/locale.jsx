import { createContext, useContext, useEffect } from 'react'
import { useConfig } from '@/lib/config'
import { setDefaultTimezone } from '@/lib/dayjs'

const LocaleContext = createContext(undefined)

export function LocaleProvider ({ value, children }) {
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

export const useLocale = () => useContext(LocaleContext)
