import { createContext, useContext } from 'react'
import type { ReactNode } from 'react'

const ConfigContext = createContext<Osmium.Config | undefined>(undefined)

type Props = {
  value: Osmium.Config
  children: ReactNode
}

export function ConfigProvider ({ value, children }: Props) {
  return (
    <ConfigContext.Provider value={value}>
      {children}
    </ConfigContext.Provider>
  )
}

export const useConfig = () => useContext(ConfigContext)!
