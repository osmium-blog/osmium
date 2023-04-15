import dynamic from 'next/dynamic'
import { useConfig } from '@/contexts/config'

const requireModule = require.context('.', true, /^\.\/(?!index)([\w-]+)\.jsx?$/, 'lazy')

const modules = Object.fromEntries(
  requireModule.keys().map(path => {
    const [, provider] = /^\.\/(?!index)([\w-]+)\.jsx?$/.exec(path)
    return [provider, dynamic(() => requireModule(path), { ssr: false })]
  })
)

export default function Analytics () {
  const { analytics = {} } = useConfig()
  const { provider } = analytics

  const Provider = modules[provider]

  return Provider && (
    // Prefer `foo` over `fooConfig`
    <Provider config={analytics[provider] || analytics[provider + 'Config']}/>
  )
}
