import { createContext, useContext, useEffect } from 'react'
import type { ReactNode } from 'react'
import { useMedia } from 'react-use'
import { useConfig } from '@/lib/config'

const ThemeContext = createContext<{ dark: boolean | null }>({ dark: true })

type Props = {
  children: ReactNode
}

export function ThemeProvider ({ children }: Props) {
  const { appearance } = useConfig()

  // `defaultState` should normally be a boolean. But it causes initial loading flashes in slow
  // rendering. Setting it to `null` so that we can differentiate the initial loading phase
  const prefersDark = useMedia('(prefers-color-scheme: dark)', null as any as boolean) as boolean | null
  const dark = appearance === 'dark' || (appearance === 'auto' && prefersDark)

  useEffect(() => {
    // Only decide color scheme after initial loading, i.e. when `dark` is really representing a
    // media query result
    if (typeof dark === 'boolean') {
      document.documentElement.classList.toggle('dark', dark)
      document.documentElement.classList.remove('color-scheme-unset')
    }
  }, [dark])

  return (
    <ThemeContext.Provider value={{ dark }}>
      {children}
    </ThemeContext.Provider>
  )
}

export default function useTheme () {
  return useContext(ThemeContext)
}
