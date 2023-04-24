'use client'

import { useLocale } from './locale.context'

type Props = BasicProps & {
  t: string | string[]
  tag?: keyof JSX.IntrinsicElements
}

export default function LocaleText ({ t: key, tag: Tag, className, style }: Props) {
  const { t } = useLocale()
  return Tag
    ? <Tag className={className} style={style} dangerouslySetInnerHTML={{ __html: t(key) }}/>
    : t(key)
}
