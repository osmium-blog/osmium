import dynamic from 'next/dynamic'
import cn from 'classnames'
import { useConfig } from '@/contexts/config'

const requireModule = require.context('.', true, /^\.\/(?!index)([\w-]+)\.jsx?$/, 'lazy')

const modules = Object.fromEntries(
  requireModule.keys().map(path => {
    const [, provider] = /^\.\/(?!index)([\w-]+)\.jsx?$/.exec(path)
    return [provider, dynamic(() => requireModule(path), { ssr: false })]
  })
)

export default function Comments ({ post }) {
  const { fullWidth = false } = post

  const { comment = {} } = useConfig()
  const { provider } = comment

  const Provider = modules[provider]

  return Provider && (
    <div className={cn('px-4 font-medium text-gray-500 dark:text-gray-400 my-5', fullWidth ? 'md:px-24' : 'mx-auto max-w-2xl')}>
      {/* Prefer `foo` over `fooConfig` */}
      <Provider config={comment[provider] || comment[provider + 'Config']} post={post}/>
    </div>
  )
}
