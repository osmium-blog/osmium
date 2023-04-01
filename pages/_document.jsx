import { Head, Html, Main, NextScript } from 'next/document'
import cn from 'classnames'
import { config } from '@/lib/server/config'

export default function MyDocument () {
  const initialColorScheme = {
    auto: 'color-scheme-unset',
    dark: 'dark',
  }[config.appearance]

  return (
    <Html lang={config.lang} className={cn(initialColorScheme)}>
      <Head>
        <link rel="icon" href="/osmium.svg"/>
        <link rel="alternate" type="application/rss+xml" title="RSS 2.0" href="/-/feed"></link>
        {config.appearance === 'auto'
          ? (
            <>
              <meta name="theme-color" content={config.lightBackground} media="(prefers-color-scheme: light)"/>
              <meta name="theme-color" content={config.darkBackground} media="(prefers-color-scheme: dark)"/>
            </>
          )
          : (
            <meta name="theme-color" content={config.appearance === 'dark' ? config.darkBackground : config.lightBackground}/>
          )
        }
      </Head>
      <body className="bg-day dark:bg-night">
        <Main/>
        <NextScript/>
      </body>
    </Html>
  )
}
