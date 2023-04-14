import Toggle from './Toggle'
import List from './List'
import Quote from './Quote'

export default function Block ({ block, children }: Block.Props) {
  // Remove custom renderer suffix for easy reading
  block.type = block.type.replace(/_osmium$/, '')

  let BlockComponent
  switch (block.type) {
    case 'toggle':
      BlockComponent = Toggle
      break

    case 'bulleted_list':
    case 'numbered_list':
      BlockComponent = List
      break

    case 'quote':
      BlockComponent = Quote
      break

    default:
      throw new Error('This should not happen')
  }

  return <BlockComponent block={block}>{children}</BlockComponent>
}
