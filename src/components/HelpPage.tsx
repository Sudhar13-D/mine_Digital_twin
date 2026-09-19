import { useState } from 'react'
import { useTheme } from '../context/ThemeContext'

const FAQS = [
  {
    q: 'What does the tilt angle reading mean?',
    a: 'Tilt angle (in degrees) measures how much the ground surface has inclined from horizontal at the sensor location. Readings above 5° indicate significant ground movement. Values above 7° trigger a HIGH risk alert, as this level of tilt can indicate imminent pillar failure or surface subsidence.',
  },
  {
    q: 'What is an Acoustic Emission (AE) event?',
    a: 'Acoustic Emission events are micro-scale stress waves released when rock or soil fractures internally. The sensor counts these "hits" per minute. A sudden spike from 2–5 events/min to 100+ events/min is a strong precursor to structural failure and triggers HIGH alerts.',
  },
  {
    q: 'What does the LSTM Anomaly Score mean?',
    a: 'The LSTM (Long Short-Term Memory) neural network learns the normal pattern of all sensor readings together. The Anomaly Score (0 to 1) measures how different the current readings are from the learned baseline. Scores above 0.70 trigger HIGH risk classification. The Confidence % indicates how certain the model is about its prediction.',
  },
  {
    q: 'How do I switch between panels?',
    a: 'Use the Panel dropdown in the header bar (top of screen) to select a specific panel. When you select a panel, all views update: the GIS map highlights only that panel\'s nodes, the cross-section shows only that panel\'s pillars, the readings table filters to that panel\'s sensors, and the risk panel shows only that panel\'s alerts.',
  },
  {
    q: 'What should I do when a HIGH risk alert fires?',
    a: '1. Check the GIS map to see exactly WHERE on the panel the sensors are alarming. 2. Check the cross-section to understand the subsidence magnitude and which pillars are affected. 3. Check the LSTM anomaly score and prediction horizon in the Risk panel. 4. Acknowledge the alert and escalate to the Safety Officer or Mine Manager as per your emergency protocol. 5. Initiate evacuation of affected areas if failure risk exceeds 70% within 24 hours.',
  },
  {
    q: 'What is the Cross-Section view showing?',
    a: 'The cross-section is a side-view slice through the mine panel showing: the surface topography (top tan band), geological strata (sandstone, shale, coal seam), support pillars (dark rectangles), and sensor nodes positioned above their corresponding pillars. When HIGH risk triggers, the surface sags visually to show the predicted subsidence depth.',
  },
  {
    q: 'How often does data update?',
    a: 'Sensor readings update every 2–5 seconds. The dashboard refreshes in real-time as new readings arrive. The "Updated: Xs ago" counter in the readings table shows the exact age of each sensor\'s last reading. Nodes showing readings older than 5 minutes are flagged as offline.',
  },
  {
    q: 'How do I generate a compliance report?',
    a: 'Go to the Reports page (top navigation). Select your report type (Daily Summary, Incident Report, or Compliance Audit), set the date range and panel, and click Generate. The report downloads as a PDF. Compliance Audit reports include the full alert history, sensor calibration records, and DGMS-required signature fields.',
  },
]

const SHORTCUTS = [
  { key: 'Tab', action: 'Navigate between interactive elements' },
  { key: 'Enter / Space', action: 'Activate selected button or control' },
  { key: 'Esc', action: 'Close overlays and tooltips' },
  { key: 'Arrow keys', action: 'Move focus within tables and lists' },
  { key: '1 / 2 / 3', action: 'Quick-switch to Panel 1 / 2 / 3' },
  { key: 'A', action: 'Switch to All Panels view' },
  { key: 'R', action: 'Navigate to Reports page' },
  { key: 'S', action: 'Navigate to Settings' },
  { key: 'H', action: 'Navigate to Help' },
]

const FEATURES = [
  {
    icon: '🗺️',
    title: 'GIS Map',
    desc: 'Live bird\'s-eye view of the mine panel with sensor node positions, risk heatmap, pillar footprints, and deformation vectors. Click any node to focus all views on it.',
    badge: 'PRIMARY',
    badgeType: 'accent',
  },
  {
    icon: '⛏️',
    title: 'Cross-Section View',
    desc: 'Geological layer-by-layer view showing pillars underground, sensor nodes at the surface, and real-time subsidence animation when HIGH risk is detected.',
    badge: 'PRIMARY',
    badgeType: 'accent',
  },
  {
    icon: '📊',
    title: 'Live Readings Table',
    desc: 'Real-time sensor values for Tilt, Vibration, Acoustic Emission, and Displacement. Click "Full Suite" to see all 9 sensor channels. Rows sorted by risk level by default.',
    badge: 'ALWAYS VISIBLE',
    badgeType: 'low',
  },
  {
    icon: '🤖',
    title: 'AI/ML Risk Panel',
    desc: 'LSTM model anomaly scores and failure predictions for each node. Shows confidence %, prediction horizon, and per-node risk breakdown bars.',
    badge: 'AI-POWERED',
    badgeType: 'med',
  },
  {
    icon: '🔔',
    title: 'Alert System',
    desc: 'Layered alerts: toast notification, sidebar alert log, pulsing risk badges, and row highlights in the table. Acknowledge or escalate with one click.',
    badge: 'REAL-TIME',
    badgeType: 'high',
  },
  {
    icon: '📋',
    title: 'Reports',
    desc: 'Generate Daily Summary, Incident Reports, and Compliance Audit PDFs. Export sensor data as CSV. 30-day historical trend charts included.',
    badge: 'COMPLIANCE',
    badgeType: 'muted',
  },
]

function FAQItem({ q, a }: { q: string; a: string }) {
  const { colors } = useTheme()
  const [open, setOpen] = useState(false)
  return (
    <div style={{ borderBottom: `1px solid ${colors.borderPrimary}` }}>
      <button
        onClick={() => setOpen(p => !p)}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          width: '100%', padding: '14px 0', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
        }}
      >
        <p style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '13px', color: open ? colors.accent : colors.textPrimary, fontWeight: 600 }}>
          {q}
        </p>
        <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '14px', color: colors.textMuted, flexShrink: 0, marginLeft: '12px' }}>
          {open ? '−' : '+'}
        </span>
      </button>
      {open && (
        <p style={{
          fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '12px', color: colors.textSecondary,
          lineHeight: 1.65, paddingBottom: '14px', paddingRight: '24px',
        }}>
          {a}
        </p>
      )}
    </div>
  )
}

export default function HelpPage() {
  const { colors } = useTheme()
  const [activeTab, setActiveTab] = useState<'guide' | 'faq' | 'shortcuts' | 'support'>('guide')

  const RISK_COLOR = {
    low: colors.riskLow,
    med: colors.riskMedium,
    high: colors.riskHigh,
  }

  const tabs = [
    { id: 'guide', label: 'Feature Guide' },
    { id: 'faq', label: 'FAQ' },
    { id: 'shortcuts', label: 'Keyboard Shortcuts' },
    { id: 'support', label: 'Contact Support' },
  ] as const

  return (
    <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100%', background: colors.bgApp }}>
      {/* Page header */}
      <div style={{ padding: '16px 24px', borderBottom: `1px solid ${colors.borderPrimary}`, flexShrink: 0, background: colors.bgHeader }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div>
            <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '16px', fontWeight: 700, color: colors.accent, marginBottom: '2px' }}>
              Help &amp; Documentation
            </p>
            <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '10px', color: colors.textMuted }}>
              SubsideAI Mine Subsidence Monitor · v2.4 · Updated Sep 2026
            </p>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '4px' }}>
            {tabs.map(t => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                style={{
                  fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '12px',
                  fontWeight: activeTab === t.id ? 600 : 400,
                  color: activeTab === t.id ? colors.accent : colors.textSecondary,
                  background: activeTab === t.id ? colors.accentBg : 'transparent',
                  border: activeTab === t.id ? `1px solid ${colors.accentBorder}` : '1px solid transparent',
                  padding: '6px 14px', borderRadius: '4px', cursor: 'pointer', transition: 'all 0.12s',
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>

        {activeTab === 'guide' && (
          <div>
            <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '14px', fontWeight: 700, color: colors.textPrimary, marginBottom: '6px' }}>
              Platform Overview
            </p>
            <p style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '12px', color: colors.textSecondary, lineHeight: 1.65, marginBottom: '24px', maxWidth: '680px' }}>
              SubsideAI provides real-time monitoring of underground room-and-pillar coal mines. Sensor nodes on the surface transmit tilt, vibration, acoustic emission, and displacement data. An LSTM neural network detects anomalies and predicts pillar failure risk before visible collapse occurs.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '32px' }}>
              {FEATURES.map(f => {
                const bCol = f.badgeType === 'accent' ? colors.accent : f.badgeType === 'low' ? RISK_COLOR.low : f.badgeType === 'med' ? RISK_COLOR.med : f.badgeType === 'high' ? RISK_COLOR.high : colors.textMuted
                return (
                  <div key={f.title} style={{
                    padding: '16px', borderRadius: '6px',
                    background: colors.bgCard, border: `1px solid ${colors.borderPrimary}`,
                    boxShadow: colors.shadowSm,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontSize: '20px' }}>{f.icon}</span>
                      <span style={{
                        fontFamily: 'IBM Plex Mono, monospace', fontSize: '9px', fontWeight: 600, color: bCol,
                        background: `${bCol}18`, border: `1px solid ${bCol}30`,
                        padding: '1px 6px', borderRadius: '3px',
                      }}>
                        {f.badge}
                      </span>
                    </div>
                    <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '13px', fontWeight: 700, color: colors.textPrimary, marginBottom: '6px' }}>
                      {f.title}
                    </p>
                    <p style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '11px', color: colors.textSecondary, lineHeight: 1.6 }}>
                      {f.desc}
                    </p>
                  </div>
                )
              })}
            </div>

            {/* Risk level guide */}
            <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '14px', fontWeight: 700, color: colors.textPrimary, marginBottom: '12px' }}>
              Risk Level Definitions
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '600px' }}>
              {[
                { level: 'LOW', color: RISK_COLOR.low, bg: colors.isDark ? 'rgba(76,140,107,0.1)' : 'rgba(21,128,61,0.08)', desc: 'Readings within normal operating range. No action required. Continue routine monitoring.' },
                { level: 'MEDIUM', color: RISK_COLOR.med, bg: colors.isDark ? 'rgba(217,142,59,0.1)' : 'rgba(180,83,9,0.08)', desc: 'Readings elevated above baseline. Monitor closely. Consider increasing sampling rate. Notify shift supervisor.' },
                { level: 'HIGH', color: RISK_COLOR.high, bg: colors.isDark ? 'rgba(179,73,46,0.12)' : 'rgba(220,38,38,0.08)', desc: 'Critical readings. LSTM anomaly score >0.70. Immediate escalation required. Evaluate evacuation of affected surface areas.' },
              ].map(r => (
                <div key={r.level} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', padding: '12px', borderRadius: '6px', background: r.bg, border: `1px solid ${r.color}33` }}>
                  <span style={{
                    fontFamily: 'IBM Plex Mono, monospace', fontSize: '11px', fontWeight: 700,
                    color: r.color, minWidth: '60px',
                  }}>
                    ● {r.level}
                  </span>
                  <p style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '12px', color: colors.textPrimary, lineHeight: 1.5 }}>
                    {r.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'faq' && (
          <div style={{ maxWidth: '700px' }}>
            <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '14px', fontWeight: 700, color: colors.textPrimary, marginBottom: '4px' }}>
              Frequently Asked Questions
            </p>
            <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '10px', color: colors.textMuted, marginBottom: '20px' }}>
              Click any question to expand the answer.
            </p>
            {FAQS.map((f, i) => <FAQItem key={i} q={f.q} a={f.a} />)}
          </div>
        )}

        {activeTab === 'shortcuts' && (
          <div style={{ maxWidth: '500px' }}>
            <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '14px', fontWeight: 700, color: colors.textPrimary, marginBottom: '4px' }}>
              Keyboard Shortcuts
            </p>
            <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '10px', color: colors.textMuted, marginBottom: '20px' }}>
              Full keyboard navigation is supported throughout the platform.
            </p>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['Key', 'Action'].map(h => (
                    <th key={h} style={{
                      fontFamily: 'IBM Plex Mono, monospace', fontSize: '10px', fontWeight: 700, color: colors.textMuted,
                      padding: '8px 12px', textAlign: 'left', background: colors.tableHeaderBg, borderBottom: `1px solid ${colors.borderPrimary}`,
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SHORTCUTS.map(s => (
                  <tr key={s.key} style={{ borderBottom: `1px solid ${colors.borderPrimary}` }}>
                    <td style={{ padding: '10px 12px' }}>
                      <kbd style={{
                        fontFamily: 'IBM Plex Mono, monospace', fontSize: '11px', fontWeight: 600, color: colors.accent,
                        background: colors.bgCardSubtle, border: `1px solid ${colors.borderSubtle}`, padding: '2px 8px', borderRadius: '4px',
                      }}>
                        {s.key}
                      </kbd>
                    </td>
                    <td style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '12px', color: colors.textSecondary, padding: '10px 12px' }}>
                      {s.action}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'support' && (
          <div style={{ maxWidth: '560px' }}>
            <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '14px', fontWeight: 700, color: colors.textPrimary, marginBottom: '20px' }}>
              Contact Support
            </p>

            {/* Contact cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '28px' }}>
              {[
                { label: 'Technical Support', contact: 'support@subsideal.in', type: 'Email', icon: '📧', hours: '24/7 for HIGH alerts' },
                { label: 'Emergency Hotline', contact: '+91 98765 43210', type: 'Phone', icon: '📞', hours: '24/7 — HIGH risk only' },
                { label: 'Training & Onboarding', contact: 'training@subsideal.in', type: 'Email', icon: '🎓', hours: 'Mon–Fri 09:00–18:00 IST' },
                { label: 'Compliance Queries', contact: 'compliance@subsideal.in', type: 'Email', icon: '📋', hours: 'Mon–Fri 10:00–17:00 IST' },
              ].map(c => (
                <div key={c.label} style={{
                  padding: '14px', borderRadius: '6px',
                  background: colors.bgCard, border: `1px solid ${colors.borderPrimary}`,
                  boxShadow: colors.shadowSm,
                }}>
                  <span style={{ fontSize: '18px', display: 'block', marginBottom: '8px' }}>{c.icon}</span>
                  <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '12px', fontWeight: 700, color: colors.textPrimary, marginBottom: '4px' }}>
                    {c.label}
                  </p>
                  <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '11px', fontWeight: 600, color: colors.accent, marginBottom: '3px' }}>
                    {c.contact}
                  </p>
                  <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '9px', color: colors.textMuted }}>
                    {c.hours}
                  </p>
                </div>
              ))}
            </div>

            {/* Submit ticket form */}
            <div style={{ padding: '16px', borderRadius: '6px', background: colors.bgCard, border: `1px solid ${colors.borderPrimary}`, boxShadow: colors.shadowSm }}>
              <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '13px', fontWeight: 700, color: colors.accent, marginBottom: '14px' }}>
                Submit a Support Ticket
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div>
                  <label style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '10px', fontWeight: 600, color: colors.textMuted, display: 'block', marginBottom: '4px' }}>SUBJECT</label>
                  <input type="text" placeholder="Describe the issue briefly" style={{
                    background: colors.inputBg, border: `1px solid ${colors.inputBorder}`, color: colors.inputText,
                    fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '12px',
                    padding: '8px 10px', borderRadius: '4px', width: '100%', outline: 'none',
                  }} />
                </div>
                <div>
                  <label style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '10px', fontWeight: 600, color: colors.textMuted, display: 'block', marginBottom: '4px' }}>PRIORITY</label>
                  <select style={{
                    background: colors.inputBg, border: `1px solid ${colors.inputBorder}`, color: colors.inputText,
                    fontFamily: 'IBM Plex Mono, monospace', fontSize: '11px',
                    padding: '8px 10px', borderRadius: '4px', width: '100%',
                  }}>
                    <option>Normal</option>
                    <option>HIGH — System impacting</option>
                    <option>URGENT — Safety concern</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '10px', fontWeight: 600, color: colors.textMuted, display: 'block', marginBottom: '4px' }}>DESCRIPTION</label>
                  <textarea
                    rows={4}
                    placeholder="Please include panel name, node IDs, and what you observed…"
                    style={{
                      background: colors.inputBg, border: `1px solid ${colors.inputBorder}`, color: colors.inputText,
                      fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '12px',
                      padding: '8px 10px', borderRadius: '4px', width: '100%', resize: 'vertical', outline: 'none',
                    }}
                  />
                </div>
                <button style={{
                  fontFamily: 'Space Grotesk, sans-serif', fontSize: '12px', fontWeight: 700,
                  color: colors.isDark ? '#1A1714' : '#FFFFFF', background: colors.accent, border: 'none',
                  padding: '9px 0', borderRadius: '4px', cursor: 'pointer', width: '100%',
                  boxShadow: colors.shadowSm,
                }}>
                  Submit Ticket
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
