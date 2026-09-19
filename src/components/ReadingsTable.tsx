import { useState } from 'react'
import type { SensorNode, RiskLevel } from '../types'
import { useTheme } from '../context/ThemeContext'

type SortKey = 'id' | 'tilt' | 'vibration' | 'ae' | 'displacement' | 'risk'
const RISK_ORDER: Record<RiskLevel, number> = { HIGH: 0, MEDIUM: 1, LOW: 2 }

interface Props {
  nodes: SensorNode[]
  selectedNode: number | null
  onSelectNode: (id: number) => void
  activePanel: string
}

function Th({ label, col, sortCol, sortAsc, onSort }: {
  label: string; col: string
  sortCol: string; sortAsc: boolean
  onSort: (c: string) => void
}) {
  const { colors } = useTheme()
  const active = sortCol === col
  return (
    <th
      className="px-2 py-2 text-left cursor-pointer select-none whitespace-nowrap"
      style={{
        fontFamily: 'IBM Plex Mono, monospace',
        fontSize: '10px',
        color: active ? colors.accent : colors.textMuted,
        fontWeight: active ? 700 : 500,
      }}
      onClick={() => onSort(col)}
    >
      {label}{active ? (sortAsc ? ' ↑' : ' ↓') : ''}
    </th>
  )
}

export default function ReadingsTable({ nodes, selectedNode, onSelectNode, activePanel }: Props) {
  const { colors } = useTheme()
  const [showFull, setShowFull] = useState(false)
  const [sortCol, setSortCol] = useState<string>('risk')
  const [sortAsc, setSortAsc] = useState(false)
  const [mobileLayout, setMobileLayout] = useState<'cards' | 'table'>('cards')

  const RISK_COLOR: Record<RiskLevel, string> = {
    LOW: colors.riskLow,
    MEDIUM: colors.riskMedium,
    HIGH: colors.riskHigh,
  }

  const RISK_BG: Record<RiskLevel, string> = {
    LOW: colors.riskLowBg,
    MEDIUM: colors.riskMediumBg,
    HIGH: colors.riskHighBg,
  }

  const normalTextColor = colors.textSecondary

  const visible = activePanel === 'All' ? nodes : nodes.filter(n => n.panel === activePanel)

  const sorted = [...visible].sort((a, b) => {
    let diff = 0
    if (sortCol === 'risk') diff = RISK_ORDER[a.risk] - RISK_ORDER[b.risk]
    else diff = ((a as unknown as Record<string, number>)[sortCol] ?? 0) - ((b as unknown as Record<string, number>)[sortCol] ?? 0)
    return sortAsc ? diff : -diff
  })

  const handleSort = (col: string) => {
    if (sortCol === col) setSortAsc(p => !p)
    else { setSortCol(col); setSortAsc(false) }
  }

  const thProps = { sortCol, sortAsc, onSort: handleSort }

  return (
    <div
      className="flex flex-col h-full rounded-md overflow-hidden"
      style={{
        background: colors.bgCanvas,
        border: `1px solid ${colors.borderPrimary}`,
        boxShadow: colors.shadowSm,
        transition: 'background-color 0.2s ease, border-color 0.2s ease',
      }}
    >
      {/* Header */}
      <div
        className="flex flex-wrap items-center justify-between px-3 py-2 shrink-0 gap-2"
        style={{
          borderBottom: `1px solid ${colors.borderPrimary}`,
          background: colors.bgCardSubtle,
        }}
      >
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold tracking-wider" style={{ fontFamily: 'Space Grotesk, sans-serif', color: colors.accent }}>
            LIVE READINGS
          </span>
          <span className="text-[10px]" style={{ color: colors.textMuted }}>—</span>
          <span className="text-[10px]" style={{ color: colors.textMuted, fontFamily: 'IBM Plex Mono, monospace' }}>
            {visible.length} sensors · {activePanel}
          </span>
          <span className="text-[10px] font-semibold" style={{ color: RISK_COLOR.LOW, fontFamily: 'IBM Plex Mono, monospace' }}>
            ⟳ 2s
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Mobile view toggle: Cards vs Table */}
          <div className="flex sm:hidden rounded p-0.5" style={{ background: colors.inputBg, border: `1px solid ${colors.borderSubtle}` }}>
            <button
              onClick={() => setMobileLayout('cards')}
              className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold transition-all cursor-pointer"
              style={{
                background: mobileLayout === 'cards' ? colors.accent : 'transparent',
                color: mobileLayout === 'cards' ? '#FFFFFF' : colors.textMuted,
              }}
            >
              Cards
            </button>
            <button
              onClick={() => setMobileLayout('table')}
              className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold transition-all cursor-pointer"
              style={{
                background: mobileLayout === 'table' ? colors.accent : 'transparent',
                color: mobileLayout === 'table' ? '#FFFFFF' : colors.textMuted,
              }}
            >
              Table
            </button>
          </div>

          <button
            onClick={() => setShowFull(p => !p)}
            className="text-[10px] px-2 py-0.5 rounded transition-colors font-medium cursor-pointer"
            style={{
              fontFamily: 'IBM Plex Mono, monospace',
              color: showFull ? colors.textPrimary : colors.accent,
              border: `1px solid ${colors.borderSubtle}`,
              background: showFull ? colors.accentBg : 'transparent',
            }}
          >
            {showFull ? '← Quick' : 'Full Suite →'}
          </button>
        </div>
      </div>

      {/* MOBILE CARDS VIEW (When on small screens & cards mode) */}
      <div className={`sm:hidden flex-1 overflow-y-auto p-2.5 space-y-2.5 ${mobileLayout === 'cards' ? 'block' : 'hidden'}`}>
        <div className="flex items-center justify-between pb-1 text-[10px] font-mono" style={{ color: colors.textMuted }}>
          <span>Tap sensor card to inspect details</span>
          <button
            onClick={() => handleSort('risk')}
            className="font-semibold underline cursor-pointer"
            style={{ color: colors.accent }}
          >
            Sort by Risk {sortCol === 'risk' ? (sortAsc ? '↑' : '↓') : ''}
          </button>
        </div>

        {sorted.map((node) => {
          const isSelected = selectedNode === node.id
          const isHigh = node.risk === 'HIGH'
          const col = RISK_COLOR[node.risk]
          const bg = RISK_BG[node.risk]

          return (
            <div
              key={node.id}
              onClick={() => onSelectNode(node.id)}
              className={`p-3 rounded-lg border transition-all cursor-pointer ${isSelected ? 'ring-2' : ''}`}
              style={{
                background: isSelected ? colors.tableRowSelected : colors.bgCard,
                borderColor: isSelected ? colors.accent : `${col}44`,
                boxShadow: colors.shadowSm,
              }}
            >
              {/* Card top row */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span style={{ color: node.status === 'online' ? RISK_COLOR.LOW : RISK_COLOR.HIGH, fontSize: '11px' }}>
                    {node.status === 'online' ? '●' : '○'}
                  </span>
                  <span className="font-mono font-bold text-xs" style={{ color: isSelected ? colors.accent : colors.textPrimary }}>
                    {node.label}
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded" style={{ background: colors.bgCardSubtle, color: colors.textMuted }}>
                    {node.panel}
                  </span>
                </div>
                <span
                  className={isHigh ? 'pulse-high' : undefined}
                  style={{
                    fontFamily: 'IBM Plex Mono, monospace',
                    fontSize: '10px',
                    fontWeight: 700,
                    color: col,
                    background: bg,
                    border: `1px solid ${col}44`,
                    padding: '2px 8px',
                    borderRadius: '4px',
                  }}
                >
                  {node.risk} RISK
                </span>
              </div>

              {/* Card metrics grid */}
              <div className="grid grid-cols-4 gap-1.5 text-center font-mono">
                <div className="p-1.5 rounded" style={{ background: colors.bgCardSubtle, border: `1px solid ${colors.borderDivider}` }}>
                  <span className="block text-[8px] text-slate-400">TILT</span>
                  <span
                    className="text-xs font-semibold"
                    style={{
                      color: node.tilt != null && Math.abs(Number(node.tilt)) > 5 ? RISK_COLOR.HIGH : Math.abs(Number(node.tilt || 0)) > 2 ? RISK_COLOR.MEDIUM : normalTextColor,
                    }}
                  >
                    {node.tilt != null ? `${Number(node.tilt) > 0 ? '+' : ''}${Number(node.tilt).toFixed(2)}°` : '—'}
                  </span>
                </div>

                <div className="p-1.5 rounded" style={{ background: colors.bgCardSubtle, border: `1px solid ${colors.borderDivider}` }}>
                  <span className="block text-[8px] text-slate-400">VIB (g)</span>
                  <span
                    className="text-xs font-semibold"
                    style={{
                      color: node.vibration != null && Number(node.vibration) > 1.5 ? RISK_COLOR.HIGH : Number(node.vibration || 0) > 0.5 ? RISK_COLOR.MEDIUM : normalTextColor,
                    }}
                  >
                    {node.vibration != null ? Number(node.vibration).toFixed(2) : '—'}
                  </span>
                </div>

                <div className="p-1.5 rounded" style={{ background: colors.bgCardSubtle, border: `1px solid ${colors.borderDivider}` }}>
                  <span className="block text-[8px] text-slate-400">AE (Ev/m)</span>
                  <span
                    className="text-xs font-semibold"
                    style={{
                      color: node.ae != null && Number(node.ae) > 80 ? RISK_COLOR.HIGH : Number(node.ae || 0) > 20 ? RISK_COLOR.MEDIUM : normalTextColor,
                    }}
                  >
                    {node.ae != null ? node.ae : '—'}
                  </span>
                </div>

                <div className="p-1.5 rounded" style={{ background: colors.bgCardSubtle, border: `1px solid ${colors.borderDivider}` }}>
                  <span className="block text-[8px] text-slate-400">DISP</span>
                  <span
                    className="text-xs font-semibold"
                    style={{
                      color: node.displacement != null && Number(node.displacement) > 25 ? RISK_COLOR.HIGH : Number(node.displacement || 0) > 8 ? RISK_COLOR.MEDIUM : normalTextColor,
                    }}
                  >
                    {node.displacement != null ? `+${node.displacement}mm` : '—'}
                  </span>
                </div>
              </div>

              {/* Extended telemetry if Full Suite active */}
              {showFull && (
                <div className="grid grid-cols-4 gap-1.5 text-center font-mono mt-1.5 pt-1.5 border-t border-dashed" style={{ borderColor: colors.borderDivider }}>
                  <div>
                    <span className="block text-[8px] text-slate-400">MOIST</span>
                    <span className="text-[11px] font-semibold" style={{ color: normalTextColor }}>{node.soilMoisture != null ? `${node.soilMoisture}%` : '—'}</span>
                  </div>
                  <div>
                    <span className="block text-[8px] text-slate-400">TEMP</span>
                    <span className="text-[11px] font-semibold" style={{ color: normalTextColor }}>{node.temp != null ? `${node.temp}°C` : '—'}</span>
                  </div>
                  <div>
                    <span className="block text-[8px] text-slate-400">UWB</span>
                    <span className="text-[11px] font-semibold" style={{ color: normalTextColor }}>{node.uwb != null ? `${node.uwb}mm` : '—'}</span>
                  </div>
                  <div>
                    <span className="block text-[8px] text-slate-400">CRACK</span>
                    <span className="text-[11px] font-semibold" style={{ color: node.crack && Number(node.crack) > 1.5 ? RISK_COLOR.MEDIUM : normalTextColor }}>
                      {node.crack != null ? `${Number(node.crack).toFixed(1)}mm` : '—'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* SPREADSHEET TABLE VIEW (Desktop default or Mobile Table mode) */}
      <div className={`flex-1 overflow-x-auto overflow-y-auto ${mobileLayout === 'table' ? 'block' : 'hidden sm:block'}`}>
        <table className="w-full border-collapse" style={{ tableLayout: 'fixed', minWidth: showFull ? '640px' : '440px' }}>
          <colgroup>
            <col style={{ width: '58px' }} />
            <col style={{ width: '64px' }} />
            <col style={{ width: '60px' }} />
            <col style={{ width: '48px' }} />
            <col style={{ width: '64px' }} />
            {showFull && <>
              <col style={{ width: '58px' }} />
              <col style={{ width: '50px' }} />
              <col style={{ width: '54px' }} />
              <col style={{ width: '52px' }} />
            </>}
            <col style={{ width: '68px' }} />
          </colgroup>
          <thead>
            <tr style={{ background: colors.tableHeaderBg, borderBottom: `1px solid ${colors.tableBorder}`, position: 'sticky', top: 0, zIndex: 1 }}>
              <Th label="Node" col="id" {...thProps} />
              <Th label="Tilt (°)" col="tilt" {...thProps} />
              <Th label="Vibr (g)" col="vibration" {...thProps} />
              <Th label="AE" col="ae" {...thProps} />
              <Th label="Disp." col="displacement" {...thProps} />
              {showFull && <>
                <Th label="Moist%" col="soilMoisture" {...thProps} />
                <Th label="Temp" col="temp" {...thProps} />
                <Th label="UWB" col="uwb" {...thProps} />
                <Th label="Crack" col="crack" {...thProps} />
              </>}
              <Th label="Risk" col="risk" {...thProps} />
            </tr>
          </thead>
          <tbody>
            {sorted.map((node, idx) => {
              const isSelected = selectedNode === node.id
              const isHigh = node.risk === 'HIGH'
              const col = RISK_COLOR[node.risk]
              const baseBg = isSelected ? colors.tableRowSelected : isHigh ? RISK_BG.HIGH : (idx % 2 === 1 ? colors.tableRowHover : colors.bgCard)

              return (
                <tr
                  key={node.id}
                  onClick={() => onSelectNode(node.id)}
                  style={{
                    background: baseBg,
                    borderLeft: isSelected ? `3px solid ${colors.accent}` : `3px solid ${col}44`,
                    cursor: 'pointer',
                    borderBottom: `1px solid ${colors.tableBorder}`,
                    transition: 'background-color 0.1s ease',
                  }}
                >
                  {/* Node ID */}
                  <td className="px-2 py-2">
                    <div className="flex items-center gap-1.5">
                      <span style={{ color: node.status === 'online' ? RISK_COLOR.LOW : RISK_COLOR.HIGH, fontSize: '10px' }}>
                        {node.status === 'online' ? '✓' : '✗'}
                      </span>
                      <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '11px', fontWeight: 600, color: isSelected ? colors.accent : colors.textPrimary }}>
                        N{node.id}
                      </span>
                    </div>
                  </td>
                  {/* Tilt */}
                  <td className="px-2 py-2">
                    <span style={{
                      fontFamily: 'IBM Plex Mono, monospace', fontSize: '11px',
                      color: node.tilt != null ? (Math.abs(Number(node.tilt)) > 5 ? RISK_COLOR.HIGH : Math.abs(Number(node.tilt)) > 2 ? RISK_COLOR.MEDIUM : normalTextColor) : colors.textMuted,
                      fontWeight: Math.abs(Number(node.tilt ?? 0)) > 2 ? 600 : 400,
                    }}>
                      {node.tilt != null ? `${Number(node.tilt) > 0 ? '+' : ''}${Number(node.tilt).toFixed(2)}°` : '—'}
                    </span>
                  </td>
                  {/* Vibration */}
                  <td className="px-2 py-2">
                    <span style={{
                      fontFamily: 'IBM Plex Mono, monospace', fontSize: '11px',
                      color: node.vibration != null ? (Number(node.vibration) > 1.5 ? RISK_COLOR.HIGH : Number(node.vibration) > 0.5 ? RISK_COLOR.MEDIUM : normalTextColor) : colors.textMuted,
                      fontWeight: Number(node.vibration ?? 0) > 0.5 ? 600 : 400,
                    }}>
                      {node.vibration != null ? Number(node.vibration).toFixed(2) : '—'}
                    </span>
                  </td>
                  {/* AE */}
                  <td className="px-2 py-2">
                    <span style={{
                      fontFamily: 'IBM Plex Mono, monospace', fontSize: '11px',
                      color: node.ae != null ? (Number(node.ae) > 80 ? RISK_COLOR.HIGH : Number(node.ae) > 20 ? RISK_COLOR.MEDIUM : normalTextColor) : colors.textMuted,
                      fontWeight: Number(node.ae ?? 0) > 20 ? 600 : 400,
                    }}>
                      {node.ae != null ? node.ae : '—'}
                    </span>
                  </td>
                  {/* Displacement */}
                  <td className="px-2 py-2">
                    <span style={{
                      fontFamily: 'IBM Plex Mono, monospace', fontSize: '11px',
                      color: node.displacement != null ? (Number(node.displacement) > 25 ? RISK_COLOR.HIGH : Number(node.displacement) > 8 ? RISK_COLOR.MEDIUM : normalTextColor) : colors.textMuted,
                      fontWeight: Number(node.displacement ?? 0) > 8 ? 600 : 400,
                    }}>
                      {node.displacement != null ? `+${node.displacement}mm` : '—'}
                    </span>
                  </td>
                  {/* Full suite columns */}
                  {showFull && <>
                    <td className="px-2 py-2">
                      <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '11px', color: node.soilMoisture != null ? normalTextColor : colors.textMuted }}>
                        {node.soilMoisture != null ? `${node.soilMoisture}%` : '—'}
                      </span>
                    </td>
                    <td className="px-2 py-2">
                      <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '11px', color: node.temp != null ? normalTextColor : colors.textMuted }}>
                        {node.temp != null ? `${node.temp}°C` : '—'}
                      </span>
                    </td>
                    <td className="px-2 py-2">
                      <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '11px', color: node.uwb != null ? normalTextColor : colors.textMuted }}>
                        {node.uwb != null ? `${node.uwb}mm` : '—'}
                      </span>
                    </td>
                    <td className="px-2 py-2">
                      <span style={{
                        fontFamily: 'IBM Plex Mono, monospace', fontSize: '11px',
                        color: node.crack != null ? (Number(node.crack) > 1.5 ? RISK_COLOR.MEDIUM : normalTextColor) : colors.textMuted,
                      }}>
                        {node.crack != null ? `${Number(node.crack).toFixed(1)}mm` : '—'}
                      </span>
                    </td>
                  </>}
                  {/* Risk badge */}
                  <td className="px-2 py-2">
                    <span
                      className={isHigh ? 'pulse-high' : undefined}
                      style={{
                        display: 'inline-block',
                        fontFamily: 'IBM Plex Mono, monospace',
                        fontSize: '10px',
                        fontWeight: 600,
                        color: col,
                        background: RISK_BG[node.risk],
                        border: `1px solid ${col}44`,
                        padding: '1px 6px',
                        borderRadius: '3px',
                      }}
                    >
                      {node.risk}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div
        className="flex items-center justify-between px-3 py-1.5 shrink-0"
        style={{
          borderTop: `1px solid ${colors.borderPrimary}`,
          background: colors.bgCardSubtle,
        }}
      >
        <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '10px', color: colors.textMuted }}>
          Updated 2s ago · Auto-refresh ON
        </span>
        <button style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '10px', color: colors.textSecondary }}
          className="hover:opacity-80 transition-opacity cursor-pointer">
          Export CSV ↗
        </button>
      </div>
    </div>
  )
}
