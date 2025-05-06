'use client'

import { createContext, useContext, useEffect, useState } from 'react'

import { useConfig } from '@/contexts/config'

type Theme = 'light' | 'dark' | 'system'
type Scheme = 'light' | 'dark'
type Context = {
  theme: Theme
  setTheme: (value: Theme) => void
  scheme: Scheme
}

const ThemeContext = createContext<Context>(undefined as any)

export function ThemeProvider ({ children }: BasicProps) {
  const config = useConfig()

  const [theme, setTheme] = useState<Theme>(config.appearance === 'auto' ? 'system' : config.appearance)

  const [prefersDark, setPrefersDark] = useState<boolean>()

  // Media query is a pure client-side feature that doesn't make sense on server-side. Thus, it is
  // easier to manage the state by avoiding running the detection on server
  useEffect(() => onPrefersDark(setPrefersDark), [])

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


  useEffect(() => {
    // `prefersDark` being undefined means the client-side detection has not yet started
    if (typeof prefersDark === 'boolean') {
      document.documentElement.classList.toggle('dark', scheme === 'dark')
      document.documentElement.classList.remove('color-scheme-unset')
    }
  }, [prefersDark, scheme])

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

function onPrefersDark (handler: (prefersDark: boolean) => void) {
  const mql = matchMedia('(prefers-color-scheme: dark)')
  handler(mql.matches)
  mql.addEventListener('change', ev => handler(ev.matches))
}
