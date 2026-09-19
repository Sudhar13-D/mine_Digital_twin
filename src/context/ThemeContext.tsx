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
  techCyan: string
  techCyanBg: string
  riskLow: string
  riskMedium: string
  riskHigh: string
  riskLowBg: string
  riskMediumBg: string
  riskHighBg: string
  riskLowBorder: string
  riskMediumBorder: string
  riskHighBorder: string
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
  bgCardSubtle: '#F1F5F9',
  bgCardHover: '#F8FAFC',
  bgCanvas: '#FFFFFF',
  bgWell: '#F1F5F9',
  borderPrimary: '#E2E8F0',
  borderSubtle: '#CBD5E1',
  borderDivider: '#E2E8F0',
  textPrimary: '#0F172A',
  textSecondary: '#334155',
  textMuted: '#64748B',
  accent: '#EA580C', // SensOra Safety Orange
  accentBg: 'rgba(234, 88, 12, 0.08)',
  accentBorder: 'rgba(234, 88, 12, 0.28)',
  techCyan: '#0284C7', // SensOra Sky/Cyan
  techCyanBg: 'rgba(2, 132, 199, 0.08)',
  riskLow: '#059669',
  riskMedium: '#D97706',
  riskHigh: '#DC2626',
  riskLowBg: 'rgba(5, 150, 105, 0.08)',
  riskMediumBg: 'rgba(217, 119, 6, 0.08)',
  riskHighBg: 'rgba(220, 38, 38, 0.08)',
  riskLowBorder: 'rgba(5, 150, 105, 0.25)',
  riskMediumBorder: 'rgba(217, 119, 6, 0.25)',
  riskHighBorder: 'rgba(220, 38, 38, 0.25)',
  inputBg: '#FFFFFF',
  inputBorder: '#CBD5E1',
  inputText: '#0F172A',
  tableHeaderBg: '#F1F5F9',
  tableRowHover: 'rgba(234, 88, 12, 0.03)',
  tableRowSelected: 'rgba(234, 88, 12, 0.09)',
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
  bgApp: '#0A0E1A',
  bgHeader: '#0F172A',
  bgNav: '#0F172A',
  bgSidebar: '#0F172A',
  bgCard: '#111827',
  bgCardSubtle: '#0F172A',
  bgCardHover: '#1E293B',
  bgCanvas: '#080C14',
  bgWell: '#0F172A',
  borderPrimary: '#1E293B',
  borderSubtle: '#334155',
  borderDivider: '#1E293B',
  textPrimary: '#F8FAFC',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',
  accent: '#F97316', // SensOra Vibrant Amber/Orange
  accentBg: 'rgba(249, 115, 22, 0.12)',
  accentBorder: 'rgba(249, 115, 22, 0.35)',
  techCyan: '#38BDF8', // SensOra Electric Cyan
  techCyanBg: 'rgba(56, 189, 248, 0.12)',
  riskLow: '#10B981',
  riskMedium: '#F59E0B',
  riskHigh: '#EF4444',
  riskLowBg: 'rgba(16, 185, 129, 0.12)',
  riskMediumBg: 'rgba(245, 158, 11, 0.14)',
  riskHighBg: 'rgba(239, 68, 68, 0.16)',
  riskLowBorder: 'rgba(16, 185, 129, 0.30)',
  riskMediumBorder: 'rgba(245, 158, 11, 0.30)',
  riskHighBorder: 'rgba(239, 68, 68, 0.35)',
  inputBg: '#0F172A',
  inputBorder: '#334155',
  inputText: '#F8FAFC',
  tableHeaderBg: '#0F172A',
  tableRowHover: '#1E293B',
  tableRowSelected: 'rgba(249, 115, 22, 0.14)',
  tableBorder: '#1E293B',
  gridStroke: '#1E293B',
  roadStroke: '#334155',
  coordFill: '#475569',
  shadowSm: '0 1px 3px 0 rgba(0, 0, 0, 0.4)',
  shadowMd: '0 4px 6px -1px rgba(0, 0, 0, 0.5)',
  tooltipBg: '#0F172A',
  tooltipText: '#F8FAFC',
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
      document.body.style.background = '#0A0E17'
      document.body.style.color = '#F1F5F9'
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
