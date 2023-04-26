import PropTypes from 'prop-types'
import { getPageTableOfContents } from 'notion-utils'
import cn from 'classnames'

export default function TableOfContents ({ recordMap, className, style }) {
  const collectionId = Object.keys(recordMap.collection)[0]
  const page = Object.values(recordMap.block).find(block => block.value.parent_id === collectionId).value
  const nodes = getPageTableOfContents(page, recordMap)

  if (!nodes.length) return null

  /**
   * @param {string} id - The ID of target heading block (could be in UUID format)
   */
  function scrollTo (id) {
    id = id.replaceAll('-', '')
    const target = document.querySelector(`.notion-block-${id}`)
    if (!target) return
    // `65` is the height of expanded nav
    // TODO: Remove the magic number
    const top = document.documentElement.scrollTop + target.getBoundingClientRect().top - 65
    document.documentElement.scrollTo({
      top,
      behavior: 'smooth',
    })
  }

  return (
    <aside
      className={cn(className, 'lg:px-2 text-sm text-zinc-700/70 dark:text-neutral-400 bg-day/80 dark:bg-night/80 rounded backdrop-blur-lg')}
      style={style}
    >
      {nodes.map(node => (
        <div key={node.id}>
          <a
            data-target-id={node.id}
            className="block py-1 hover:text-black dark:hover:text-white cursor-pointer transition duration-100"
            style={{ paddingLeft: (node.indentLevel * 24) + 'px' }}
            onClick={() => scrollTo(node.id)}
          >
            {node.text}
          </a>
        </div>
      ))}
    </aside>
  )
}

TableOfContents.propTypes = {
  recordMap: PropTypes.object.isRequired,
}
