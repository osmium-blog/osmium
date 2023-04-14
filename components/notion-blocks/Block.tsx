import cn from 'classnames'

type Props = {
  tag?: keyof JSX.IntrinsicElements
}

export default function Block ({ tag: Tag = 'div', block, className, style, children }: Block.Props & Props) {
  const blockColor = block.format?.block_color

  return (
    <Tag
      data-block-id={process.env.NODE_ENV === 'development' ? block.id : null}
      className={cn('osmium-block', blockColor && `notion-${blockColor}`, className)}
      style={style}
    >
      {children}
    </Tag>
  )
}
