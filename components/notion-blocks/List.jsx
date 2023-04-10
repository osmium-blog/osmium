import { Text, useNotionContext } from 'react-notion-x'
import cn from 'classnames'

export default function List ({ block, children, ...props }) {
  const { recordMap } = useNotionContext()

  let ListElement
  switch (block.type) {
    case 'bulleted_list':
      ListElement = BulletedList
      break
    case 'numbered_list':
      ListElement = NumberedList
      break
  }

  return (
    <ListElement
      {...props}
      block={block}
      blockMap={recordMap.block}
      className="osmium-block osmium-list"
    >
      <li>
        <div className="osmium-list-item">
          <span className="osmium-list-title">
            <Text value={block.properties?.title}/>
          </span>
          {children && (
            <div className="osmium-list-content">
              {children}
            </div>
          )}
        </div>
      </li>
    </ListElement>
  )
}

function BulletedList ({ block, blockMap, className, children, ...props }) {
  const type = resolveBulletType(block, blockMap)

  return (
    <ul {...props} className={cn(className, `osmium-list-${type}`)}>
      {children}
    </ul>
  )
}

const BULLET_TYPES = ['disc', 'circle', 'square']

function resolveBulletType (block, blockMap) {
  const [firstItem] = findFirstItem(block, blockMap)
  const type = firstItem.format?.bullet_list_format
  if (type) return type

  const [, level] = findTopItem(firstItem, blockMap)
  return BULLET_TYPES[level % BULLET_TYPES.length]
}

function NumberedList ({ block, blockMap, className, children, ...props }) {
  const type = resolveNumberType(block, blockMap)
  const index = transformIndexNumber(resolveIndexNumber(block, blockMap), type)

  return (
    <ol
      {...props}
      className={cn(className, `osmium-list-${type}`)}
      style={{ '--list-item-index': `"${index}."` }}
    >
      {children}
    </ol>
  )
}

const NUMBER_TYPES = ['numbers', 'letters', 'roman']

function resolveNumberType (block, blockMap) {
  const [firstItem] = findFirstItem(block, blockMap)
  const type = firstItem.format?.list_format
  if (type) return type

  const [, level] = findTopItem(firstItem, blockMap)
  return NUMBER_TYPES[level % NUMBER_TYPES.length]
}

function resolveIndexNumber (block, blockMap) {
  const [firstItem, firstItemIdx, fromIdx] = findFirstItem(block, blockMap)
  // console.log(block.id, firstItem.id, firstItemIdx, fromIdx)
  return (firstItem.format?.list_start_index ?? 1) + (fromIdx - firstItemIdx)
}

const ROMAN_NUMBERS = {
  m: 1000,
  cm: 900,
  d: 500,
  cd: 400,
  c: 100,
  xc: 90,
  l: 50,
  xl: 40,
  x: 10,
  ix: 9,
  v: 5,
  iv: 4,
  i: 1,
}

function transformIndexNumber (num, type) {
  switch (type) {
    case 'letters': {
      const result = []
      while (num > 0) {
        const remainder = (num - 1) % 26
        result.unshift(String.fromCharCode(97 + remainder))
        num = Math.floor((num - remainder) / 26)
      }
      return result.join('')
    }
    case 'roman': {
      const result = []
      for (const [roman, value] of Object.entries(ROMAN_NUMBERS)) {
        while (num >= value) {
          result.push(roman)
          num -= value
        }
      }
      return result.join('')
    }
    default:
      return String(num)
  }
}

function findFirstItem (block, blockMap) {
  const siblingIds = blockMap[block.parent_id]?.value?.content
  const fromIdx = siblingIds?.indexOf(block.id)

  for (let prevIdx = fromIdx - 1; prevIdx >= 0; prevIdx--) {
    const prevBlock = blockMap[siblingIds[prevIdx]]?.value
    if (prevBlock?.type !== block.type) {
      return [block, prevIdx + 1, fromIdx]
    } else if (prevIdx === 0) {
      return [prevBlock, prevIdx, fromIdx]
    } else {
      block = prevBlock
    }
  }

  return [block, fromIdx, fromIdx]
}

function findTopItem (block, blockMap) {
  let level = 0
  while (true) {
    const parentId = blockMap[block.id]?.value?.parent_id
    const parent = blockMap[parentId]?.value
    if (block.type !== parent?.type) {
      break
    } else {
      level++
      block = parent
    }
  }

  return [block, level]
}
