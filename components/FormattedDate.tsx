import { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'

import { useConfig } from '@/lib/config'

dayjs.extend(localizedFormat)

const loaded: Record<string, Promise<void> | true> = {}

type Props = {
  date: number
  className?: string
}

export default function FormattedDate ({ date, className }: Props) {
  const lang = useConfig().lang.slice(0, 2)
  const [isLocaleLoaded, setIsLocaleLoaded] = useState(loaded[lang] === true)

  useEffect(() => {
    if (!isLocaleLoaded) {
      loaded[lang] ??= import(`dayjs/locale/${lang}`).then(
        () => {
          loaded[lang] = true
          dayjs.locale(lang)
        },
        () => console.warn(`dayjs locale \`${lang}\` not found`),
      )
      ;(loaded[lang] as Promise<void>).then(() => setIsLocaleLoaded(true))
    }

  }, [isLocaleLoaded, lang])

  const day = dayjs(date)

  return <time dateTime={day.toISOString()} className={className}>{day.format('ll')}</time>
}
