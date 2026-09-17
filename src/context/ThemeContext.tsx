import React, { createContext, useContext, useState, useEffect } from 'react'

export type Theme = 'light' | 'dark'

export interface ThemeColors {
  isDark: boolean
  bgApp: string
  bgHeader: string
  bgNav: string
  bgSidebar: string
  bgCard: string
  bgCardSubtle: string
  bgCardHover: string
  bgCanvas: string
  bgWell: string
  borderPrimary: string
  borderSubtle: string
  borderDivider: string
  textPrimary: string
  textSecondary: string
  textMuted: string
  accent: string
  accentBg: string
  accentBorder: string
  inputBg: string
  inputBorder: string
  inputText: string
  tableHeaderBg: string
  tableRowHover: string
  tableRowSelected: string
  tableBorder: string
  gridStroke: string
  roadStroke: string
  coordFill: string
  shadowSm: string
  shadowMd: string
  tooltipBg: string
  tooltipText: string
}

export const lightColors: ThemeColors = {
  isDark: false,
  bgApp: '#F8FAFC',
  bgHeader: '#FFFFFF',
  bgNav: '#FFFFFF',
  bgSidebar: '#FFFFFF',
  bgCard: '#FFFFFF',
  bgCardSubtle: '#F8FAFC',
  bgCardHover: '#F1F5F9',
  bgCanvas: '#FFFFFF',
  bgWell: '#F1F5F9',
  borderPrimary: '#E2E8F0',
  borderSubtle: '#CBD5E1',
  borderDivider: '#E2E8F0',
  textPrimary: '#0F172A',
  textSecondary: '#334155',
  textMuted: '#64748B',
  accent: '#B45309', // warm amber-gold, high contrast on white
  accentBg: 'rgba(180, 83, 9, 0.08)',
  accentBorder: 'rgba(180, 83, 9, 0.25)',
  inputBg: '#FFFFFF',
  inputBorder: '#CBD5E1',
  inputText: '#0F172A',
  tableHeaderBg: '#F8FAFC',
  tableRowHover: '#F1F5F9',
  tableRowSelected: 'rgba(180, 83, 9, 0.08)',
  tableBorder: '#E2E8F0',
  gridStroke: '#E2E8F0',
  roadStroke: '#CBD5E1',
  coordFill: '#64748B',
  shadowSm: '0 1px 3px 0 rgba(0, 0, 0, 0.06), 0 1px 2px -1px rgba(0, 0, 0, 0.06)',
  shadowMd: '0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
  tooltipBg: '#0F172A',
  tooltipText: '#F8FAFC',
}

export const darkColors: ThemeColors = {
  isDark: true,
  bgApp: '#1A1714',
  bgHeader: '#211E18',
  bgNav: '#1C1914',
  bgSidebar: '#1C1914',
  bgCard: '#24211C',
  bgCardSubtle: '#1A1714',
  bgCardHover: '#2A2520',
  bgCanvas: '#0A0907',
  bgWell: '#1A1714',
  borderPrimary: '#2A2520',
  borderSubtle: '#39332B',
  borderDivider: '#242018',
  textPrimary: '#EDE6DA',
  textSecondary: '#B8B0A4',
  textMuted: '#5A5248',
  accent: '#C9A66B',
  accentBg: 'rgba(201, 166, 107, 0.1)',
  accentBorder: 'rgba(201, 166, 107, 0.3)',
  inputBg: '#1A1714',
  inputBorder: '#39332B',
  inputText: '#EDE6DA',
  tableHeaderBg: '#1E1A16',
  tableRowHover: '#24211C',
  tableRowSelected: 'rgba(201, 166, 107, 0.07)',
  tableBorder: '#1E1A16',
  gridStroke: '#161310',
  roadStroke: '#161310',
  coordFill: '#27221C',
  shadowSm: 'none',
  shadowMd: 'none',
  tooltipBg: '#1A1714',
  tooltipText: '#EDE6DA',
}

interface ThemeContextType {
  theme: Theme
  colors: ThemeColors
  toggleTheme: () => void
  setTheme: (t: Theme) => void
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  colors: lightColors,
  toggleTheme: () => {},
  setTheme: () => {},
})

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem('subsideai_theme') as Theme | null
    // User explicitly requested white theme; default to 'light'
    return saved === 'dark' ? 'dark' : 'light'
  })

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
    localStorage.setItem('subsideai_theme', newTheme)
  }

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    if (theme === 'light') {
      document.body.classList.remove('dark-theme')
      document.body.classList.add('light-theme')
      document.body.style.background = '#F8FAFC'
      document.body.style.color = '#0F172A'
    } else {
      document.body.classList.remove('light-theme')
      document.body.classList.add('dark-theme')
      document.body.style.background = '#1A1714'
      document.body.style.color = '#EDE6DA'
    }
  }, [theme])

  const colors = theme === 'light' ? lightColors : darkColors

  return (
    <ThemeContext.Provider value={{ theme, colors, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
