type JsonValue = null | number | string | boolean | Record<string, JsonValue> | JsonValue[]

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

declare namespace Osmium {
  // FIXME: Replace this any
  type Config = Record<string, any>

  type LocaleData = Record<string, string | LocaleData>
}
