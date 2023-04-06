type BasicProps = {
  className?: string
  style?: import('react').CSSProperties
  children?: import('react').ReactNode
}

declare namespace Block {
  type Props = BasicProps & {
    block: import('notion-types').Block
  }
}
