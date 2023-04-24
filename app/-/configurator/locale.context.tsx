'use client'

import { createContext, useContext, useState } from 'react'
import dynamic from 'next/dynamic'
import { get } from 'lodash'

import loadLocale from '@/assets/i18n'

type Context = {
  lang: string
  setLang: (value: string) => void
  locale: Osmium.LocaleData
}

const LocaleContext = createContext<Context>(undefined as any)

type Props = BasicProps & {
  lang: string
}

export const LocaleProvider = dynamic<Props>(async () => {
  // eslint-disable-next-line react/display-name
  return ({ lang: langInit, children }) => {
    const [lang, setLang] = useState(langInit)
    const Dynamic = dynamic(async () => {
      const locale = await loadLocale('configurator', lang)
      const context = { lang, setLang, locale }
      // eslint-disable-next-line react/display-name
      return () => <LocaleContext.Provider value={context}>{children}</LocaleContext.Provider>
    })
    return <Dynamic/>
  }
})

export const useLocale = () => {
  const context = useContext(LocaleContext)
  const t = (key: string | string[]) => get(context.locale, key, key)
  return { ...context, t }
}
