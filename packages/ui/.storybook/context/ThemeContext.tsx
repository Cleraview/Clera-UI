import React, { createContext, useContext, useState, useEffect } from 'react'

export const THEME_STORAGE_KEY = 'theme'

export type Theme = 'light' | 'dark' | 'system'

export const getInitialTheme = (): Theme => {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY)
      return stored as Theme
    } catch (e) {
      return 'light'
    }
  }
  return 'light'
}

type ThemeContextType = {
  theme: Theme
  handleSetTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  handleSetTheme: () => {},
})

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(getInitialTheme())

  useEffect(() => {
    const htmlElement = document.documentElement

    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme)
    } catch (e) {
    }

    if (theme === 'dark') {
      htmlElement.setAttribute('data-theme', 'dark')
    } else {
      htmlElement.removeAttribute('data-theme')
    }
  }, [theme])

  const handleSetTheme = (value: Theme) => {
    setTheme(value)
  }

  return (
    <ThemeContext.Provider value={{ theme, handleSetTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = (): ThemeContextType => useContext(ThemeContext)