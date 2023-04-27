'use client'

import { createContext, useContext } from 'react'

const ConfigContext = createContext<Osmium.Config>(undefined as any)

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
