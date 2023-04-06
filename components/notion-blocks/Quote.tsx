import { Text } from 'react-notion-x'
import cn from 'classnames'
import Block from './Block'

export default function Quote ({ block, children }: Block.Props) {
  const titleRaw = block.properties?.title
  const size = block.format?.quote_size

  return (
    <Block
      tag="blockquote"
      block={block}
      className={cn('osmium-quote', { 'osmium-quote-large': size === 'large' })}
    >
      <div>
        <p>
          <Text value={titleRaw} block={block}/>
        </p>
        {children}
      </div>
    </Block>
  )
}
