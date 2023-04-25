export const metadata = {
  title: 'Osmium Configurator',
  description: 'The Osmium config generator',
}

import Image from 'next/image'

import SiteFooterVersion from '@/components/site-footer-version'
import Debugger from './debugger'

import IMG_LOGO from '@/.github/logo.svg'
import { readConfig } from '@/lib/server/config'
import css from './layout.module.scss'
import { ConfiguratorProvider } from './configurator.context'
import { LocaleProvider } from './locale.context'
import GenerateButton from './generate-button'

const DEV = process.env.NODE_ENV === 'development'

const config = readConfig()

export default function ConfiguratorLayout ({ children }: BasicProps) {
  return (
    <ConfiguratorProvider>
      <LocaleProvider lang={config.lang}>
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
