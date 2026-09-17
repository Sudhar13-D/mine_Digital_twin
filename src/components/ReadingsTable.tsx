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

  const RISK_COLOR: Record<RiskLevel, string> = colors.isDark
    ? { LOW: '#4C8C6B', MEDIUM: '#D98E3B', HIGH: '#B3492E' }
    : { LOW: '#15803D', MEDIUM: '#B45309', HIGH: '#DC2626' }

  const RISK_BG: Record<RiskLevel, string> = colors.isDark
    ? { LOW: 'rgba(76,140,107,0.08)', MEDIUM: 'rgba(217,142,59,0.10)', HIGH: 'rgba(179,73,46,0.14)' }
    : { LOW: 'rgba(21,128,61,0.06)', MEDIUM: 'rgba(180,83,9,0.08)', HIGH: 'rgba(220,38,38,0.08)' }

  const normalTextColor = colors.isDark ? '#8A9E90' : '#334155'

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
        <button
          onClick={() => setShowFull(p => !p)}
          className="text-[10px] px-2 py-0.5 rounded transition-colors font-medium"
          style={{
            fontFamily: 'IBM Plex Mono, monospace',
            color: showFull ? colors.textPrimary : colors.accent,
            border: `1px solid ${colors.borderSubtle}`,
            background: showFull ? colors.accentBg : 'transparent',
          }}
        >
          {showFull ? '← Quick View' : 'Full Suite →'}
        </button>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full border-collapse" style={{ tableLayout: 'fixed' }}>
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
          className="hover:opacity-80 transition-opacity">
          Export CSV ↗
        </button>
      </div>
    </div>
  )
}
