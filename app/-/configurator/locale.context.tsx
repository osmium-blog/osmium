'use client'

import { createContext, useContext, useEffect, useState } from 'react'
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
  locale: Osmium.LocaleData
}

export function LocaleProvider ({ lang: langInit, locale: localeInit, children }: Props) {
  const [lang, setLang] = useState(langInit)
  const [locale, setLocale] = useState(localeInit)

  useEffect(() => {
    loadLocale('configurator', lang).then(setLocale)
  }, [lang])

  const context = { lang, setLang, locale }
  return <LocaleContext.Provider value={context}>{children}</LocaleContext.Provider>
}

export const useLocale = () => {
  const context = useContext(LocaleContext)
  const t = (key: string | string[]) => get(context.locale, key, key)
  return { ...context, t }
}
