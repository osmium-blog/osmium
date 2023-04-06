type BasicProps = {
  className?: string
  style?: Record<string, number | string>
  children?: import('react').ReactNode
}

declare namespace Notion {
  export { Block, BlockMap } from 'notion-types'
}

declare namespace Block {
  type Props = BasicProps & {
    block: Notion.Block
  }
}
