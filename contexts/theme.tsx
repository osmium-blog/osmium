'use client'

import { createContext, useContext, useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { useMedia } from 'react-use'
import { useConfig } from '@/contexts/config'

type Theme = 'light' | 'dark' | 'system'
type Scheme = 'light' | 'dark'
type Context = {
  theme: Theme
  setTheme: (value: Theme) => void
  scheme: Scheme
}

const ThemeContext = createContext<Context>(undefined as any)

type Props = {
  children: ReactNode
}

export function ThemeProvider ({ children }: Props) {
  const config = useConfig()

  const [theme, setTheme] = useState<Theme>(config.appearance === 'auto' ? 'system' : config.appearnce)

  const prefersDark = useMedia('(prefers-color-scheme: dark)', true)
  const [scheme, setScheme] = useState<Scheme>(theme === 'dark' || (theme === 'system' && prefersDark) ? 'dark' : 'light')

  useEffect(() => {
    switch (theme) {
      case 'system':
        setScheme(prefersDark ? 'dark' : 'light')
        break
      default:
        setScheme(theme)
    }
  }, [theme, prefersDark])


  const firstRender = useRef(true)
  useEffect(() => void (firstRender.current = false), [])
  useEffect(() => {
    // Only decide color scheme after initial load, i.e. when `dark` is really representing a media
    // query result
    if (!firstRender.current) {
      document.documentElement.classList.toggle('dark', scheme === 'dark')
      document.documentElement.classList.remove('color-scheme-unset')
    }
  }, [scheme])

  const data = {
    theme,
    setTheme,
    scheme,
  }

  return (
    <ThemeContext.Provider value={data}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme () {
  return useContext(ThemeContext)
}
