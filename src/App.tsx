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

function RiskBadge({ level, pulse }: { level: RiskLevel; pulse?: boolean }) {
  const { colors } = useTheme()
  const colorMap: Record<RiskLevel, string> = colors.isDark
    ? { LOW: '#4C8C6B', MEDIUM: '#D98E3B', HIGH: '#B3492E' }
    : { LOW: '#15803D', MEDIUM: '#B45309', HIGH: '#DC2626' }
  const bgMap: Record<RiskLevel, string> = colors.isDark
    ? { LOW: 'rgba(76,140,107,0.12)', MEDIUM: 'rgba(217,142,59,0.15)', HIGH: 'rgba(179,73,46,0.15)' }
    : { LOW: 'rgba(21,128,61,0.12)', MEDIUM: 'rgba(180,83,9,0.12)', HIGH: 'rgba(220,38,38,0.12)' }

  return (
    <span
      className={pulse ? 'pulse-high' : undefined}
      style={{
        fontFamily: 'IBM Plex Mono, monospace',
        fontSize: '10px',
        fontWeight: 600,
        color: colorMap[level],
        background: bgMap[level],
        border: `1px solid ${colorMap[level]}44`,
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
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeNav, setActiveNav] = useState('Monitoring')
  const [toast, setToast] = useState<{ id: string; message: string; level: RiskLevel } | null>(null)
  
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

  const highCount = nodes.filter(n => n.risk === 'HIGH').length
  const activeAlertCount = alerts.filter(a => a.status === 'active').length

  const riskHighColor = colors.isDark ? '#B3492E' : '#DC2626'
  const riskMedColor = colors.isDark ? '#D98E3B' : '#B45309'
  const riskLowColor = colors.isDark ? '#4C8C6B' : '#15803D'

  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        background: colors.bgApp,
        color: colors.textPrimary,
        fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
      }}
    >
      {/* ── HEADER ── */}
      <header style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '52px',
        paddingLeft: '16px',
        paddingRight: '16px',
        background: colors.bgHeader,
        borderBottom: `1px solid ${colors.borderPrimary}`,
        boxShadow: colors.shadowSm,
        flexShrink: 0,
      }}>
        {/* Logo + Mine selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Hexagonal mine logo */}
          <svg width="32" height="32" viewBox="0 0 32 32">
            <polygon points="16,2 29,9 29,23 16,30 3,23 3,9" fill="none" stroke={colors.accent} strokeWidth="1.6" />
            <polygon points="16,8 24,12 24,20 16,24 8,20 8,12" fill={colors.accent} fillOpacity="0.14" />
            <circle cx="16" cy="16" r="3.5" fill={colors.accent} />
            <line x1="16" y1="2" x2="16" y2="8" stroke={colors.accent} strokeWidth="1.1" />
            <line x1="29" y1="9" x2="24" y2="12" stroke={colors.accent} strokeWidth="1.1" />
            <line x1="29" y1="23" x2="24" y2="20" stroke={colors.accent} strokeWidth="1.1" />
          </svg>
          <div>
            <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '15px', fontWeight: 700, color: colors.textPrimary, lineHeight: 1.1 }}>
              SubsideAI
            </p>
            <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '9px', color: colors.textMuted, lineHeight: 1 }}>
              Mine Subsidence Monitor
            </p>
          </div>

          <div style={{ width: '1px', height: '32px', background: colors.borderPrimary, margin: '0 4px' }} />

          {/* Mine / Panel dropdowns */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <select
              style={{
                background: colors.inputBg,
                border: `1px solid ${colors.inputBorder}`,
                color: colors.textSecondary,
                fontFamily: 'IBM Plex Mono, monospace',
                fontSize: '11px',
                padding: '4px 8px',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
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
                padding: '4px 8px',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              {PANELS.map(p => <option key={p} value={p}>{p}</option>)}
              <option value="All">All Panels</option>
            </select>
          </div>
        </div>

        {/* Right side: alert status + theme switcher + user */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {highCount > 0 && (
            <div
              className="pulse-high"
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '4px 10px', borderRadius: '4px',
                background: colors.isDark ? 'rgba(179,73,46,0.14)' : 'rgba(220,38,38,0.10)',
                border: `1px solid ${riskHighColor}44`,
              }}
            >
              <span style={{ color: riskHighColor, fontSize: '12px' }}>⚠</span>
              <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '11px', color: riskHighColor, fontWeight: 600 }}>
                {highCount} HIGH RISK
              </span>
            </div>
          )}
          {activeAlertCount > 0 && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '4px 10px', borderRadius: '4px',
              background: colors.isDark ? 'rgba(217,142,59,0.10)' : 'rgba(180,83,9,0.08)',
              border: `1px solid ${riskMedColor}44`,
            }}>
              <span style={{ color: riskMedColor, fontSize: '11px' }}>🔔</span>
              <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '11px', color: riskMedColor }}>
                {activeAlertCount} Alert{activeAlertCount !== 1 ? 's' : ''}
              </span>
            </div>
          )}

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              borderRadius: '5px',
              background: colors.bgCardSubtle,
              border: `1px solid ${colors.borderSubtle}`,
              color: colors.textPrimary,
              fontFamily: 'IBM Plex Mono, monospace',
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            title={`Current: ${theme === 'light' ? 'White (Light)' : 'Dark'} Theme. Click to switch.`}
          >
            <span>{theme === 'light' ? '☀ White Theme' : '🌙 Dark Theme'}</span>
          </button>

          {/* Avatar / Auth */}
          <div
            onClick={() => setLoginModalOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              padding: '4px 8px',
              borderRadius: '4px',
              border: `1px solid ${colors.borderSubtle}`,
              background: colors.bgCardSubtle,
            }}
            className="hover:opacity-90 transition-opacity"
            title={currentUser ? `Signed in as ${currentUser.email} (${currentUser.role}). Click to switch operator.` : 'Click to Sign In'}
          >
            <div style={{
              width: '28px', height: '28px', borderRadius: '50%',
              background: colors.accent, color: colors.isDark ? '#1A1714' : '#FFFFFF',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: "'Space Grotesk', sans-serif", fontSize: '11px', fontWeight: 700,
            }}>
              {currentUser ? currentUser.full_name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() : '??'}
            </div>
            <div>
              <p style={{ fontSize: '11px', fontWeight: 600, color: colors.textPrimary, lineHeight: 1.1 }}>
                {currentUser ? currentUser.full_name : 'Sign In'}
              </p>
              <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '9px', color: colors.textMuted }}>
                {currentUser ? `${currentUser.role} · Demo Mine` : 'Operator Login'}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* ── NAV BAR ── */}
      <nav style={{
        display: 'flex',
        alignItems: 'center',
        height: '38px',
        paddingLeft: '16px',
        paddingRight: '16px',
        background: colors.bgNav,
        borderBottom: `1px solid ${colors.borderDivider}`,
        boxShadow: colors.shadowSm,
        flexShrink: 0,
        gap: '2px',
      }}>
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
              padding: '0 14px',
              height: '100%',
              cursor: 'pointer',
              border: 'none',
              borderBottomStyle: 'solid',
              transition: 'color 0.15s, border-color 0.15s, background-color 0.15s',
            }}
          >
            {item}
          </button>
        ))}

        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{
            fontFamily: 'IBM Plex Mono, monospace',
            fontSize: '10px',
            color: connected ? riskLowColor : riskMedColor
          }}>
            {connected ? '⟳ LIVE' : '○ CONNECTING'} · {nodes.length} nodes · <LiveClock />
          </span>
          <button
            onClick={() => setSidebarOpen(p => !p)}
            style={{
              fontFamily: 'IBM Plex Mono, monospace', fontSize: '10px', color: colors.textMuted,
              border: `1px solid ${colors.borderSubtle}`, padding: '2px 8px', borderRadius: '3px',
              background: 'transparent', cursor: 'pointer',
            }}
            className="hover:opacity-80 transition-opacity"
          >
            {sidebarOpen ? '◀ Sidebar' : '▶ Sidebar'}
          </button>
        </div>
      </nav>

      {/* ── MAIN BODY ── */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* ── LEFT SIDEBAR — only on Monitoring page ── */}
        {sidebarOpen && activeNav === 'Monitoring' && (
          <aside style={{
            width: '260px',
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
            background: colors.bgSidebar,
            borderRight: `1px solid ${colors.borderPrimary}`,
            overflow: 'hidden',
          }}>
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
                      <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '13px', fontWeight: 600, color: s.color }}>
                        {s.value}
                      </p>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '6px', marginTop: '10px' }}>
                  {[['Export Report', colors.accent], ['Analytics', colors.textMuted]].map(([lbl, col]) => (
                    <button
                      key={lbl}
                      onClick={() => lbl === 'Export Report' && setActiveNav('Reports')}
                      style={{
                        flex: 1, fontFamily: 'IBM Plex Mono, monospace', fontSize: '10px',
                        color: col, background: colors.bgCardSubtle, border: `1px solid ${colors.borderSubtle}`,
                        padding: '4px 0', borderRadius: '3px', cursor: 'pointer',
                      }}
                    >
                      {lbl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sensor List */}
              <div style={{ background: colors.bgCard, border: `1px solid ${colors.borderPrimary}`, borderRadius: '6px', overflow: 'hidden', boxShadow: colors.shadowSm }}>
                <div style={{ padding: '8px 12px', borderBottom: `1px solid ${colors.borderPrimary}`, background: colors.bgCardSubtle }}>
                  <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '10px', fontWeight: 700, color: colors.accent, letterSpacing: '0.08em' }}>
                    SENSORS — ALL PANELS
                  </p>
                </div>
                <div>
                  {nodes.map(node => {
                    const isSel = selectedNode === node.id
                    const isHigh = node.risk === 'HIGH'
                    return (
                      <button
                        key={node.id}
                        onClick={() => { setSelectedNode(node.id); setActivePanel(node.panel) }}
                        style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          width: '100%', padding: '7px 12px',
                          background: isSel ? colors.accentBg : isHigh ? (colors.isDark ? 'rgba(179,73,46,0.05)' : 'rgba(220,38,38,0.04)') : 'transparent',
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
                            <p style={{
                              fontFamily: 'IBM Plex Mono, monospace', fontSize: '11px', fontWeight: 600,
                              color: isSel ? colors.accent : colors.textPrimary, lineHeight: 1.1,
                            }}>
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
                <div style={{ padding: '7px 12px', borderTop: `1px solid ${colors.borderPrimary}`, background: colors.bgCardSubtle }}>
                  <button style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '10px', color: colors.accent, fontWeight: 600 }}>
                    + Add Sensor
                  </button>
                </div>
              </div>

              {/* Alert Log */}
              <div style={{ background: colors.bgCard, border: `1px solid ${colors.borderPrimary}`, borderRadius: '6px', overflow: 'hidden', boxShadow: colors.shadowSm }}>
                <div style={{ padding: '8px 12px', borderBottom: `1px solid ${colors.borderPrimary}`, background: colors.bgCardSubtle }}>
                  <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '10px', fontWeight: 700, color: colors.accent, letterSpacing: '0.08em' }}>
                    ALERTS — LAST 24H
                  </p>
                </div>
                {alerts.map(alert => (
                  <div
                    key={alert.id}
                    style={{
                      padding: '8px 12px', borderBottom: `1px solid ${colors.borderDivider}`,
                      background: alert.status === 'active' && alert.level === 'HIGH' ? (colors.isDark ? 'rgba(179,73,46,0.05)' : 'rgba(220,38,38,0.05)') : 'transparent',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '3px' }}>
                      <span
                        style={{
                          fontFamily: 'IBM Plex Mono, monospace', fontSize: '10px', fontWeight: 700,
                          color: alert.level === 'HIGH' ? riskHighColor : alert.level === 'MEDIUM' ? riskMedColor : riskLowColor
                        }}
                        className={alert.status === 'active' && alert.level === 'HIGH' ? 'pulse-high' : undefined}
                      >
                        [{alert.level}]
                      </span>
                      <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '9px', color: colors.textMuted }}>{alert.timestamp}</span>
                    </div>
                    <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '10px', color: colors.textSecondary, marginBottom: '4px' }}>
                      {alert.panel} · N{(alert.nodeIds || []).join(', N')}
                    </p>
                    {alert.status === 'active' ? (
                      <div style={{ display: 'flex', gap: '4px' }}>
                        {[['Ack.', riskMedColor, () => handleAcknowledge(alert.id)], ['Snooze', colors.textMuted, () => {}]].map(([lbl, col, fn]) => (
                          <button
                            key={lbl as string}
                            onClick={fn as () => void}
                            style={{
                              fontFamily: 'IBM Plex Mono, monospace', fontSize: '9px',
                              color: col as string, border: `1px solid ${col}44`,
                              padding: '1px 6px', borderRadius: '3px', background: 'transparent', cursor: 'pointer',
                            }}
                          >
                            {lbl as string}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <span style={{
                        fontFamily: 'IBM Plex Mono, monospace', fontSize: '9px',
                        color: alert.status === 'resolved' ? riskLowColor : riskMedColor,
                      }}>
                        {alert.status === 'resolved' ? '✓ Resolved' : '◑ Acknowledged'}
                      </span>
                    )}
                  </div>
                ))}
                <div style={{ padding: '7px 12px', background: colors.bgCardSubtle }}>
                  <button style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '10px', color: colors.textMuted }}
                    className="hover:opacity-80 transition-opacity">
                    View More (30d) →
                  </button>
                </div>
              </div>

            </div>
          </aside>
        )}

        {/* ── MAIN CONTENT ── */}
        {activeNav === 'Monitoring' ? (
          <main style={{
            flex: 1,
            display: 'flex',
            overflow: 'hidden',
            gap: '8px',
            padding: '8px',
            minWidth: 0,
            background: colors.bgApp,
          }}>
            {/* LEFT COLUMN: GIS + Cross-section (65%) */}
            <div style={{
              flex: '0 0 65%',
              minWidth: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              overflow: 'hidden',
            }}>
              {/* GIS Map — hero */}
              <div style={{ flex: 1, minHeight: 0 }}>
                <GISMap
                  nodes={nodes}
                  selectedNode={selectedNode}
                  onSelectNode={setSelectedNode}
                  activePanel={activePanel}
                />
              </div>
              {/* Cross-section */}
              <div style={{ flexShrink: 0 }}>
                <CrossSection
                  nodes={nodes}
                  selectedNode={selectedNode}
                  activePanel={activePanel}
                />
              </div>
            </div>

            {/* RIGHT COLUMN: Readings + Risk (35%) */}
            <div style={{
              flex: '0 0 35%',
              minWidth: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              overflow: 'hidden',
            }}>
              {/* Live Readings Table (55%) */}
              <div style={{ flex: '0 0 55%', minHeight: 0, overflow: 'hidden' }}>
                <ReadingsTable
                  nodes={nodes}
                  selectedNode={selectedNode}
                  onSelectNode={setSelectedNode}
                  activePanel={activePanel}
                />
              </div>
              {/* Risk & AI Panel (45%) */}
              <div style={{ flex: '1 1 0', minHeight: 0, overflow: 'hidden' }}>
                <RiskPanel
                  nodes={nodes}
                  alerts={alerts}
                  onAcknowledge={handleAcknowledge}
                  activePanel={activePanel}
                />
              </div>
            </div>
          </main>
        ) : activeNav === 'Reports' ? (
          <ReportsPage nodes={nodes} alerts={alerts} activePanel={activePanel} />
        ) : activeNav === 'Settings' ? (
          <SettingsPage />
        ) : activeNav === 'Help' ? (
          <HelpPage />
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
