'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { set } from 'lodash'
import destr from 'destr'

import { defaultConfig } from './assets/config-schema'

export const STORAGE_KEY = 'osmium-config'

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

  useEffect(() => {
    const cache = localStorage.getItem(STORAGE_KEY)
    if (cache) {
      _setConfig(destr(cache))
    }
  }, [])

  return (
    <ConfiguratorContext.Provider value={{ config, setConfig }}>
      {children}
    </ConfiguratorContext.Provider>
  )
}

export const useConfigurator = () => useContext(ConfiguratorContext)
