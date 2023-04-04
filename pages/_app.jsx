import 'react-notion-x/src/styles.css'
import App from 'next/app'
import '@/styles/globals.scss'
import '@/styles/notion.scss'
import loadLocale from '@/assets/i18n'
import { ConfigProvider } from '@/lib/config'
import { LocaleProvider } from '@/lib/locale'
import { ThemeProvider } from '@/lib/theme'
import Analytics from '@/components/analytics'
import { useEffect } from 'react'

export default function MyApp ({ Component, pageProps, config, locale }) {
  useEffect(() => {
    document.body.classList.remove('fouc')
    document.body.addEventListener('transitionend', () => {
      document.body.classList.remove('fouc-transition')
    }, { once: true })
  }, [])

  return (
    <ConfigProvider value={config}>
      <LocaleProvider value={locale}>
        <ThemeProvider>
          {process.env.NODE_ENV === 'production' && <Analytics/>}
          <Component {...pageProps}/>
        </ThemeProvider>
      </LocaleProvider>
    </ConfigProvider>
  )
}

MyApp.getInitialProps = async ctx => {
  const config = typeof window === 'object'
    ? await fetch('/api/config').then(res => res.json())
    : await import('@/lib/server/config').then(module => module.clientConfig)

  const locale = await loadLocale('basic', config.lang)

  return {
    ...App.getInitialProps(ctx),
    config,
    locale,
  }
}
