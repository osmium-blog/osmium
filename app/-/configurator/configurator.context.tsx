'use client'

import { createContext, useContext, useState } from 'react'
import { set } from 'lodash'

import { defaultConfig } from './assets/config-schema'

type Context = {
  config: Osmium.Config
  setConfig: (key: string | string[], value: JsonValue) => void
}

const ConfiguratorContext = createContext<Context>(undefined as any)

export function ConfiguratorProvider ({ children }: BasicProps) {
  const [config, _setConfig] = useState(defaultConfig())
  const setConfig: Context['setConfig'] = ((key, value) => {
    _setConfig(prev => set({ ...prev }, key, value))
  })

  return (
    <ConfiguratorContext.Provider value={{ config, setConfig }}>
      {children}
    </ConfiguratorContext.Provider>
  )
}

export const useConfigurator = () => useContext(ConfiguratorContext)
