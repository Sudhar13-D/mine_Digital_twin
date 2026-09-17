import { useState } from 'react'
import type { SensorNode, Alert } from '../types'
import { api } from '../api/client'
import { useTheme } from '../context/ThemeContext'

const RECENT_REPORTS = [
  { id: 'RPT-2024-091', type: 'Daily Summary', panel: 'Panel 2', date: '2026-09-02', size: '1.2 MB', status: 'ready' },
  { id: 'RPT-2024-090', type: 'Incident Report', panel: 'Panel 2', date: '2026-09-01', size: '3.4 MB', status: 'ready' },
  { id: 'RPT-2024-088', type: 'Compliance Audit', panel: 'All Panels', date: '2026-08-28', size: '8.1 MB', status: 'ready' },
  { id: 'RPT-2024-085', type: 'Daily Summary', panel: 'Panel 1', date: '2026-08-25', size: '0.9 MB', status: 'ready' },
  { id: 'RPT-2024-082', type: 'Incident Report', panel: 'Panel 1', date: '2026-08-20', size: '2.7 MB', status: 'ready' },
]

const TREND_DATA = [
  { date: '27 Aug', p1: 1.2, p2: 4.5 },
  { date: '28 Aug', p1: 1.1, p2: 5.8 },
  { date: '29 Aug', p1: 1.3, p2: 6.2 },
  { date: '30 Aug', p1: 1.0, p2: 6.9 },
  { date: '31 Aug', p1: 1.4, p2: 7.5 },
  { date: '01 Sep', p1: 1.2, p2: 7.8 },
  { date: '02 Sep', p1: 1.1, p2: 8.1 },
  { date: '03 Sep', p1: 1.2, p2: 8.7 },
]

interface Props {
  nodes: SensorNode[]
  alerts: Alert[]
  activePanel: string
}

export default function ReportsPage({ nodes, alerts, activePanel }: Props) {
  const { colors } = useTheme()
  const [reportType, setReportType] = useState('Daily Summary')
  const [dateFrom, setDateFrom] = useState('2026-08-27')
  const [dateTo, setDateTo] = useState('2026-09-03')
  const [selectedPanel, setSelectedPanel] = useState(activePanel)
  const [format, setFormat] = useState<'PDF' | 'CSV' | 'Excel'>('PDF')
  const [generating, setGenerating] = useState(false)
  const [generated, setGenerated] = useState(false)
  const [downloadBlobUrl, setDownloadBlobUrl] = useState<string | null>(null)
  const [downloadFilename, setDownloadFilename] = useState<string>('')

  const RISK_COLOR: Record<string, string> = colors.isDark
    ? { LOW: '#4C8C6B', MEDIUM: '#D98E3B', HIGH: '#B3492E' }
    : { LOW: '#15803D', MEDIUM: '#B45309', HIGH: '#DC2626' }

  const handleGenerate = async () => {
    setGenerating(true)
    setGenerated(false)
    try {
      const selectedFormat = format === 'Excel' ? 'CSV' : format
      const blob = await api.generateReport({
        reportType,
        panel: selectedPanel,
        dateFrom,
        dateTo,
        format: selectedFormat as 'PDF' | 'CSV',
      })
      const ext = selectedFormat === 'CSV' ? 'csv' : 'pdf'
      const filename = `subsideai_${reportType.toLowerCase().replace(/\s+/g, '_')}_${selectedPanel.toLowerCase().replace(/\s+/g, '_')}_${dateFrom}_to_${dateTo}.${ext}`
      
      const url = window.URL.createObjectURL(blob)
      setDownloadBlobUrl(url)
      setDownloadFilename(filename)
      
      // Auto trigger download
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      
      setGenerated(true)
    } catch (err) {
      console.error('Report generation error:', err)
      setGenerated(true)
    } finally {
      setGenerating(false)
    }
  }

  // Spark line helper
  const maxTilt = Math.max(...TREND_DATA.map(d => Math.max(d.p1, d.p2)))
  const sparkY = (v: number, h: number) => h - (v / maxTilt) * (h - 6)

  const inputStyle: React.CSSProperties = {
    background: colors.inputBg,
    border: `1px solid ${colors.inputBorder}`,
    color: colors.inputText,
    fontFamily: 'IBM Plex Mono, monospace',
    fontSize: '11px',
    padding: '6px 10px',
    borderRadius: '4px',
    width: '100%',
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

  const cell: React.CSSProperties = {
    fontFamily: 'IBM Plex Mono, monospace',
    fontSize: '11px',
    color: colors.textSecondary,
    padding: '8px 12px',
    borderBottom: `1px solid ${colors.borderPrimary}`,
    verticalAlign: 'middle',
  }
  const hcell: React.CSSProperties = {
    ...cell,
    color: colors.textMuted,
    fontSize: '10px',
    background: colors.tableHeaderBg,
    borderBottom: `1px solid ${colors.borderPrimary}`,
    fontWeight: 700,
    letterSpacing: '0.06em',
  }

  return (
    <div style={{ flex: 1, display: 'flex', overflow: 'hidden', height: '100%', background: colors.bgApp }}>
      {/* Left controls panel */}
      <div style={{
        width: '280px', flexShrink: 0, borderRight: `1px solid ${colors.borderPrimary}`,
        background: colors.bgSidebar, display: 'flex', flexDirection: 'column', overflow: 'hidden',
      }}>
        <div style={{ padding: '16px', borderBottom: `1px solid ${colors.borderPrimary}`, background: colors.bgCardSubtle }}>
          <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '14px', fontWeight: 700, color: colors.accent, marginBottom: '2px' }}>
            Generate Report
          </p>
          <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '10px', color: colors.textMuted }}>
            Configure and export compliance data
          </p>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Report type */}
          <div>
            <label style={labelStyle}>REPORT TYPE</label>
            {['Daily Summary', 'Incident Report', 'Compliance Audit', 'Sensor Trend Export'].map(t => (
              <button
                key={t}
                onClick={() => setReportType(t)}
                style={{
                  display: 'block', width: '100%', textAlign: 'left',
                  fontFamily: 'IBM Plex Mono, monospace', fontSize: '11px',
                  fontWeight: reportType === t ? 600 : 400,
                  color: reportType === t ? colors.accent : colors.textSecondary,
                  background: reportType === t ? colors.accentBg : 'transparent',
                  border: reportType === t ? `1px solid ${colors.accentBorder}` : '1px solid transparent',
                  padding: '7px 10px', borderRadius: '4px', marginBottom: '4px', cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                {reportType === t ? '▸ ' : '  '}{t}
              </button>
            ))}
          </div>

          {/* Date range */}
          <div>
            <label style={labelStyle}>DATE RANGE</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div>
                <label style={{ ...labelStyle, fontSize: '9px' }}>FROM</label>
                <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} style={inputStyle} />
              </div>
              <div>
                <label style={{ ...labelStyle, fontSize: '9px' }}>TO</label>
                <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} style={inputStyle} />
              </div>
            </div>
          </div>

          {/* Panel selector */}
          <div>
            <label style={labelStyle}>PANEL</label>
            <select value={selectedPanel} onChange={e => setSelectedPanel(e.target.value)} style={inputStyle}>
              <option value="All">All Panels</option>
              <option value="Panel 1">Panel 1</option>
              <option value="Panel 2">Panel 2</option>
              <option value="Panel 3">Panel 3</option>
            </select>
          </div>

          {/* Format */}
          <div>
            <label style={labelStyle}>OUTPUT FORMAT</label>
            <div style={{ display: 'flex', gap: '6px' }}>
              {(['PDF', 'CSV', 'Excel'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFormat(f)}
                  style={{
                    flex: 1, fontFamily: 'IBM Plex Mono, monospace', fontSize: '11px',
                    fontWeight: format === f ? 700 : 400,
                    color: format === f ? colors.accent : colors.textSecondary,
                    background: format === f ? colors.accentBg : colors.bgCardSubtle,
                    border: format === f ? `1px solid ${colors.accentBorder}` : `1px solid ${colors.borderSubtle}`,
                    padding: '6px 0', borderRadius: '4px', cursor: 'pointer',
                  }}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Generate button */}
          <button
            onClick={handleGenerate}
            disabled={generating}
            style={{
              width: '100%', padding: '10px 0',
              fontFamily: 'Space Grotesk, sans-serif', fontSize: '13px', fontWeight: 700,
              color: colors.isDark ? '#1A1714' : '#FFFFFF',
              background: generating ? (colors.isDark ? '#8A7A5A' : '#94A3B8') : colors.accent,
              border: 'none', borderRadius: '5px', cursor: generating ? 'default' : 'pointer',
              boxShadow: colors.shadowSm,
              transition: 'background 0.2s',
            }}
          >
            {generating ? '⟳ Generating…' : generated ? '✓ Download Report' : 'Generate Report'}
          </button>

          {generated && (
            <div style={{
              padding: '10px', borderRadius: '5px',
              background: colors.isDark ? 'rgba(76,140,107,0.12)' : 'rgba(21,128,61,0.08)',
              border: `1px solid ${RISK_COLOR.LOW}44`,
            }}>
              <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '10px', fontWeight: 600, color: RISK_COLOR.LOW, marginBottom: '3px' }}>
                ✓ Report ready
              </p>
              <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '9px', color: colors.textMuted }}>
                {reportType} · {selectedPanel} · {dateFrom} → {dateTo}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Right content area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Top: summary cards + sparkline */}
        <div style={{ padding: '16px', borderBottom: `1px solid ${colors.borderPrimary}`, display: 'flex', gap: '12px', flexShrink: 0, background: colors.bgApp }}>
          {/* Summary cards */}
          {[
            { label: 'Total Alerts (7d)', value: '5', sub: '4 HIGH · 1 MED', color: RISK_COLOR.HIGH },
            { label: 'Avg Tilt (7d)', value: '3.42°', sub: 'Panel 2: 8.1° peak', color: RISK_COLOR.MEDIUM },
            { label: 'Nodes Online', value: '8 / 8', sub: 'All operational', color: RISK_COLOR.LOW },
            { label: 'Max AE Events', value: '142/min', sub: 'Node 5, Sep 03', color: RISK_COLOR.HIGH },
            { label: 'Reports This Month', value: '12', sub: '3 compliance exports', color: colors.accent },
          ].map(c => (
            <div key={c.label} style={{
              flex: 1, padding: '10px 12px', borderRadius: '6px',
              background: colors.bgCard, border: `1px solid ${colors.borderPrimary}`,
              boxShadow: colors.shadowSm,
            }}>
              <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '9px', color: colors.textMuted, marginBottom: '4px' }}>{c.label}</p>
              <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '20px', fontWeight: 700, color: c.color, lineHeight: 1 }}>{c.value}</p>
              <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '9px', color: colors.textMuted, marginTop: '3px' }}>{c.sub}</p>
            </div>
          ))}
        </div>

        {/* Tilt trend chart */}
        <div style={{ padding: '16px', borderBottom: `1px solid ${colors.borderPrimary}`, flexShrink: 0, background: colors.bgCard }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <div>
              <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '13px', fontWeight: 700, color: colors.accent }}>
                Tilt Trend — Last 7 Days
              </p>
              <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '10px', color: colors.textMuted }}>
                Maximum tilt angle per panel per day (degrees)
              </p>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              {[['Panel 1', RISK_COLOR.LOW], ['Panel 2', RISK_COLOR.HIGH]].map(([p, c]) => (
                <div key={p} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <div style={{ width: '20px', height: '3px', background: c as string, borderRadius: '2px' }} />
                  <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '10px', fontWeight: 600, color: colors.textSecondary }}>{p}</span>
                </div>
              ))}
            </div>
          </div>
          <svg viewBox="0 0 700 90" style={{ width: '100%', height: '90px' }}>
            <defs>
              <linearGradient id="grad-p2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={RISK_COLOR.HIGH} stopOpacity={colors.isDark ? '0.3' : '0.2'} />
                <stop offset="100%" stopColor={RISK_COLOR.HIGH} stopOpacity="0" />
              </linearGradient>
              <linearGradient id="grad-p1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={RISK_COLOR.LOW} stopOpacity={colors.isDark ? '0.2' : '0.15'} />
                <stop offset="100%" stopColor={RISK_COLOR.LOW} stopOpacity="0" />
              </linearGradient>
            </defs>
            {/* Y axis guide lines */}
            {[2, 4, 6, 8].map((v) => (
              <g key={v}>
                <line x1="40" y1={sparkY(v, 80)} x2="700" y2={sparkY(v, 80)} stroke={colors.borderPrimary} strokeWidth="0.8" />
                <text x="36" y={sparkY(v, 80) + 3} textAnchor="end" fontSize="8" fontFamily="IBM Plex Mono, monospace" fill={colors.coordFill}>{v}°</text>
              </g>
            ))}
            {/* Date labels */}
            {TREND_DATA.map((d, i) => (
              <text key={i} x={40 + (i / (TREND_DATA.length - 1)) * 650} y="88" textAnchor="middle" fontSize="8" fontFamily="IBM Plex Mono, monospace" fill={colors.coordFill}>
                {d.date}
              </text>
            ))}
            {/* Panel 2 area fill */}
            <polygon
              points={`40,${sparkY(TREND_DATA[0].p2, 80)} ` + TREND_DATA.map((d, i) => `${40 + (i / (TREND_DATA.length - 1)) * 650},${sparkY(d.p2, 80)}`).join(' ') + ` ${40 + 650},80 40,80`}
              fill="url(#grad-p2)"
            />
            {/* Panel 1 area fill */}
            <polygon
              points={`40,${sparkY(TREND_DATA[0].p1, 80)} ` + TREND_DATA.map((d, i) => `${40 + (i / (TREND_DATA.length - 1)) * 650},${sparkY(d.p1, 80)}`).join(' ') + ` ${40 + 650},80 40,80`}
              fill="url(#grad-p1)"
            />
            {/* Panel 2 line */}
            <polyline
              points={TREND_DATA.map((d, i) => `${40 + (i / (TREND_DATA.length - 1)) * 650},${sparkY(d.p2, 80)}`).join(' ')}
              fill="none" stroke={RISK_COLOR.HIGH} strokeWidth="2"
            />
            {/* Panel 1 line */}
            <polyline
              points={TREND_DATA.map((d, i) => `${40 + (i / (TREND_DATA.length - 1)) * 650},${sparkY(d.p1, 80)}`).join(' ')}
              fill="none" stroke={RISK_COLOR.LOW} strokeWidth="2"
            />
            {/* Data points */}
            {TREND_DATA.map((d, i) => (
              <g key={i}>
                <circle cx={40 + (i / (TREND_DATA.length - 1)) * 650} cy={sparkY(d.p2, 80)} r="3.5" fill={RISK_COLOR.HIGH} />
                <circle cx={40 + (i / (TREND_DATA.length - 1)) * 650} cy={sparkY(d.p1, 80)} r="3.5" fill={RISK_COLOR.LOW} />
              </g>
            ))}
          </svg>
        </div>

        {/* Recent reports table */}
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', background: colors.bgCanvas }}>
          <div style={{ padding: '12px 16px', borderBottom: `1px solid ${colors.borderPrimary}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: colors.bgCardSubtle }}>
            <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '13px', fontWeight: 700, color: colors.accent }}>
              Recent Reports
            </p>
            <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '10px', color: colors.textMuted }}>
              {RECENT_REPORTS.length} reports available
            </span>
          </div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['Report ID', 'Type', 'Panel', 'Date', 'Size', 'Action'].map(h => (
                    <th key={h} style={hcell}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {RECENT_REPORTS.map((r, idx) => (
                  <tr
                    key={r.id}
                    style={{
                      cursor: 'pointer',
                      background: idx % 2 === 1 ? colors.tableRowHover : colors.bgCard,
                      borderBottom: `1px solid ${colors.borderPrimary}`,
                    }}
                  >
                    <td style={cell}>{r.id}</td>
                    <td style={{ ...cell, color: colors.textPrimary, fontWeight: 600 }}>{r.type}</td>
                    <td style={cell}>{r.panel}</td>
                    <td style={cell}>{r.date}</td>
                    <td style={cell}>{r.size}</td>
                    <td style={{ ...cell, display: 'flex', gap: '6px' }}>
                      <button style={{
                        fontFamily: 'IBM Plex Mono, monospace', fontSize: '10px', fontWeight: 600,
                        color: colors.accent, border: `1px solid ${colors.accentBorder}`,
                        padding: '3px 8px', borderRadius: '3px', background: colors.accentBg, cursor: 'pointer',
                      }}>
                        Download ↓
                      </button>
                      <button style={{
                        fontFamily: 'IBM Plex Mono, monospace', fontSize: '10px',
                        color: colors.textMuted, border: `1px solid ${colors.borderSubtle}`,
                        padding: '3px 8px', borderRadius: '3px', background: 'transparent', cursor: 'pointer',
                      }}>
                        Preview
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
