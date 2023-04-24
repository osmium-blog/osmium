'use client'

import { langs } from '@/assets/i18n'
import Select from '@/components/ui/select'
import { useLocale } from './locale.context'

export default function LangSelect ({ className }: BasicProps) {
  const { lang, setLang } = useLocale()

  return (
    <Select value={lang} className={className} onChange={value => setLang(value)}>
      {langs.map(([value, label]) => (
        <option key={value} value={value}>{label}</option>
      ))}
    </Select>
  )
}
