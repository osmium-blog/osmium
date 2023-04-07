import { createContext, useContext } from 'react'
import type { ReactNode } from 'react'
import defu from 'defu'

const ConfigContext = createContext<Osmium.Config | undefined>(undefined)

type Props = {
  value: Osmium.Config
  children: ReactNode
}

export function ConfigProvider ({ value, children }: Props) {
  const normalized = defu(value, {
    path: '/',
  })

  return (
    <ConfigContext.Provider value={normalized}>
      {children}
    </ConfigContext.Provider>
  )
}

export const useConfig = () => useContext(ConfigContext)!
