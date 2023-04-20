import { Head, Html, Main, NextScript } from 'next/document'
import cn from 'classnames'

import { FONTS_SANS, FONTS_SERIF } from '@/consts'
import tailwindConfig from '@/tailwind.config'
import { config } from '@/lib/server/config'

const fontFamily = ['sans-serif', 'serif'].includes(config.font)
  ? { 'sans-serif': FONTS_SANS.join(','), 'serif': FONTS_SERIF.join(',') }[config.font]
  : config.font

export default function MyDocument () {
  const initialColorScheme = {
    auto: 'color-scheme-unset',
    dark: 'dark',
  }[config.appearance]

  return (
    <Html lang={config.lang} className={cn(initialColorScheme)}>
      <Head>
        <link rel="icon" href="/favicon.png"/>
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
        <style>
          {`
          .color-scheme-unset, .color-scheme-unset body {
            background-color: ${tailwindConfig.theme.extend.colors.day.DEFAULT} !important;
          }

          @media (prefers-color-scheme: dark) {
            .color-scheme-unset, .color-scheme-unset body {
              background-color: ${tailwindConfig.theme.extend.colors.night.DEFAULT} !important;
            }
          }

          .fouc {
            opacity: 0;
            transform: translateY(-40px);
          }

          .fouc-transition {
            transition-property: opacity transform;
            transition-duration: 500ms;
            transition-timing-function: cubic-bezier(0, 0, 0.2, 1);
          }
          `}
        </style>
      </Head>
      <body className="fouc fouc-transition bg-day dark:bg-night" style={{ fontFamily }}>
        <Main/>
        <NextScript/>
      </body>
    </Html>
  )
}
