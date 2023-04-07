import { useEffect, useRef } from 'react'
import { useConfig } from '@/lib/config'

export default function Utterances ({ config, post }) {
  const { appearance } = useConfig()
  const theme = {
    auto: 'preferred-color-scheme',
    light: 'github-light',
    dark: 'github-dark',
  }[appearance]

  const container = useRef()

  useEffect(() => {
    const script = document.createElement('script')
    script.setAttribute('src', 'https://utteranc.es/client.js')
    script.setAttribute('crossorigin', 'anonymous')
    script.setAttribute('async', '')
    script.setAttribute('repo', config.repo)
    script.setAttribute('issue-term', post.id)
    script.setAttribute('theme', theme)

    const _container = container.current
    _container.appendChild(script)

    return () => void (_container.innerHTML = '')
  }, [config.repo, post.id, theme])

  return (
    <div ref={container} className="md:-ml-16"/>
  )
}
