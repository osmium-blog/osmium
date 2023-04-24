'use client'

import { useConfigurator } from './configurator.context'

export default function Debugger () {
  const { config } = useConfigurator()

  return (
    <pre className="px-8 py-4 text-xs text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-900 border-t border-gray-300 dark:border-gray-600">{JSON.stringify(config, null, 2)}</pre>
  )
}
