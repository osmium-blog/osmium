import 'react-notion-x/src/styles.css'
import { useEffect } from 'react'
import App from 'next/app'
import '@/styles/globals.scss'
import '@/styles/notion.scss'
import loadLocale from '@/assets/i18n'
import { ConfigProvider } from '@/contexts/config'
import { LocaleProvider } from '@/contexts/locale'
import { SensorProvider } from '@/contexts/sensor'
import { ThemeProvider } from '@/contexts/theme'
import { DataProvider } from '@/contexts/data'
import { LayoutProvider } from '@/contexts/layout'
import Analytics from '@/components/analytics'

const PROD = process.env.NODE_ENV === 'production'

export default function MyApp ({ Component, pageProps, config, locale, data }) {
  useEffect(() => {
    document.body.classList.remove('fouc')
    document.body.addEventListener('transitionend', () => {
      document.body.classList.remove('fouc-transition')
    }, { once: true })
  }, [])

  return (
    <ConfigProvider value={config}>
      {PROD && <Analytics/>}
      <LocaleProvider value={locale}>
        <SensorProvider>
          <ThemeProvider>
            <DataProvider data={data}>
              <LayoutProvider>
                <Component {...pageProps}/>
              </LayoutProvider>
            </DataProvider>
          </ThemeProvider>
        </SensorProvider>
      </LocaleProvider>
    </ConfigProvider>
  )
}

MyApp.getInitialProps = async ctx => {
  const config = typeof window === 'object'
    ? await fetch('/api/config').then(res => res.json())
    : await import('@/lib/server/config').then(module => module.clientConfig)

  const locale = await loadLocale('basic', config.lang)

  const data = typeof window === 'object'
    ? await fetch('/api/data').then(res => res.json())
    : await import('@/pages/api/data').then(module => module.action())

  return {
    ...App.getInitialProps(ctx),
    config,
    locale,
    data,
  }
}
