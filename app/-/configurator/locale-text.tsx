'use client'

import { useLocale } from './locale.context'

type Props = BasicProps & {
  t: string | string[]
  tag?: keyof JSX.IntrinsicElements
}

export default function LocaleText ({ t: key, tag: Tag, className, style }: Props) {
  const { t } = useLocale()
  const text = t(key)
  return text
    ? Tag
      ? <Tag className={className} style={style} dangerouslySetInnerHTML={{ __html: text }}/>
      : text
    : null
}
