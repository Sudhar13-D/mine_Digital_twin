import { useState } from 'react'
import { api } from '../api/client'
import { useTheme } from '../context/ThemeContext'

const SECTIONS = ['Alert Thresholds', 'Sensor Configuration', 'Notifications', 'User Preferences', 'Integrations', 'User Management']

interface ThresholdRowProps {
  label: string
  unit: string
  low: number
  medium: number
  high: number
  onChange?: () => void
}

function ThresholdRow({ label, unit, low, medium, high }: ThresholdRowProps) {
  const { colors } = useTheme()
  const [vals, setVals] = useState({ low, medium, high })

  const RISK_COLOR: Record<string, string> = {
    low: colors.riskLow,
    medium: colors.riskMedium,
    high: colors.riskHigh,
  }

  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-[140px_1fr_1fr_1fr] items-center gap-2 sm:gap-2.5 py-2.5"
      style={{ borderBottom: `1px solid ${colors.borderPrimary}` }}
    >
      <div>
        <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '11px', fontWeight: 600, color: colors.textPrimary }}>{label}</p>
        <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '9px', color: colors.textMuted }}>{unit}</p>
      </div>
      {(['low', 'medium', 'high'] as const).map((level) => (
        <div key={level}>
          <label style={{
            fontFamily: 'IBM Plex Mono, monospace', fontSize: '9px', fontWeight: 600,
            color: RISK_COLOR[level], display: 'block', marginBottom: '4px',
          }}>
            {level.toUpperCase()} THRESHOLD
          </label>
          <input
            type="number"
            value={vals[level]}
            onChange={e => setVals(p => ({ ...p, [level]: +e.target.value }))}
            style={{
              background: colors.inputBg,
              border: `1px solid ${colors.inputBorder}`,
              color: colors.inputText,
              fontFamily: 'IBM Plex Mono, monospace',
              fontSize: '12px',
              padding: '6px 10px',
              borderRadius: '4px',
              width: '100%',
              outline: 'none',
              borderColor: `${RISK_COLOR[level]}66`,
            }}
          />
        </div>
      ))}
    </div>
  )
}

function Toggle({ label, sub, defaultOn = false }: { label: string; sub?: string; defaultOn?: boolean }) {
  const { colors } = useTheme()
  const [on, setOn] = useState(defaultOn)

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '10px 0', borderBottom: `1px solid ${colors.borderPrimary}`,
    }}>
      <div>
        <p style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '12px', fontWeight: 600, color: colors.textPrimary }}>{label}</p>
        {sub && <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '9px', color: colors.textMuted, marginTop: '2px' }}>{sub}</p>}
      </div>
      <button
        onClick={() => setOn(p => !p)}
        style={{
          width: '40px', height: '22px', borderRadius: '11px',
          background: on ? colors.accent : (colors.isDark ? '#39332B' : '#CBD5E1'),
          border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 0.2s', flexShrink: 0,
        }}
      >
        <span style={{
          display: 'block', width: '16px', height: '16px', borderRadius: '50%',
          background: '#FFFFFF',
          position: 'absolute', top: '3px',
          left: on ? '21px' : '3px', transition: 'left 0.2s',
          boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
        }} />
      </button>
    </div>
  )
}

function IntegrationCard({ name, icon, connected, desc }: { name: string; icon: string; connected: boolean; desc: string }) {
  const { colors } = useTheme()
  const [conn, setConn] = useState(connected)
  const statusColor = conn ? (colors.isDark ? '#4C8C6B' : '#15803D') : colors.textMuted

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '12px', borderRadius: '6px',
      background: colors.bgCard,
      border: `1px solid ${conn ? colors.accentBorder : colors.borderPrimary}`,
      boxShadow: colors.shadowSm,
      marginBottom: '8px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '20px' }}>{icon}</span>
        <div>
          <p style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '12px', color: colors.textPrimary, fontWeight: 600 }}>{name}</p>
          <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '9px', color: colors.textMuted, marginTop: '2px' }}>{desc}</p>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '10px', fontWeight: 600, color: statusColor }}>
          {conn ? '● Connected' : '○ Not connected'}
        </span>
        <button
          onClick={() => setConn(p => !p)}
          style={{
            fontFamily: 'IBM Plex Mono, monospace', fontSize: '10px', fontWeight: 600,
            color: conn ? (colors.isDark ? '#B3492E' : '#DC2626') : colors.accent,
            border: `1px solid ${conn ? 'rgba(220,38,38,0.3)' : colors.accentBorder}`,
            padding: '4px 10px', borderRadius: '3px', background: conn ? 'rgba(220,38,38,0.06)' : colors.accentBg, cursor: 'pointer',
          }}
        >
          {conn ? 'Disconnect' : 'Connect'}
        </button>
      </div>
    </div>
  )
}

export default function SettingsPage() {
  const { theme, setTheme, colors } = useTheme()
  const [activeSection, setActiveSection] = useState('Alert Thresholds')
  const [saved, setSaved] = useState(false)

  const handleSave = async () => {
    setSaved(true)
    try {
      await api.updateSettings('platform_settings', {
        activeSection,
        updatedAt: new Date().toISOString(),
      })
    } catch (e) {
      console.warn('Backend settings save notice:', e)
    }
    setTimeout(() => setSaved(false), 2500)
  }

  const inputStyle: React.CSSProperties = {
    background: colors.inputBg,
    border: `1px solid ${colors.inputBorder}`,
    color: colors.inputText,
    fontFamily: 'IBM Plex Mono, monospace',
    fontSize: '12px',
    padding: '7px 10px',
    borderRadius: '4px',
    width: '100%',
    outline: 'none',
  }
  const labelStyle: React.CSSProperties = {
    fontFamily: 'IBM Plex Mono, monospace',
    fontSize: '10px',
    fontWeight: 600,
    color: colors.textMuted,
    display: 'block',
    marginBottom: '5px',
    letterSpacing: '0.06em',
  }
  const sectionTitle: React.CSSProperties = {
    fontFamily: 'Space Grotesk, sans-serif',
    fontSize: '14px',
    fontWeight: 700,
    color: colors.accent,
    marginBottom: '4px',
  }
  const sectionSub: React.CSSProperties = {
    fontFamily: 'IBM Plex Mono, monospace',
    fontSize: '10px',
    color: colors.textMuted,
    marginBottom: '16px',
  }

  return (
    <div style={{ flex: 1, display: 'flex', overflow: 'hidden', height: '100%', background: colors.bgApp }}>
      {/* Left nav */}
      <div style={{
        width: '220px', flexShrink: 0, borderRight: `1px solid ${colors.borderPrimary}`,
        background: colors.bgSidebar, display: 'flex', flexDirection: 'column',
      }}>
        <div style={{ padding: '16px', borderBottom: `1px solid ${colors.borderPrimary}`, background: colors.bgCardSubtle }}>
          <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '14px', fontWeight: 700, color: colors.accent }}>Settings</p>
          <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '10px', color: colors.textMuted }}>System configuration</p>
        </div>
        <div style={{ flex: 1, padding: '8px' }}>
          {SECTIONS.map(s => (
            <button
              key={s}
              onClick={() => setActiveSection(s)}
              style={{
                display: 'block', width: '100%', textAlign: 'left',
                fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '12px', fontWeight: activeSection === s ? 600 : 400,
                color: activeSection === s ? colors.accent : colors.textSecondary,
                background: activeSection === s ? colors.accentBg : 'transparent',
                borderLeft: activeSection === s ? `3px solid ${colors.accent}` : '3px solid transparent',
                padding: '8px 10px', borderRadius: '4px', marginBottom: '2px',
                cursor: 'pointer', border: 'none', borderLeftStyle: 'solid', transition: 'all 0.12s',
              }}
            >
              {s}
            </button>
          ))}
        </div>
        <div style={{ padding: '12px', borderTop: `1px solid ${colors.borderPrimary}`, background: colors.bgCardSubtle }}>
          <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '9px', fontWeight: 600, color: colors.textSecondary, marginBottom: '3px' }}>
            Role: Admin
          </p>
          <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '9px', color: colors.textMuted }}>
            Mine Manager — Demo Mine
          </p>
        </div>
      </div>

      {/* Right content */}
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', background: colors.bgCanvas }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 20px', borderBottom: `1px solid ${colors.borderPrimary}`, flexShrink: 0,
          background: colors.bgCardSubtle,
        }}>
          <div>
            <p style={sectionTitle}>{activeSection}</p>
            <p style={{ ...sectionSub, marginBottom: 0 }}>
              {activeSection === 'Alert Thresholds' && 'Define when sensors trigger LOW, MEDIUM, and HIGH risk alerts'}
              {activeSection === 'Sensor Configuration' && 'Calibration intervals, sampling rates, and node management'}
              {activeSection === 'Notifications' && 'Configure SMS, email, and push alert delivery'}
              {activeSection === 'User Preferences' && 'Display units, theme, and personal settings'}
              {activeSection === 'Integrations' && 'Connect external services for alerting and data export'}
              {activeSection === 'User Management' && 'Manage user accounts, roles, and access control'}
            </p>
          </div>
          <button
            onClick={handleSave}
            style={{
              fontFamily: 'Space Grotesk, sans-serif', fontSize: '12px', fontWeight: 700,
              color: colors.isDark ? '#1A1714' : '#FFFFFF',
              background: saved ? (colors.isDark ? '#4C8C6B' : '#15803D') : colors.accent,
              border: 'none', padding: '8px 18px', borderRadius: '5px', cursor: 'pointer',
              boxShadow: colors.shadowSm,
              transition: 'background 0.2s',
            }}
          >
            {saved ? '✓ Saved' : 'Save Changes'}
          </button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>

          {activeSection === 'Alert Thresholds' && (
            <div>
              <div style={{
                padding: '10px 12px', marginBottom: '20px', borderRadius: '5px',
                background: colors.isDark ? 'rgba(217,142,59,0.08)' : 'rgba(180,83,9,0.06)',
                border: `1px solid ${colors.isDark ? 'rgba(217,142,59,0.2)' : 'rgba(180,83,9,0.2)'}`,
              }}>
                <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '10px', color: colors.isDark ? '#D98E3B' : '#B45309', fontWeight: 600 }}>
                  ⚠ Changes to thresholds affect real-time alerting immediately. Only Admin users can modify these values.
                </p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr 1fr 1fr', gap: '10px', marginBottom: '8px' }}>
                <span />
                {['LOW Threshold', 'MEDIUM Threshold', 'HIGH Threshold'].map((h, i) => (
                  <p key={h} style={{
                    fontFamily: 'IBM Plex Mono, monospace', fontSize: '9px', fontWeight: 700,
                    color: colors.isDark ? ['#4C8C6B', '#D98E3B', '#B3492E'][i] : ['#15803D', '#B45309', '#DC2626'][i],
                    letterSpacing: '0.06em'
                  }}>
                    {h}
                  </p>
                ))}
              </div>
              <ThresholdRow label="Tilt Angle" unit="degrees (°)" low={2} medium={5} high={7} />
              <ThresholdRow label="Vibration" unit="g (acceleration)" low={0.3} medium={1.0} high={1.8} />
              <ThresholdRow label="AE Events" unit="hits per minute" low={10} medium={40} high={80} />
              <ThresholdRow label="Displacement" unit="millimetres (mm)" low={5} medium={15} high={30} />
              <ThresholdRow label="Crack Width" unit="millimetres (mm)" low={0.5} medium={1.0} high={2.0} />
              <ThresholdRow label="Soil Moisture" unit="% relative humidity" low={50} medium={65} high={80} />
            </div>
          )}

          {activeSection === 'Sensor Configuration' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <p style={sectionTitle}>Sampling & Intervals</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  {[
                    { label: 'SENSOR UPDATE INTERVAL', value: '5', unit: 'seconds' },
                    { label: 'DASHBOARD REFRESH RATE', value: '2', unit: 'seconds' },
                    { label: 'ANOMALY DETECTION WINDOW', value: '30', unit: 'minutes' },
                    { label: 'OFFLINE TIMEOUT', value: '5', unit: 'minutes' },
                    { label: 'DATA RETENTION', value: '90', unit: 'days' },
                    { label: 'CALIBRATION INTERVAL', value: '30', unit: 'days' },
                  ].map(f => (
                    <div key={f.label}>
                      <label style={labelStyle}>{f.label} ({f.unit})</label>
                      <input type="number" defaultValue={f.value} style={inputStyle} />
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p style={sectionTitle}>Node Management</p>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      {['Node', 'Panel', 'Status', 'Last Calibrated', 'Action'].map(h => (
                        <th key={h} style={{
                          fontFamily: 'IBM Plex Mono, monospace', fontSize: '10px', fontWeight: 700,
                          color: colors.textMuted, padding: '8px 12px', textAlign: 'left',
                          background: colors.tableHeaderBg, borderBottom: `1px solid ${colors.borderPrimary}`,
                        }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { id: 1, panel: 'Panel 1', status: 'online', cal: '2026-08-10' },
                      { id: 2, panel: 'Panel 1', status: 'online', cal: '2026-08-10' },
                      { id: 5, panel: 'Panel 2', status: 'online', cal: '2026-07-22' },
                      { id: 6, panel: 'Panel 2', status: 'online', cal: '2026-07-22' },
                      { id: 7, panel: 'Panel 2', status: 'online', cal: '2026-07-22' },
                      { id: 8, panel: 'Panel 2', status: 'online', cal: '2026-07-22' },
                    ].map(n => (
                      <tr key={n.id} style={{ borderBottom: `1px solid ${colors.borderPrimary}` }}>
                        <td style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '11px', fontWeight: 600, color: colors.textPrimary, padding: '8px 12px' }}>Node {n.id}</td>
                        <td style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '11px', color: colors.textSecondary, padding: '8px 12px' }}>{n.panel}</td>
                        <td style={{ padding: '8px 12px' }}>
                          <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '10px', fontWeight: 600, color: colors.isDark ? '#4C8C6B' : '#15803D' }}>● Online</span>
                        </td>
                        <td style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '11px', color: colors.textMuted, padding: '8px 12px' }}>{n.cal}</td>
                        <td style={{ padding: '8px 12px' }}>
                          <button style={{
                            fontFamily: 'IBM Plex Mono, monospace', fontSize: '10px', fontWeight: 600,
                            color: colors.accent, border: `1px solid ${colors.accentBorder}`, padding: '2px 8px', borderRadius: '3px',
                            background: colors.accentBg, cursor: 'pointer',
                          }}>
                            Calibrate
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeSection === 'Notifications' && (
            <div style={{ maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <p style={sectionTitle}>Alert Delivery Channels</p>
                <Toggle label="SMS Alerts (Twilio)" sub="Send HIGH risk alerts via SMS to registered numbers" defaultOn={true} />
                <Toggle label="Email Alerts (SendGrid)" sub="Send alert summaries and reports via email" defaultOn={true} />
                <Toggle label="Push Notifications (Firebase)" sub="In-app push for mobile users" defaultOn={false} />
                <Toggle label="Daily Summary Digest" sub="Send end-of-day summary email at 18:00 IST" defaultOn={true} />
              </div>
              <div>
                <p style={sectionTitle}>Alert Level Filters</p>
                <Toggle label="Notify on HIGH alerts" sub="Immediate notification — recommended always ON" defaultOn={true} />
                <Toggle label="Notify on MEDIUM alerts" sub="Within 15 minutes" defaultOn={true} />
                <Toggle label="Notify on LOW alerts" sub="Included in daily digest only" defaultOn={false} />
              </div>
              <div>
                <p style={sectionTitle}>Recipient Numbers / Emails</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {['Mine Manager', 'Safety Officer', 'Operations Director'].map(r => (
                    <div key={r} style={{ display: 'grid', gridTemplateColumns: '140px 1fr 120px', gap: '8px', alignItems: 'center' }}>
                      <label style={{ ...labelStyle, marginBottom: 0, color: colors.textSecondary }}>{r}</label>
                      <input type="email" defaultValue={`${r.toLowerCase().replace(' ', '.')}@demomine.in`} style={inputStyle} />
                      <button style={{
                        fontFamily: 'IBM Plex Mono, monospace', fontSize: '10px', color: colors.textMuted,
                        border: `1px solid ${colors.borderSubtle}`, padding: '7px 0', borderRadius: '4px', background: 'transparent', cursor: 'pointer',
                      }}>Test Send</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeSection === 'User Preferences' && (
            <div style={{ maxWidth: '520px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Theme Preference */}
              <div>
                <p style={sectionTitle}>Theme Appearance</p>
                <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '10px', color: colors.textMuted, marginBottom: '8px' }}>
                  Select the visual theme for your workstation
                </p>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => setTheme('light')}
                    style={{
                      flex: 1, padding: '10px', borderRadius: '6px', cursor: 'pointer',
                      background: theme === 'light' ? colors.accentBg : colors.bgCard,
                      border: theme === 'light' ? `2px solid ${colors.accent}` : `1px solid ${colors.borderPrimary}`,
                      textAlign: 'left',
                    }}
                  >
                    <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '12px', fontWeight: 700, color: colors.textPrimary }}>
                      ☀ White Theme (Light)
                    </p>
                    <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '9px', color: colors.textMuted, marginTop: '2px' }}>
                      High-contrast daylight operations
                    </p>
                  </button>
                  <button
                    onClick={() => setTheme('dark')}
                    style={{
                      flex: 1, padding: '10px', borderRadius: '6px', cursor: 'pointer',
                      background: theme === 'dark' ? colors.accentBg : colors.bgCard,
                      border: theme === 'dark' ? `2px solid ${colors.accent}` : `1px solid ${colors.borderPrimary}`,
                      textAlign: 'left',
                    }}
                  >
                    <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '12px', fontWeight: 700, color: colors.textPrimary }}>
                      🌙 Dark Theme
                    </p>
                    <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '9px', color: colors.textMuted, marginTop: '2px' }}>
                      Coal seam dark room monitoring
                    </p>
                  </button>
                </div>
              </div>

              <div>
                <p style={sectionTitle}>Display</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={labelStyle}>TILT UNITS</label>
                    <select style={inputStyle}><option>Degrees (°)</option><option>Radians</option><option>%</option></select>
                  </div>
                  <div>
                    <label style={labelStyle}>DISPLACEMENT UNITS</label>
                    <select style={inputStyle}><option>Millimetres (mm)</option><option>Centimetres (cm)</option><option>Metres (m)</option></select>
                  </div>
                  <div>
                    <label style={labelStyle}>TEMPERATURE UNITS</label>
                    <select style={inputStyle}><option>Celsius (°C)</option><option>Fahrenheit (°F)</option></select>
                  </div>
                  <div>
                    <label style={labelStyle}>TIME FORMAT</label>
                    <select style={inputStyle}><option>24-hour (14:23)</option><option>12-hour (2:23 PM)</option></select>
                  </div>
                </div>
              </div>
              <div>
                <p style={sectionTitle}>Accessibility</p>
                <Toggle label="Reduce animations" sub="Disables pulsing and transition effects (prefers-reduced-motion)" defaultOn={false} />
                <Toggle label="High-contrast risk colors" sub="Use higher-contrast palette for risk indicators" defaultOn={false} />
                <Toggle label="Large text mode" sub="Increase font sizes by 20% throughout the interface" defaultOn={false} />
              </div>
              <div>
                <label style={labelStyle}>DEFAULT LANDING PANEL</label>
                <select style={inputStyle}>
                  <option>Panel 2 (current highest risk)</option>
                  <option>Panel 1</option>
                  <option>All Panels Overview</option>
                </select>
              </div>
            </div>
          )}

          {activeSection === 'Integrations' && (
            <div style={{ maxWidth: '600px' }}>
              <p style={sectionTitle}>Connected Services</p>
              <p style={{ ...sectionSub, marginBottom: '16px' }}>Link external services for alerting, storage, and compliance reporting.</p>
              <IntegrationCard name="Twilio SMS" icon="📱" connected={true} desc="SMS alerts to registered phone numbers on HIGH risk events" />
              <IntegrationCard name="SendGrid Email" icon="📧" connected={true} desc="Email reports, daily digests, and alert summaries" />
              <IntegrationCard name="Firebase Push" icon="🔔" connected={false} desc="Real-time push notifications for mobile app users" />
              <IntegrationCard name="AWS S3" icon="☁️" connected={false} desc="Archive sensor data and reports to cloud storage" />
              <IntegrationCard name="SCADA Integration" icon="🏭" connected={false} desc="Connect to on-site SCADA / historian systems via OPC-UA" />
              <IntegrationCard name="Slack Webhooks" icon="💬" connected={false} desc="Post alerts to a Slack channel" />
            </div>
          )}

          {activeSection === 'User Management' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <p style={{ ...sectionTitle, marginBottom: 0 }}>System Users</p>
                <button style={{
                  fontFamily: 'Space Grotesk, sans-serif', fontSize: '11px', fontWeight: 700,
                  color: colors.isDark ? '#1A1714' : '#FFFFFF',
                  background: colors.accent, border: 'none', padding: '7px 16px', borderRadius: '4px', cursor: 'pointer',
                  boxShadow: colors.shadowSm,
                }}>
                  + Invite User
                </button>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    {['Name', 'Email', 'Role', 'Last Active', 'Status', ''].map(h => (
                      <th key={h} style={{
                        fontFamily: 'IBM Plex Mono, monospace', fontSize: '10px', fontWeight: 700,
                        color: colors.textMuted, padding: '8px 12px', textAlign: 'left',
                        background: colors.tableHeaderBg, borderBottom: `1px solid ${colors.borderPrimary}`,
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: 'Mine Manager', email: 'manager@demomine.in', role: 'Admin', last: 'Active now', active: true },
                    { name: 'R. Kumar', email: 'r.kumar@demomine.in', role: 'Operator', last: '2h ago', active: true },
                    { name: 'J. Singh', email: 'j.singh@demomine.in', role: 'Operator', last: '4h ago', active: true },
                    { name: 'Safety Officer', email: 'safety@demomine.in', role: 'Safety Officer', last: '1d ago', active: true },
                    { name: 'DGMS Inspector', email: 'dgms@gov.in', role: 'Regulator (Read-only)', last: '7d ago', active: false },
                  ].map(u => (
                    <tr key={u.email} style={{ borderBottom: `1px solid ${colors.borderPrimary}` }}>
                      <td style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '12px', fontWeight: 600, color: colors.textPrimary, padding: '9px 12px' }}>{u.name}</td>
                      <td style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '11px', color: colors.textSecondary, padding: '9px 12px' }}>{u.email}</td>
                      <td style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '10px', fontWeight: 600, color: colors.accent, padding: '9px 12px' }}>{u.role}</td>
                      <td style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '10px', color: colors.textMuted, padding: '9px 12px' }}>{u.last}</td>
                      <td style={{ padding: '9px 12px' }}>
                        <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '10px', fontWeight: 600, color: u.active ? (colors.isDark ? '#4C8C6B' : '#15803D') : colors.textMuted }}>
                          {u.active ? '● Active' : '○ Inactive'}
                        </span>
                      </td>
                      <td style={{ padding: '9px 12px' }}>
                        <button style={{
                          fontFamily: 'IBM Plex Mono, monospace', fontSize: '10px', color: colors.textMuted,
                          border: `1px solid ${colors.borderSubtle}`, padding: '2px 8px', borderRadius: '3px', background: 'transparent', cursor: 'pointer',
                        }}>Edit</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
