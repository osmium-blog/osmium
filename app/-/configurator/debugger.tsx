'use client'

import { useConfigurator } from './configurator.context'

export default function Debugger () {
  const { config } = useConfigurator()

  return (
    <pre className="px-8 py-4 text-xs bg-gray-100 border-t border-gray-300">{JSON.stringify(config, null, 2)}</pre>
  )
}
