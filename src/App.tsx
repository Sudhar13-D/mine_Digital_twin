import { useState, useEffect, useCallback } from 'react'
import type { SensorNode, Alert, RiskLevel } from './types'
import { PANELS } from './data'
import { useLiveMonitoring } from './api/useLiveMonitoring'
import { api, getAuthToken, setAuthToken } from './api/client'
import { useTheme } from './context/ThemeContext'
import LoginModal from './components/LoginModal'
import GISMap from './components/GISMap'
import CrossSection from './components/CrossSection'
import ReadingsTable from './components/ReadingsTable'
import RiskPanel from './components/RiskPanel'
import ReportsPage from './components/ReportsPage'
import SettingsPage from './components/SettingsPage'
import HelpPage from './components/HelpPage'
import SensoraHomepage from './components/SensoraHomepage'
import { SensoraLogo } from './components/icons'

function RiskBadge({ level, pulse }: { level: RiskLevel; pulse?: boolean }) {
  const { colors } = useTheme()
  const colorMap: Record<RiskLevel, string> = {
    LOW: colors.riskLow,
    MEDIUM: colors.riskMedium,
    HIGH: colors.riskHigh,
  }
  const bgMap: Record<RiskLevel, string> = {
    LOW: colors.riskLowBg,
    MEDIUM: colors.riskMediumBg,
    HIGH: colors.riskHighBg,
  }
  const borderMap: Record<RiskLevel, string> = {
    LOW: colors.riskLowBorder,
    MEDIUM: colors.riskMediumBorder,
    HIGH: colors.riskHighBorder,
  }

  return (
    <span
      className={pulse ? 'pulse-high' : undefined}
      style={{
        fontFamily: 'IBM Plex Mono, monospace',
        fontSize: '10px',
        fontWeight: 600,
        color: colorMap[level],
        background: bgMap[level],
        border: `1px solid ${borderMap[level]}`,
        padding: '1px 7px',
        borderRadius: '3px',
      }}
    >
      {level}
    </span>
  )
}

function LiveClock() {
  const [time, setTime] = useState(() => new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
  useEffect(() => {
    const t = setInterval(() => {
      setTime(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
    }, 1000)
    return () => clearInterval(t)
  }, [])
  return <span>{time}</span>
}

export default function App() {
  const { theme, colors, toggleTheme } = useTheme()
  const {
    nodes,
    alerts,
    connected,
    incomingToast,
    clearToast,
    acknowledgeAlert,
  } = useLiveMonitoring()

  const [selectedNode, setSelectedNode] = useState<number | null>(1)
  const [activePanel, setActivePanel] = useState('Panel 1')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeNav, setActiveNav] = useState('Monitoring')
  const [toast, setToast] = useState<{ id: string; message: string; level: RiskLevel } | null>(null)
  const [mobileTab, setMobileTab] = useState<'map' | 'table' | 'risk' | 'all'>('map')
  
  // Auth state
  const [currentUser, setCurrentUser] = useState<{ full_name: string; role: string; email: string } | null>({
    full_name: 'Mine Manager',
    role: 'Admin',
    email: 'manager@subside.ai',
  })
  const [loginModalOpen, setLoginModalOpen] = useState(false)

  // Verify auth on mount
  useEffect(() => {
    if (getAuthToken()) {
      api.getMe()
        .then(u => setCurrentUser(u))
        .catch(() => {})
    }
  }, [])

  // Sync incoming live toast
  useEffect(() => {
    if (incomingToast) {
      setToast(incomingToast)
    }
  }, [incomingToast])

  // Show initial high-alert toast if any active alert
  useEffect(() => {
    const a = alerts.find(x => x.level === 'HIGH' && x.status === 'active')
    if (a && !toast) {
      const nodeStr = a.nodeIds && a.nodeIds.length > 0 ? `Nodes ${a.nodeIds.map(i => `N${i}`).join(', ')}` : a.panel
      setToast({
        id: a.id,
        message: `⚠ HIGH RISK — ${a.panel}, ${nodeStr} · ${(a.message || '').slice(0, 70)}...`,
        level: 'HIGH'
      })
    }
  }, [alerts])

  const handleAcknowledge = useCallback((alertId: string) => {
    acknowledgeAlert(alertId)
    if (toast?.id === alertId) {
      setToast(null)
      clearToast()
    }
  }, [toast, acknowledgeAlert, clearToast])

  const [currentRoute, setCurrentRoute] = useState<'home' | 'dashboard'>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase()
      const hash = window.location.hash.toLowerCase()
      if (path === '/dashboard' || hash.includes('dashboard')) {
        return 'dashboard'
      }
    }
    return 'home'
  })

  // Sync route on browser back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.toLowerCase()
      const hash = window.location.hash.toLowerCase()
      if (path === '/dashboard' || hash.includes('dashboard')) {
        setCurrentRoute('dashboard')
      } else {
        setCurrentRoute('home')
      }
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const highCount = nodes.filter(n => n.risk === 'HIGH').length
  const activeAlertCount = alerts.filter(a => a.status === 'active').length

  const riskHighColor = colors.riskHigh
  const riskMedColor = colors.riskMedium
  const riskLowColor = colors.riskLow

  // Render SENSORA Homepage if on 'home' route
  if (currentRoute === 'home') {
    return (
      <SensoraHomepage
        onNavigateToDashboard={() => {
          setCurrentRoute('dashboard')
          try {
            window.history.pushState({}, '', '/dashboard')
          } catch {}
        }}
      />
    )
  }

  return (
    <div
      className="dashboard-root flex flex-col w-full min-h-[100dvh]"
      style={{
        background: colors.bgApp,
        color: colors.textPrimary,
        fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
      }}
    >
      {/* ── HEADER (Mobile & Desktop Adaptive) ── */}
      <header
        style={{
          background: colors.bgHeader,
          borderBottom: `1px solid ${colors.borderPrimary}`,
          boxShadow: colors.shadowSm,
          flexShrink: 0,
        }}
        className="px-3 sm:px-4 py-2"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          {/* Left: Home Button + Logo + Mine Title */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => {
                setCurrentRoute('home')
                try {
                  window.history.pushState({}, '', '/')
                } catch {}
              }}
              style={{
                background: colors.bgCardSubtle,
                border: `1px solid ${colors.borderPrimary}`,
                color: colors.accent,
                fontFamily: 'IBM Plex Mono, monospace',
                fontSize: '11px',
                fontWeight: 600,
              }}
              className="flex items-center gap-1 px-2.5 py-1 rounded-md hover:opacity-90 transition-all cursor-pointer shadow-sm"
              title="Return to SensOra Homepage"
            >
              ← Home
            </button>

            <SensoraLogo size={28} />
            <div>
              <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '15px', fontWeight: 700, color: colors.textPrimary, lineHeight: 1.1 }}>
                SensOra
              </p>
              <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '9px', color: colors.textMuted, lineHeight: 1 }}>
                Team RTECH 007 · SIH 2026
              </p>
            </div>
          </div>

          {/* Right: Dropdowns, High Alerts, Theme, and Avatar */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Panel & Coalfield selectors */}
            <div className="flex items-center gap-1.5">
              <select
                style={{
                  background: colors.inputBg,
                  border: `1px solid ${colors.inputBorder}`,
                  color: colors.textSecondary,
                  fontFamily: 'IBM Plex Mono, monospace',
                  fontSize: '11px',
                  padding: '3px 6px',
                  borderRadius: '4px',
                }}
                className="cursor-pointer"
              >
                <option>Demo Coalfield</option>
                <option>Jharia Coalfield</option>
              </select>
              <select
                value={activePanel}
                onChange={e => setActivePanel(e.target.value)}
                style={{
                  background: colors.inputBg,
                  border: `1px solid ${colors.accentBorder}`,
                  color: colors.accent,
                  fontFamily: 'IBM Plex Mono, monospace',
                  fontSize: '11px',
                  fontWeight: 600,
                  padding: '3px 6px',
                  borderRadius: '4px',
                }}
                className="cursor-pointer"
              >
                {PANELS.map(p => <option key={p} value={p}>{p}</option>)}
                <option value="All">All Panels</option>
              </select>
            </div>

            {/* High Alert Pill */}
            {highCount > 0 && (
              <div
                className="pulse-high flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold"
                style={{
                  background: colors.isDark ? 'rgba(239,68,68,0.2)' : 'rgba(239,68,68,0.12)',
                  border: `1px solid ${riskHighColor}66`,
                  color: riskHighColor,
                }}
              >
                <span>⚠ {highCount} HIGH</span>
              </div>
            )}

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              style={{
                background: colors.bgCardSubtle,
                border: `1px solid ${colors.borderSubtle}`,
                color: colors.textPrimary,
                fontFamily: 'IBM Plex Mono, monospace',
                fontSize: '11px',
                fontWeight: 600,
              }}
              className="flex items-center gap-1 px-2.5 py-1 rounded-md cursor-pointer hover:opacity-85 transition-all text-xs"
              title="Toggle Theme"
            >
              <span>{theme === 'light' ? '☀ Light' : '🌙 Dark'}</span>
            </button>

            {/* Avatar */}
            <div
              onClick={() => setLoginModalOpen(true)}
              style={{
                border: `1px solid ${colors.borderSubtle}`,
                background: colors.bgCardSubtle,
              }}
              className="flex items-center gap-1.5 px-2 py-1 rounded-md cursor-pointer hover:opacity-90 transition-opacity"
              title={currentUser ? `Signed in as ${currentUser.email}` : 'Sign In'}
            >
              <div
                style={{
                  width: '24px', height: '24px', borderRadius: '50%',
                  background: colors.accent, color: '#FFFFFF',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: "'Space Grotesk', sans-serif", fontSize: '10px', fontWeight: 700,
                }}
              >
                {currentUser ? currentUser.full_name.slice(0, 2).toUpperCase() : 'MM'}
              </div>
              <span className="hidden sm:inline text-[11px] font-semibold" style={{ color: colors.textPrimary }}>
                {currentUser ? currentUser.full_name.split(' ')[0] : 'Admin'}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* ── NAV BAR ── */}
      <nav
        style={{
          background: colors.bgNav,
          borderBottom: `1px solid ${colors.borderDivider}`,
          boxShadow: colors.shadowSm,
          flexShrink: 0,
        }}
        className="flex items-center justify-between h-[40px] px-3 sm:px-4 overflow-x-auto"
      >
        <div className="flex items-center gap-1 sm:gap-2 h-full shrink-0">
          {(['Monitoring', 'Reports', 'Settings', 'Help'] as const).map(item => (
            <button
              key={item}
              onClick={() => setActiveNav(item)}
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '12px',
                fontWeight: 600,
                color: activeNav === item ? colors.accent : colors.textMuted,
                background: activeNav === item ? colors.accentBg : 'transparent',
                borderBottom: activeNav === item ? `2px solid ${colors.accent}` : '2px solid transparent',
                padding: '0 12px',
                height: '100%',
                cursor: 'pointer',
              }}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span
            style={{
              fontFamily: 'IBM Plex Mono, monospace',
              fontSize: '10px',
              color: connected ? riskLowColor : riskMedColor,
            }}
            className="hidden sm:inline"
          >
            {connected ? '⟳ LIVE' : '○ OFFLINE'} · {nodes.length} nodes · <LiveClock />
          </span>
          <button
            onClick={() => setSidebarOpen(p => !p)}
            style={{
              fontFamily: 'IBM Plex Mono, monospace',
              fontSize: '10px',
              color: colors.accent,
              border: `1px solid ${colors.accentBorder}`,
              background: colors.accentBg,
              padding: '2px 8px',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
            className="hover:opacity-80 transition-opacity flex items-center gap-1 font-semibold"
          >
            <span>{sidebarOpen ? '✕ Hide Stats' : '☰ Stats / Alerts'}</span>
          </button>
        </div>
      </nav>

      {/* ── MAIN BODY ── */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* ── DESKTOP LEFT SIDEBAR ── */}
        {sidebarOpen && (
          <aside
            style={{
              width: '260px',
              flexShrink: 0,
              background: colors.bgSidebar,
              borderRight: `1px solid ${colors.borderPrimary}`,
            }}
            className="hidden lg:flex flex-col overflow-hidden"
          >
            <div style={{ flex: 1, overflowY: 'auto', padding: '10px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {/* Quick Stats */}
              <div style={{ background: colors.bgCard, border: `1px solid ${colors.borderPrimary}`, borderRadius: '6px', padding: '10px 12px', boxShadow: colors.shadowSm }}>
                <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '10px', fontWeight: 700, color: colors.accent, letterSpacing: '0.08em', marginBottom: '8px' }}>
                  OVERALL STATUS
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  {[
                    { label: 'Active Nodes', value: `${nodes.filter(n => n.status === 'online').length} / ${nodes.length || 8}`, color: riskLowColor },
                    { label: 'HIGH Alerts', value: String(highCount), color: riskHighColor },
                    { label: 'MEDIUM Alerts', value: String(alerts.filter(a => a.level === 'MEDIUM').length), color: riskMedColor },
                    { label: 'Last Alert', value: alerts[0]?.timestamp || '14:23', color: colors.textPrimary },
                    { label: 'Avg Tilt', value: `${(nodes.length ? nodes.reduce((s, n) => s + Math.abs(n.tilt || 0), 0) / nodes.length : 0).toFixed(1)}°`, color: colors.textPrimary },
                    { label: 'Max Risk Score', value: `${Math.max(...nodes.map(n => Math.abs(n.tilt || 0)), 0).toFixed(2)}°`, color: riskHighColor },
                  ].map(s => (
                    <div key={s.label}>
                      <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '9px', color: colors.textMuted }}>{s.label}</p>
                      <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '12px', fontWeight: 600, color: s.color }}>{s.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sensor list */}
              <div style={{ background: colors.bgCard, border: `1px solid ${colors.borderPrimary}`, borderRadius: '6px', overflow: 'hidden', boxShadow: colors.shadowSm }}>
                <div style={{ padding: '8px 12px', borderBottom: `1px solid ${colors.borderPrimary}`, background: colors.bgCardSubtle }}>
                  <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '10px', fontWeight: 700, color: colors.accent, letterSpacing: '0.08em' }}>
                    SENSORS — ALL PANELS
                  </p>
                </div>
                <div style={{ maxHeight: '180px', overflowY: 'auto' }}>
                  {nodes.map(node => {
                    const isSel = selectedNode === node.id
                    const isHigh = node.risk === 'HIGH'
                    return (
                      <button
                        key={node.id}
                        onClick={() => setSelectedNode(node.id)}
                        style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          width: '100%', padding: '7px 12px',
                          background: isSel ? colors.accentBg : isHigh ? (colors.isDark ? 'rgba(239,68,68,0.06)' : 'rgba(239,68,68,0.04)') : 'transparent',
                          borderLeft: isSel ? `3px solid ${colors.accent}` : isHigh ? `3px solid ${riskHighColor}` : '3px solid transparent',
                          borderBottom: `1px solid ${colors.borderDivider}`,
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'background 0.12s',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '11px', color: node.status === 'online' ? riskLowColor : riskHighColor }}>
                            {node.status === 'online' ? '✓' : '✗'}
                          </span>
                          <div>
                            <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '11px', fontWeight: 600, color: isSel ? colors.accent : colors.textPrimary, lineHeight: 1.1 }}>
                              {node.label}
                            </p>
                            <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '9px', color: colors.textMuted }}>{node.panel}</p>
                          </div>
                        </div>
                        <RiskBadge level={node.risk} pulse={isHigh} />
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Alert Log */}
              <div style={{ background: colors.bgCard, border: `1px solid ${colors.borderPrimary}`, borderRadius: '6px', overflow: 'hidden', boxShadow: colors.shadowSm }}>
                <div style={{ padding: '8px 12px', borderBottom: `1px solid ${colors.borderPrimary}`, background: colors.bgCardSubtle }}>
                  <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '10px', fontWeight: 700, color: colors.accent, letterSpacing: '0.08em' }}>
                    ALERTS — LAST 24H
                  </p>
                </div>
                {alerts.slice(0, 5).map(alert => (
                  <div
                    key={alert.id}
                    style={{
                      padding: '8px 12px', borderBottom: `1px solid ${colors.borderDivider}`,
                      background: alert.status === 'active' && alert.level === 'HIGH' ? (colors.isDark ? 'rgba(239,68,68,0.06)' : 'rgba(239,68,68,0.05)') : 'transparent',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '3px' }}>
                      <span
                        style={{
                          fontFamily: 'IBM Plex Mono, monospace', fontSize: '10px', fontWeight: 700,
                          color: alert.level === 'HIGH' ? riskHighColor : alert.level === 'MEDIUM' ? riskMedColor : riskLowColor
                        }}
                      >
                        [{alert.level}]
                      </span>
                      <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '9px', color: colors.textMuted }}>{alert.timestamp}</span>
                    </div>
                    <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '10px', color: colors.textSecondary, marginBottom: '4px' }}>
                      {alert.panel} · N{(alert.nodeIds || []).join(', N')}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        )}

        {/* ── MOBILE SLIDE-OVER DRAWER FOR SIDEBAR ── */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex justify-start bg-black/60 backdrop-blur-sm">
            <div
              style={{
                width: '85vw',
                maxWidth: '320px',
                background: colors.bgSidebar,
                borderRight: `1px solid ${colors.borderPrimary}`,
              }}
              className="h-full flex flex-col p-4 overflow-y-auto shadow-2xl animate-in slide-in-from-left duration-200"
            >
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200 dark:border-slate-800">
                <span className="font-bold text-sm font-mono" style={{ color: colors.accent }}>Mine Overview & Alerts</span>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="px-2 py-1 rounded text-xs font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                >
                  ✕ Close
                </button>
              </div>

              {/* Quick Stats in Drawer */}
              <div style={{ background: colors.bgCard, border: `1px solid ${colors.borderPrimary}`, borderRadius: '8px', padding: '10px 12px', marginBottom: '12px' }}>
                <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '10px', fontWeight: 700, color: colors.accent, letterSpacing: '0.08em', marginBottom: '8px' }}>
                  OVERALL STATUS
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Active Nodes</span>
                    <span className="font-bold" style={{ color: riskLowColor }}>{nodes.filter(n => n.status === 'online').length} / {nodes.length || 8}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">HIGH Alerts</span>
                    <span className="font-bold" style={{ color: riskHighColor }}>{highCount}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Avg Tilt</span>
                    <span className="font-bold" style={{ color: colors.textPrimary }}>
                      {(nodes.length ? nodes.reduce((s, n) => s + Math.abs(n.tilt || 0), 0) / nodes.length : 0).toFixed(1)}°
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Max Tilt</span>
                    <span className="font-bold" style={{ color: riskHighColor }}>
                      {Math.max(...nodes.map(n => Math.abs(n.tilt || 0)), 0).toFixed(2)}°
                    </span>
                  </div>
                </div>
              </div>

              {/* Alert Log in Drawer */}
              <div style={{ background: colors.bgCard, border: `1px solid ${colors.borderPrimary}`, borderRadius: '8px', overflow: 'hidden' }}>
                <div style={{ padding: '8px 12px', borderBottom: `1px solid ${colors.borderPrimary}`, background: colors.bgCardSubtle }}>
                  <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '10px', fontWeight: 700, color: colors.accent, letterSpacing: '0.08em' }}>
                    ALERTS — LAST 24H
                  </p>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {alerts.map(alert => (
                    <div key={alert.id} className="p-2.5 text-xs font-mono">
                      <div className="flex items-center justify-between mb-1">
                        <span style={{ color: alert.level === 'HIGH' ? riskHighColor : alert.level === 'MEDIUM' ? riskMedColor : riskLowColor, fontWeight: 700 }}>
                          [{alert.level}]
                        </span>
                        <span className="text-[10px] text-slate-400">{alert.timestamp}</span>
                      </div>
                      <p className="text-[11px]" style={{ color: colors.textSecondary }}>
                        {alert.panel} · N{(alert.nodeIds || []).join(', N')}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── MAIN CONTENT ── */}
        {activeNav === 'Monitoring' ? (
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden" style={{ background: colors.bgApp }}>

            {/* ── MOBILE SEGMENTED VIEW SWITCHER (Appears on screens < 1024px) ── */}
            <div
              className="lg:hidden px-3 py-2 border-b flex items-center gap-1.5 overflow-x-auto shrink-0"
              style={{
                background: colors.bgCardSubtle,
                borderColor: colors.borderPrimary,
              }}
            >
              {[
                { id: 'map', label: '🗺 Map & Strata' },
                { id: 'table', label: `📊 Readings (${nodes.filter(n => activePanel === 'All' || n.panel === activePanel).length})` },
                { id: 'risk', label: highCount > 0 ? `🧠 AI Risk (⚠ ${highCount})` : '🧠 AI & Risk' },
                { id: 'all', label: '📜 Full View' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setMobileTab(tab.id as any)}
                  style={{
                    fontFamily: 'IBM Plex Mono, monospace',
                    fontSize: '11px',
                    fontWeight: mobileTab === tab.id ? 700 : 500,
                    background: mobileTab === tab.id ? colors.accent : 'transparent',
                    color: mobileTab === tab.id ? '#FFFFFF' : colors.textSecondary,
                    border: mobileTab === tab.id ? `1px solid ${colors.accent}` : `1px solid ${colors.borderSubtle}`,
                  }}
                  className="px-2.5 py-1.5 rounded-lg whitespace-nowrap transition-all shadow-xs cursor-pointer"
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* ── DESKTOP SPLIT VIEW (Screens >= 1024px) ── */}
            <main
              style={{
                flex: 1,
                gap: '8px',
                padding: '8px',
                minWidth: 0,
                background: colors.bgApp,
              }}
              className="hidden lg:flex overflow-hidden"
            >
              {/* LEFT COLUMN: GIS + Cross-section (65%) */}
              <div style={{ flex: '0 0 65%', minWidth: 0, display: 'flex', flexDirection: 'column', gap: '8px', overflow: 'hidden' }}>
                <div style={{ flex: 1, minHeight: 0 }}>
                  <GISMap nodes={nodes} selectedNode={selectedNode} onSelectNode={setSelectedNode} activePanel={activePanel} />
                </div>
                <div style={{ flexShrink: 0 }}>
                  <CrossSection nodes={nodes} selectedNode={selectedNode} activePanel={activePanel} />
                </div>
              </div>

              {/* RIGHT COLUMN: Readings + Risk (35%) */}
              <div style={{ flex: '0 0 35%', minWidth: 0, display: 'flex', flexDirection: 'column', gap: '8px', overflow: 'hidden' }}>
                <div style={{ flex: '0 0 55%', minHeight: 0, overflow: 'hidden' }}>
                  <ReadingsTable nodes={nodes} selectedNode={selectedNode} onSelectNode={setSelectedNode} activePanel={activePanel} />
                </div>
                <div style={{ flex: '1 1 0', minHeight: 0, overflow: 'hidden' }}>
                  <RiskPanel nodes={nodes} alerts={alerts} onAcknowledge={handleAcknowledge} activePanel={activePanel} />
                </div>
              </div>
            </main>

            {/* ── MOBILE ADAPTIVE VIEW (Screens < 1024px) ── */}
            <div className="lg:hidden flex-1 overflow-y-auto p-3 space-y-3 pb-24">
              {(mobileTab === 'map' || mobileTab === 'all') && (
                <div className="space-y-3">
                  <div
                    className="rounded-xl overflow-hidden shadow-sm"
                    style={{
                      height: '340px',
                      background: colors.bgCanvas,
                      border: `1px solid ${colors.borderPrimary}`,
                    }}
                  >
                    <GISMap nodes={nodes} selectedNode={selectedNode} onSelectNode={setSelectedNode} activePanel={activePanel} />
                  </div>
                  <div
                    className="rounded-xl overflow-hidden shadow-sm"
                    style={{
                      minHeight: '210px',
                      background: colors.bgCanvas,
                      border: `1px solid ${colors.borderPrimary}`,
                    }}
                  >
                    <CrossSection nodes={nodes} selectedNode={selectedNode} activePanel={activePanel} />
                  </div>
                </div>
              )}

              {(mobileTab === 'table' || mobileTab === 'all') && (
                <div
                  className="rounded-xl overflow-hidden shadow-sm"
                  style={{
                    minHeight: '460px',
                    background: colors.bgCanvas,
                    border: `1px solid ${colors.borderPrimary}`,
                  }}
                >
                  <ReadingsTable nodes={nodes} selectedNode={selectedNode} onSelectNode={setSelectedNode} activePanel={activePanel} />
                </div>
              )}

              {(mobileTab === 'risk' || mobileTab === 'all') && (
                <div
                  className="rounded-xl overflow-hidden shadow-sm"
                  style={{
                    minHeight: '400px',
                    background: colors.bgCanvas,
                    border: `1px solid ${colors.borderPrimary}`,
                  }}
                >
                  <RiskPanel nodes={nodes} alerts={alerts} onAcknowledge={handleAcknowledge} activePanel={activePanel} />
                </div>
              )}
            </div>
          </div>
        ) : activeNav === 'Reports' ? (
          <div className="flex-1 overflow-y-auto">
            <ReportsPage nodes={nodes} alerts={alerts} activePanel={activePanel} />
          </div>
        ) : activeNav === 'Settings' ? (
          <div className="flex-1 overflow-y-auto">
            <SettingsPage />
          </div>
        ) : activeNav === 'Help' ? (
          <div className="flex-1 overflow-y-auto">
            <HelpPage />
          </div>
        ) : null}
      </div>

      {/* ── TOAST NOTIFICATION ── */}
      {toast && (
        <div
          className="slide-up"
          style={{
            position: 'fixed',
            bottom: '16px',
            right: '16px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px',
            padding: '12px 14px',
            borderRadius: '6px',
            background: colors.bgHeader,
            border: `1px solid ${riskHighColor}66`,
            boxShadow: colors.shadowMd,
            maxWidth: '420px',
            zIndex: 50,
          }}
        >
          <span style={{ fontSize: '14px', color: riskHighColor, flexShrink: 0, marginTop: '1px' }} className="pulse-high">⚠</span>
          <div style={{ flex: 1 }}>
            <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '11px', color: colors.textPrimary, marginBottom: '6px' }}>
              {toast.message}
            </p>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                onClick={() => handleAcknowledge(toast.id)}
                style={{
                  fontFamily: 'IBM Plex Mono, monospace', fontSize: '10px',
                  color: riskMedColor, border: `1px solid ${riskMedColor}55`,
                  padding: '2px 10px', borderRadius: '3px',
                  background: colors.accentBg, cursor: 'pointer',
                }}
              >
                Acknowledge
              </button>
              <button
                onClick={() => setSelectedNode(5)}
                style={{
                  fontFamily: 'IBM Plex Mono, monospace', fontSize: '10px',
                  color: colors.textSecondary, border: `1px solid ${colors.borderSubtle}`,
                  padding: '2px 10px', borderRadius: '3px',
                  background: 'transparent', cursor: 'pointer',
                }}
              >
                View Node 5
              </button>
            </div>
          </div>
          <button
            onClick={() => setToast(null)}
            style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '13px', color: colors.textMuted, lineHeight: 1, cursor: 'pointer', background: 'none', border: 'none', flexShrink: 0 }}
            className="hover:opacity-80 transition-opacity"
          >
            ✕
          </button>
        </div>
      )}

      {/* ── LOGIN MODAL ── */}
      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onSuccess={(u) => {
          setCurrentUser(u)
          setLoginModalOpen(false)
        }}
      />
    </div>
  )
}
