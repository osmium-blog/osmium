export const metadata = {
  title: 'Osmium Configurator',
  description: 'The Osmium config generator',
}

import Image from 'next/image'

import IMG_LOGO from '@/.github/logo.svg'
import loadLocale from '@/assets/i18n'
import { readConfig } from '@/lib/server/config'
import SiteFooterVersion from '@/components/site-footer-version'
import css from './layout.module.scss'
import { ConfiguratorProvider } from './configurator.context'
import { LocaleProvider } from './locale.context'
import GenerateButton from './generate-button'
import Debugger from './debugger'

const DEV = process.env.NODE_ENV === 'development'

const config = readConfig()

export default async function ConfiguratorLayout ({ children }: BasicProps) {
  const locale = await loadLocale('configurator', config.lang)

  return (
    <ConfiguratorProvider>
      <LocaleProvider lang={config.lang} locale={locale}>
        <div className={css.layout}>
          <header>
            <div className={css.layout_title}>
              <Image src={IMG_LOGO} alt="Osmium logo" width={32} height={32}/>
              <h1>Configurator</h1>
            </div>
            <GenerateButton/>
          </header>
          {children}
          {DEV && <Debugger/>}
          <footer>
            <SiteFooterVersion/>
          </footer>
        </div>
      </LocaleProvider>
    </ConfiguratorProvider>
  )
}
