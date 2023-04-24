export const metadata = {
  title: 'Osmium Configurator',
  description: 'The Osmium config generator',
}

import Image from 'next/image'

import Debugger from './debugger'

import IMG_LOGO from '@/.github/logo.svg'
import { readConfig } from '@/lib/server/config'
import { ConfiguratorProvider } from './configurator.context'
import { LocaleProvider } from './locale.context'
import GenerateButton from './generate-button'

const DEV = process.env.NODE_ENV === 'development'

const config = readConfig()

export default function ConfiguratorLayout ({ children }: BasicProps) {
  return (
    <ConfiguratorProvider>
      <LocaleProvider lang={config.lang}>
        <div className="min-h-screen flex flex-col">
          <header className="p-4 flex items-center sticky top-0 z-10 bg-day/80 backdrop-blur-lg border-b border-neutral-300">
            <div className="flex items-center gap-2">
              <Image src={IMG_LOGO} alt="Osmium logo" width={32} height={32}/>
              <h1 className="text-2xl font-semi text-black dark:text-white">Configurator</h1>
            </div>
            <GenerateButton className="ml-auto"/>
          </header>
          {children}
          {DEV && <Debugger/>}
          <footer className="p-4 mt-auto border-t border-neutral-300">#FOOTER</footer>
        </div>
      </LocaleProvider>
    </ConfiguratorProvider>
  )
}
