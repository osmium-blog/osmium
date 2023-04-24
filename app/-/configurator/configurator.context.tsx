'use client'

import { createContext, useContext, useState } from 'react'
import { clone, set } from 'lodash'

import example from '@/assets/config-data'

type Context = {
  config: Osmium.Config
  setConfig: (key: string | string[], value: JsonValue) => void
}

const ConfiguratorContext = createContext<Context>(undefined as any)

type Props = BasicProps & Partial<Context>

export function ConfiguratorProvider ({ config: configInit, setConfig: setConfigInit, children }: Props) {
  const [config, _setConfig] = useState(configInit || clone(example))
  const setConfig: Context['setConfig'] = setConfigInit || ((key, value) => {
    _setConfig(prev => {
      return set({ ...prev }, ([] as string[]).concat(key), value)
    })
  })

  return (
    <ConfiguratorContext.Provider value={{ config, setConfig }}>
      {children}
    </ConfiguratorContext.Provider>
  )
}

export const useConfigurator = () => useContext(ConfiguratorContext)
