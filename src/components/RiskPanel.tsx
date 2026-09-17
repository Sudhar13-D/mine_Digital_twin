import { useState } from 'react'
import type { SensorNode, Alert, RiskLevel } from '../types'
import { useTheme } from '../context/ThemeContext'

interface Props {
  nodes: SensorNode[]
  alerts: Alert[]
  onAcknowledge: (id: string) => void
  activePanel: string
}

export default function RiskPanel({ nodes, alerts, onAcknowledge, activePanel }: Props) {
  const { colors } = useTheme()
  const [escalateTarget, setEscalateTarget] = useState<string | null>(null)

  const RISK_COLOR: Record<RiskLevel, string> = colors.isDark
    ? { LOW: '#4C8C6B', MEDIUM: '#D98E3B', HIGH: '#B3492E' }
    : { LOW: '#15803D', MEDIUM: '#B45309', HIGH: '#DC2626' }

  const RISK_BG: Record<RiskLevel, string> = colors.isDark
    ? { LOW: 'rgba(76,140,107,0.10)', MEDIUM: 'rgba(217,142,59,0.12)', HIGH: 'rgba(179,73,46,0.15)' }
    : { LOW: 'rgba(21,128,61,0.07)', MEDIUM: 'rgba(180,83,9,0.08)', HIGH: 'rgba(220,38,38,0.08)' }

  const RISK_BORDER: Record<RiskLevel, string> = colors.isDark
    ? { LOW: 'rgba(76,140,107,0.25)', MEDIUM: 'rgba(217,142,59,0.25)', HIGH: 'rgba(179,73,46,0.30)' }
    : { LOW: 'rgba(21,128,61,0.25)', MEDIUM: 'rgba(180,83,9,0.25)', HIGH: 'rgba(220,38,38,0.25)' }

  const panelNodes = activePanel === 'All' ? nodes : nodes.filter(n => n.panel === activePanel)
  const panelAlerts = activePanel === 'All' ? alerts : alerts.filter(a => a.panel === activePanel)
  const activeAlerts = panelAlerts.filter(a => a.status === 'active')

  const highCount = panelNodes.filter(n => n.risk === 'HIGH').length
  const overallRisk: RiskLevel = highCount > 0 ? 'HIGH' : panelNodes.some(n => n.risk === 'MEDIUM') ? 'MEDIUM' : 'LOW'
  const topNode = [...panelNodes].sort((a, b) => b.anomalyScore - a.anomalyScore)[0]

  return (
    <div
      className="flex flex-col h-full rounded-md"
      style={{
        background: colors.bgCanvas,
        border: `1px solid ${colors.borderPrimary}`,
        boxShadow: colors.shadowSm,
        transition: 'background-color 0.2s ease, border-color 0.2s ease',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-3 py-2 shrink-0"
        style={{
          borderBottom: `1px solid ${colors.borderPrimary}`,
          background: colors.bgCardSubtle,
        }}
      >
        <span className="text-[11px] font-bold tracking-wider" style={{ fontFamily: 'Space Grotesk, sans-serif', color: colors.accent }}>
          RISK & AI/ML OUTPUT
        </span>
        {activeAlerts.length > 0 && (
          <span
            className="text-[10px] px-2 py-0.5 rounded pulse-high font-semibold"
            style={{
              fontFamily: 'IBM Plex Mono, monospace',
              color: RISK_COLOR.HIGH,
              background: colors.isDark ? 'rgba(179,73,46,0.15)' : 'rgba(220,38,38,0.10)',
              border: `1px solid ${RISK_BORDER.HIGH}`,
            }}
          >
            {activeAlerts.length} ACTIVE ALERT{activeAlerts.length > 1 ? 'S' : ''}
          </span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-3">

        {/* Overall risk card */}
        <div
          className={overallRisk === 'HIGH' ? 'pulse-high' : undefined}
          style={{
            background: RISK_BG[overallRisk],
            border: `1px solid ${RISK_BORDER[overallRisk]}`,
            borderRadius: '6px',
            padding: '10px 12px',
          }}
        >
          <div className="flex items-start justify-between mb-2">
            <div>
              <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '10px', color: colors.textMuted, marginBottom: '2px' }}>
                {activePanel.toUpperCase()} RISK SUMMARY
              </p>
              <div className="flex items-center gap-2">
                <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '22px', fontWeight: 700, color: RISK_COLOR[overallRisk] }}>
                  {overallRisk}
                </span>
                <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '10px', fontWeight: 600, color: RISK_COLOR.MEDIUM }}>
                  ↗ RISING (6h)
                </span>
              </div>
            </div>
            <div className="text-right">
              <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '9px', color: colors.textMuted }}>LSTM ANOMALY</p>
              <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '24px', fontWeight: 700, color: RISK_COLOR[overallRisk], lineHeight: 1 }}>
                {topNode?.anomalyScore != null ? Number(topNode.anomalyScore).toFixed(2) : '—'}
              </p>
            </div>
          </div>

          {/* Anomaly bar */}
          <div style={{ height: '5px', background: colors.isDark ? '#1A1714' : '#E2E8F0', borderRadius: '999px', overflow: 'hidden', marginBottom: '8px' }}>
            <div
              style={{
                height: '100%',
                width: `${(topNode?.anomalyScore ?? 0) * 100}%`,
                background: `linear-gradient(90deg, ${RISK_COLOR.LOW} 0%, ${RISK_COLOR.MEDIUM} 55%, ${RISK_COLOR.HIGH} 100%)`,
                borderRadius: '999px',
                transition: 'width 1s ease',
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 12px' }}>
            {[
              ['Model', 'LSTM v2.4'],
              ['Confidence', `${topNode?.confidence ?? 0}%`],
              ['Horizon', `${topNode?.predictionDays ?? 0} days`],
              ['Failure risk', '73% / 3d'],
            ].map(([k, v]) => (
              <div key={k}>
                <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '10px', color: colors.textMuted }}>{k}: </span>
                <span style={{
                  fontFamily: 'IBM Plex Mono, monospace',
                  fontSize: '10px',
                  fontWeight: 600,
                  color: k === 'Horizon' || k === 'Failure risk' ? RISK_COLOR.HIGH : colors.textPrimary
                }}>
                  {v}
                </span>
              </div>
            ))}
          </div>
          {topNode && (
            <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '9px', color: colors.textMuted, marginTop: '6px' }}>
              Critical: Node {topNode.id} · Pillar P{topNode.pillarId} · {topNode.panel}
            </p>
          )}
        </div>

        {/* Per-node anomaly scores */}
        <div>
          <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '10px', fontWeight: 700, color: colors.textMuted, letterSpacing: '0.08em', marginBottom: '8px' }}>
            PER-NODE ANOMALY SCORES
          </p>
          <div className="flex flex-col gap-2">
            {[...panelNodes].sort((a, b) => (b.anomalyScore ?? 0) - (a.anomalyScore ?? 0)).map(n => (
              <div key={n.id} className="flex items-center gap-2">
                <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '10px', fontWeight: 600, color: RISK_COLOR[n.risk], width: '44px', flexShrink: 0 }}>
                  N{n.id}
                </span>
                <div style={{ flex: 1, height: '4px', background: colors.isDark ? '#1A1714' : '#E2E8F0', borderRadius: '999px', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${(n.anomalyScore ?? 0) * 100}%`,
                      background: RISK_COLOR[n.risk],
                      borderRadius: '999px',
                      transition: 'width 0.8s ease',
                    }}
                  />
                </div>
                <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '10px', fontWeight: 600, color: RISK_COLOR[n.risk], width: '32px', textAlign: 'right', flexShrink: 0 }}>
                  {Number(n.anomalyScore ?? 0).toFixed(2)}
                </span>
                <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '9px', color: colors.textMuted, width: '28px', textAlign: 'right', flexShrink: 0 }}>
                  {n.predictionDays ?? 0}d
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Alert log */}
        <div>
          <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '10px', fontWeight: 700, color: colors.textMuted, letterSpacing: '0.08em', marginBottom: '8px' }}>
            ALERTS — LAST 24H
          </p>
          <div className="flex flex-col gap-2">
            {panelAlerts.map(alert => (
              <div
                key={alert.id}
                style={{
                  background: RISK_BG[alert.level],
                  border: `1px solid ${RISK_BORDER[alert.level]}`,
                  borderRadius: '6px',
                  padding: '8px 10px',
                  opacity: alert.status === 'resolved' ? 0.6 : 1,
                }}
              >
                <div className="flex items-start justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <span
                      style={{
                        fontFamily: 'IBM Plex Mono, monospace', fontSize: '10px', fontWeight: 700,
                        color: RISK_COLOR[alert.level],
                      }}
                      className={alert.status === 'active' && alert.level === 'HIGH' ? 'pulse-high' : undefined}
                    >
                      [{alert.level}]
                    </span>
                    <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '10px', color: colors.textMuted }}>
                      {alert.timestamp} · {alert.panel}
                    </span>
                  </div>
                  <span style={{
                    fontFamily: 'IBM Plex Mono, monospace', fontSize: '9px', fontWeight: 600,
                    color: alert.status === 'active' ? RISK_COLOR.HIGH : alert.status === 'acknowledged' ? RISK_COLOR.MEDIUM : RISK_COLOR.LOW,
                  }}>
                    {alert.status === 'active' ? '● Active' : alert.status === 'acknowledged' ? '◑ Ack' : '✓ Resolved'}
                  </span>
                </div>

                <p style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '10px', color: colors.textSecondary, lineHeight: 1.45, marginBottom: '6px' }}>
                  {alert.message}
                </p>

                <div className="flex items-center justify-between">
                  <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '9px', color: colors.textMuted }}>
                    Nodes: {(alert.nodeIds || []).map(i => `N${i}`).join(', ')}
                  </span>
                  {alert.acknowledgedBy && (
                    <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '9px', color: colors.textMuted }}>
                      By: {alert.acknowledgedBy}
                    </span>
                  )}
                </div>

                {alert.status === 'active' && (
                  <div className="flex gap-1.5 mt-2">
                    <button
                      onClick={() => onAcknowledge(alert.id)}
                      style={{
                        fontFamily: 'IBM Plex Mono, monospace', fontSize: '10px',
                        color: RISK_COLOR.MEDIUM,
                        border: `1px solid ${RISK_COLOR.MEDIUM}44`,
                        padding: '2px 8px',
                        borderRadius: '3px',
                        background: colors.isDark ? 'rgba(217,142,59,0.06)' : 'rgba(180,83,9,0.06)',
                        cursor: 'pointer',
                      }}
                    >
                      Acknowledge
                    </button>
                    <button
                      onClick={() => setEscalateTarget(escalateTarget === alert.id ? null : alert.id)}
                      style={{
                        fontFamily: 'IBM Plex Mono, monospace', fontSize: '10px',
                        color: RISK_COLOR.HIGH,
                        border: `1px solid ${RISK_COLOR.HIGH}44`,
                        padding: '2px 8px',
                        borderRadius: '3px',
                        background: colors.isDark ? 'rgba(179,73,46,0.06)' : 'rgba(220,38,38,0.06)',
                        cursor: 'pointer',
                      }}
                    >
                      Escalate ↗
                    </button>
                  </div>
                )}

                {/* Escalation dialog */}
                {escalateTarget === alert.id && (
                  <div className="mt-2 p-2 rounded" style={{ background: colors.bgCardSubtle, border: `1px solid ${colors.borderSubtle}` }}>
                    <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '10px', fontWeight: 600, color: colors.accent, marginBottom: '6px' }}>
                      Escalate to:
                    </p>
                    {['Mine Manager', 'Safety Officer', 'Regional Director'].map(r => (
                      <button
                        key={r}
                        onClick={() => setEscalateTarget(null)}
                        style={{
                          display: 'block', width: '100%', textAlign: 'left',
                          fontFamily: 'IBM Plex Mono, monospace', fontSize: '10px',
                          color: colors.textSecondary, padding: '3px 6px',
                          borderRadius: '2px',
                          cursor: 'pointer',
                          background: 'transparent',
                          border: 'none',
                        }}
                        className="hover:opacity-80 transition-opacity"
                      >
                        → {r}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {panelAlerts.length === 0 && (
              <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '11px', color: RISK_COLOR.LOW, textAlign: 'center', padding: '12px 0' }}>
                ✓ No alerts in last 24h
              </p>
            )}
          </div>
        </div>

        {/* View full history link */}
        <button style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '10px', color: colors.textMuted, textAlign: 'left' }}
          className="hover:opacity-80 transition-opacity">
          View full alert history (30d) →
        </button>
      </div>
    </div>
  )
}
