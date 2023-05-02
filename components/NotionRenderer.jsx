import dynamic from 'next/dynamic'
import Link from 'next/link'
import { NotionRenderer as Renderer } from 'react-notion-x'
import { getTextContent } from 'notion-utils'

import { FONTS_SANS, FONTS_SERIF } from '@/consts'
import { useConfig } from '@/contexts/config'
import { useData } from '@/contexts/data'
import Block from '@/components/notion-blocks'

const customBlockRenderer = ({ block, children }) => <Block block={block}>{children}</Block>
// Lazy-load some heavy components & override the renderers of some block types
const components = {
  /* Lazy-load */

  // Code block
  Code: dynamic(async () => {
    return function CodeSwitch (props) {
      let Component
      switch (getTextContent(props.block.properties.language)) {
        case 'Mermaid':
          Component = dynamic(() => {
            return import('./notion-blocks/Mermaid').then(module => module.default)
          }, { ssr: false })
          break
        default:
          Component = dynamic(() => {
            return import('./notion-blocks/code').then(module => module.default)
          })
      }
      return <Component {...props}/>
    }
  }),
  // Database block
  Collection: dynamic(() => {
    return import('react-notion-x/build/third-party/collection').then(module => module.Collection)
  }),
  // Equation block & inline variant
  Equation: dynamic(() => {
    return Promise.all([
      import('react-notion-x/build/third-party/equation'),
      import('katex/dist/katex.min.css'),
    ]).then(([module]) => module.Equation)
  }),
  // PDF (Embed block)
  Pdf: dynamic(() => {
    return import('react-notion-x/build/third-party/pdf').then(module => module.Pdf)
  }, { ssr: false }),
  // Tweet block
  Tweet: dynamic(() => {
    return import('react-tweet-embed').then(module => {
      const { default: TweetEmbed } = module
      return function Tweet ({ id }) {
        return <TweetEmbed tweetId={id} options={{ theme: 'dark' }}/>
      }
    })
  }),

  /* Overrides */

  PageLink: Link,

  toggle_osmium: customBlockRenderer,
  bulleted_list_osmium: customBlockRenderer,
  numbered_list_osmium: customBlockRenderer,
  quote_osmium: customBlockRenderer,
}

/**
 * Notion page renderer
 *
 * A wrapper of react-notion-x/NotionRenderer with predefined `components` and `mapPageUrl`
 *
 * @param props - Anything that react-notion-x/NotionRenderer supports
 */
export default function NotionRenderer (props) {
  const config = useConfig()

  const fontFamily = ['sans-serif', 'serif'].includes(config.font)
    ? { 'sans-serif': FONTS_SANS.join(','), 'serif': FONTS_SERIF.join(',') }[config.font]
    : config.font

  if (props.recordMap) {
    // Prevent page properties from being rendered
    for (const it of Object.values(props.recordMap.collection)[0].value.format?.property_visibility || []) {
      it.visibility = 'hide'
    }
    // Mark block types to be custom rendered by appending a suffix
    for (const { value: block } of Object.values(props.recordMap.block)) {
      switch (block?.type) {
        case 'toggle':
        case 'bulleted_list':
        case 'numbered_list':
        case 'quote':
          block.type += '_osmium'
          break
      }
    }
  }

  const { slugMap } = useData()
  const mapPageUrl = id => {
    return slugMap[id] || 'https://notion.so/' + id.replaceAll('-', '')
  }

  return (
    <>
      <style jsx global>
        {`
          .notion {
            --notion-font: ${fontFamily};
          }
        `}
      </style>
      <Renderer
        components={components}
        mapPageUrl={mapPageUrl}
        {...props}
      />
    </>
  )
}
