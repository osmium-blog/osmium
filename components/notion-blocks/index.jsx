import Toggle from './Toggle'
import List from './List'

export default function Block ({ block, children }) {
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
  }

  return (
    <BlockComponent
      block={block}
      data-block-id={process.env.NODE_ENV === 'development' ? block.id : null}
      className="osmium-block"
    >
      {children}
    </BlockComponent>
  )
}
