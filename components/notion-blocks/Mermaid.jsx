import { useEffect, useRef, useState } from 'react'
import mermaid from 'mermaid'
import { useTheme } from '@/contexts/theme'
import { getTextContent } from 'notion-utils'

export default function Mermaid ({ block }) {
  const { scheme } = useTheme()

  useEffect(() => {
    mermaid.initialize({ theme: scheme === 'dark' ? 'dark' : 'neutral' })
  }, [scheme])

  const source = getTextContent(block.properties.title)
  const container = useRef(null)
  const [svg, setSVG] = useState('')

  useEffect(() => {
    mermaid.render(`mermaid-${block.id}`, source, container.current)
      .then(({ svg }) => setSVG(svg))
  }, [block, source])

  return (
    <div
      ref={container}
      className="w-full leading-normal flex justify-center"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}
