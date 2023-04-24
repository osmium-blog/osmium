type JsonValue = null | number | string | boolean | Record<string, JsonValue> | JsonValue[]

type ReactNode = import('react').ReactNode

type BasicProps = {
  className?: string
  style?: Record<string, number | string>
  children?: ReactNode
}

declare namespace Notion {
  export { Block, BlockMap } from 'notion-types'
}

declare namespace Block {
  type Props = BasicProps & {
    block: Notion.Block
  }
}

declare namespace Osmium {
  // FIXME: Replace with actual types
  type Config = Record<string, JsonValue>

  type LocaleData = Record<string, string | LocaleData>
}
