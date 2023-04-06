import { Text } from 'react-notion-x'
import cn from 'classnames'
import Block from './Block'

export default function Toggle ({ block, children }: Block.Props) {
  return (
    <Block
      tag="details"
      block={block}
      className={cn('osmium-toggle', { 'osmium-toggle-empty': !children })}
    >
      <summary>
        <span className="osmium-toggle-triangle">
          <svg viewBox="0 0 100 100">
            <polygon points="5.9,88.2 50,11.8 94.1,88.2"/>
          </svg>
        </span>
        <span className="osmium-toggle-title">
          <Text value={block.properties?.title} block={block}/>
        </span>
      </summary>
      {children && (
        <div className="osmium-toggle-content">
          {children}
        </div>
      )}
    </Block>
  )
}
