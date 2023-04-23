import dynamic from 'next/dynamic'

import { useConfig } from '@/contexts/config'

const requireModule = require.context('.', true, /^\.\/(?!index)([\w-]+)\.jsx?$/, 'lazy')

const modules = Object.fromEntries(
  requireModule.keys().map(path => {
    const [, provider] = /^\.\/(?!index)([\w-]+)\.jsx?$/.exec(path)
    return [provider, dynamic(() => requireModule(path), { ssr: false })]
  })
)

export default function Comments ({ post, className }) {
  const { comment = {} } = useConfig()
  const { provider } = comment

  const Provider = modules[provider]

  return Provider && (
    <div className={className}>
      {/* Prefer `foo` over `fooConfig` */}
      <Provider config={comment[provider] || comment[provider + 'Config']} post={post}/>
    </div>
  )
}
