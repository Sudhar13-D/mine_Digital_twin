import { useState, useEffect } from 'react'
import type { SensorNode } from '../types'
import { useTheme } from '../context/ThemeContext'

// Geological strata (depth from surface in SVG pixels, surface starts at y=22 in the drawing area)
const STRATA = [
  { label: 'Topsoil', from: 0, to: 16, fillDark: '#334155', fillLight: '#CBD5E1' },
  { label: 'Alluvium', from: 16, to: 40, fillDark: '#1E293B', fillLight: '#94A3B8' },
  { label: 'Sandstone', from: 40, to: 82, fillDark: '#172033', fillLight: '#64748B', striped: true },
  { label: 'Shale', from: 82, to: 108, fillDark: '#0F172A', fillLight: '#475569' },
  { label: 'Coal Seam', from: 108, to: 138, fillDark: '#070B12', fillLight: '#1E293B' },
  { label: 'Mudstone', from: 138, to: 178, fillDark: '#131C2E', fillLight: '#334155' },
]

// Pillars: x is their SVG x position (content starts at x=32, runs 768px wide)
const PILLARS = [
  { id: 3,  x: 147, panel: 'Panel 1', risk: 'LOW' },
  { id: 4,  x: 247, panel: 'Panel 1', risk: 'LOW' },
  { id: 12, x: 362, panel: 'Panel 2', risk: 'HIGH' },
  { id: 13, x: 460, panel: 'Panel 2', risk: 'HIGH' },
  { id: 14, x: 538, panel: 'Panel 2', risk: 'HIGH' },
  { id: 15, x: 638, panel: 'Panel 2', risk: 'HIGH' },
]

// Content area: x=32..800, y=22..200 (depth 0..178px)
const CX = 32     // content x start
const CW = 768    // content width
const SY = 22     // surface y (top of strata)

interface Props {
  nodes: SensorNode[]
  selectedNode: number | null
  activePanel: string
}

export default function CrossSection({ nodes, selectedNode, activePanel }: Props) {
  const { colors } = useTheme()
  const [expanded, setExpanded] = useState(false)
  const [sagAmt, setSagAmt] = useState(0)

  const RISK_COLOR: Record<string, string> = {
    LOW: colors.riskLow,
    MEDIUM: colors.riskMedium,
    HIGH: colors.riskHigh,
  }

  function pillarColor(risk: string) { return RISK_COLOR[risk] ?? RISK_COLOR.LOW }

  const hasHigh = nodes.some(n => n.risk === 'HIGH' && (activePanel === 'All' || n.panel === activePanel))

  // Animate sag in/out
  useEffect(() => {
    const target = hasHigh ? 24 : 0
    if (sagAmt === target) return
    const dir = hasHigh ? 1 : -1
    const t = setTimeout(() => setSagAmt(p => Math.max(0, Math.min(24, p + dir))), 28)
    return () => clearTimeout(t)
  }, [sagAmt, hasHigh])

  // Compute sensor node SVG positions — filter by active panel
  const csNodes = nodes
    .filter(n => activePanel === 'All' || n.panel === activePanel)
    .map(n => ({
      ...n,
      svgX: CX + n.csX * CW,
      sagY: n.risk === 'HIGH' ? sagAmt * 0.86 : 0,
    }))

  // Surface path: flat for Panel 1 zone, sagging for Panel 2 zone
  const p2Start = CX + 0.38 * CW  // ~323
  const p2End   = CX + 0.88 * CW  // ~707
  const sagMid  = (p2Start + p2End) / 2
  const surfaceD = sagAmt < 2
    ? `M ${CX} ${SY} L ${CX + CW} ${SY} L ${CX + CW} ${SY + 16} L ${CX} ${SY + 16} Z`
    : `M ${CX} ${SY} L ${p2Start - 20} ${SY} Q ${p2Start + 30} ${SY + sagAmt * 0.4} ${sagMid} ${SY + sagAmt} Q ${p2End - 30} ${SY + sagAmt * 0.4} ${p2End + 20} ${SY} L ${CX + CW} ${SY} L ${CX + CW} ${SY + 16} Q ${p2End - 30} ${SY + 16 + sagAmt * 0.4} ${sagMid} ${SY + 16 + sagAmt} Q ${p2Start + 30} ${SY + 16 + sagAmt * 0.4} ${p2Start - 20} ${SY + 16} L ${CX} ${SY + 16} Z`

  const panelHeight = expanded ? 240 : 172

  return (
    <div
      className="flex flex-col rounded-md"
      style={{
        height: `${panelHeight}px`,
        background: colors.bgCanvas,
        border: `1px solid ${colors.borderPrimary}`,
        boxShadow: colors.shadowSm,
        transition: 'height 0.28s ease, background-color 0.2s ease, border-color 0.2s ease',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-3 py-2 shrink-0 cursor-pointer select-none"
        style={{ borderBottom: `1px solid ${colors.borderPrimary}`, background: colors.bgCardSubtle }}
        onClick={() => setExpanded(e => !e)}
      >
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold tracking-wider" style={{ fontFamily: 'Space Grotesk, sans-serif', color: colors.accent }}>
            CROSS-SECTION
          </span>
          <span className="text-[10px]" style={{ color: colors.textMuted }}>—</span>
          <span className="text-[10px]" style={{ color: colors.textMuted, fontFamily: 'IBM Plex Mono, monospace' }}>
            Geological Layers · Pillars · Subsidence
          </span>
          {hasHigh && sagAmt > 4 && (
            <span className="text-[10px] px-2 py-0.5 rounded pulse-high font-semibold" style={{ fontFamily: 'IBM Plex Mono, monospace', color: RISK_COLOR.HIGH, background: colors.isDark ? 'rgba(179,73,46,0.15)' : 'rgba(220,38,38,0.12)', border: `1px solid ${RISK_COLOR.HIGH}44` }}>
              ⚠ SUBSIDENCE ACTIVE
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px]" style={{ color: colors.textMuted, fontFamily: 'IBM Plex Mono, monospace' }}>
            0m surface → −108m coal seam
          </span>
          <span className="text-[10px] font-bold" style={{ color: colors.accent, fontFamily: 'IBM Plex Mono, monospace' }}>
            {expanded ? '▲' : '▼'}
          </span>
        </div>
      </div>

      {/* SVG Cross-section */}
      <div className="flex-1 overflow-hidden">
        <svg
          viewBox="0 0 820 200"
          className="w-full h-full"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <pattern id="cs-stripe" x="0" y="0" width="7" height="4" patternUnits="userSpaceOnUse">
              <line x1="0" y1="2" x2="7" y2="2" stroke="#9A8268" strokeWidth="0.6" opacity="0.4" />
            </pattern>
            <filter id="cs-glow">
              <feGaussianBlur stdDeviation="2" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <clipPath id="cs-clip">
              <rect x={CX} y="0" width={CW} height="200" />
            </clipPath>
          </defs>

          {/* Depth axis */}
          <g fontFamily="IBM Plex Mono, monospace" fontSize="7" fill={colors.coordFill}>
            {[0, 25, 50, 75, 100, 125, 150].map((d, i) => (
              <g key={d}>
                <line x1="28" y1={SY + i * 24} x2={CX} y2={SY + i * 24} stroke={colors.borderPrimary} strokeWidth="0.8" />
                <text x="1" y={SY + i * 24 + 3} textAnchor="start">-{d}m</text>
              </g>
            ))}
          </g>

          {/* Strata background */}
          {STRATA.map(s => (
            <g key={s.label} clipPath="url(#cs-clip)">
              <rect x={CX} y={SY + s.from} width={CW} height={s.to - s.from} fill={colors.isDark ? s.fillDark : s.fillLight} />
              {s.striped && (
                <rect x={CX} y={SY + s.from} width={CW} height={s.to - s.from} fill="url(#cs-stripe)" />
              )}
              <text
                x={CX + 6}
                y={SY + s.from + (s.to - s.from) / 2 + 3}
                fontSize="7"
                fontFamily="IBM Plex Mono, monospace"
                fontWeight="600"
                fill={colors.isDark ? 'rgba(237,230,218,0.35)' : 'rgba(15,23,42,0.45)'}
              >
                {s.label.toUpperCase()}
              </text>
            </g>
          ))}

          {/* Mined-out goaf */}
          <rect
            x={CX + 80} y={SY + 110}
            width={CW - 140} height="22"
            fill={colors.isDark ? '#080604' : '#1E1B18'}
            opacity={colors.isDark ? '0.82' : '0.90'}
            clipPath="url(#cs-clip)"
          />
          <text
            x={CX + CW / 2} y={SY + 124}
            textAnchor="middle"
            fontSize="8"
            fontWeight="600"
            fontFamily="IBM Plex Mono, monospace"
            fill="#EDE6DA"
          >
            ← MINED-OUT GOAF AREA →
          </text>

          {/* Pillars — filtered by active panel, others dimmed */}
          {PILLARS.map(p => {
            const pillarActive = activePanel === 'All' || p.panel === activePanel
            const color = pillarColor(p.risk)
            const isHigh = p.risk === 'HIGH'
            const linkedNode = nodes.find(n => n.pillarId === p.id)
            const isSelected = linkedNode && selectedNode === linkedNode.id
            return (
              <g key={p.id} opacity={pillarActive ? 1 : 0.15} style={{ transition: 'opacity 0.35s ease' }}>
                {/* Pillar body */}
                <rect
                  x={p.x - 17} y={SY + 42}
                  width="34" height={92}
                  fill={isHigh ? (colors.isDark ? '#13100C' : '#28211C') : (colors.isDark ? '#2A2420' : '#3E3630')}
                  stroke={pillarActive ? color : colors.borderSubtle}
                  strokeWidth={isSelected ? 2.2 : 0.9}
                  opacity="0.95"
                  filter={isHigh && pillarActive ? 'url(#cs-glow)' : undefined}
                />
                {/* Risk color wash */}
                <rect
                  x={p.x - 17} y={SY + 42}
                  width="34" height={92}
                  fill={color}
                  opacity={isHigh && pillarActive ? 0.22 : 0.05}
                  className={isHigh && pillarActive ? 'pulse-high' : undefined}
                />
                {/* Crack lines for HIGH risk */}
                {isHigh && pillarActive && (
                  <g opacity="0.75">
                    <path d={`M ${p.x - 7} ${SY + 50} L ${p.x - 3} ${SY + 80} L ${p.x - 9} ${SY + 116}`} fill="none" stroke={RISK_COLOR.HIGH} strokeWidth="0.9" />
                    <path d={`M ${p.x + 5} ${SY + 62} L ${p.x + 2} ${SY + 92} L ${p.x + 8} ${SY + 122}`} fill="none" stroke={RISK_COLOR.HIGH} strokeWidth="0.9" />
                  </g>
                )}
                {/* Pillar label */}
                <text
                  x={p.x} y={SY + 148}
                  textAnchor="middle"
                  fontSize="8"
                  fontWeight="600"
                  fontFamily="IBM Plex Mono, monospace"
                  fill={pillarActive ? colors.textPrimary : colors.textMuted}
                >
                  P{p.id}
                </text>
              </g>
            )
          })}

          {/* Surface layer (animated) */}
          <path
            d={surfaceD}
            fill={colors.isDark ? '#8B7660' : '#A38F79'}
            style={{ transition: 'd 0.6s ease-in-out' }}
            clipPath="url(#cs-clip)"
          />
          {/* Surface highlight line */}
          <path
            d={`M ${CX} ${SY} ${sagAmt < 2 ? `L ${CX + CW} ${SY}` : `L ${p2Start - 20} ${SY} Q ${p2Start + 30} ${SY + sagAmt * 0.4} ${(p2Start + p2End) / 2} ${SY + sagAmt} Q ${p2End - 30} ${SY + sagAmt * 0.4} ${p2End + 20} ${SY} L ${CX + CW} ${SY}`}`}
            fill="none"
            stroke={colors.accent}
            strokeWidth="1.2"
            opacity="0.8"
            style={{ transition: 'd 0.6s ease-in-out' }}
            clipPath="url(#cs-clip)"
          />

          {/* Subsidence drop indicator */}
          {sagAmt > 5 && (
            <g>
              <line
                x1={(p2Start + p2End) / 2 + 4}
                y1={SY}
                x2={(p2Start + p2End) / 2 + 4}
                y2={SY + sagAmt}
                stroke={RISK_COLOR.HIGH}
                strokeWidth="1.2"
                strokeDasharray="3,2"
              />
              <text
                x={(p2Start + p2End) / 2 + 8}
                y={SY + sagAmt * 0.5 + 4}
                fontSize="8"
                fontWeight="700"
                fontFamily="IBM Plex Mono, monospace"
                fill={RISK_COLOR.HIGH}
              >
                ↓ {(sagAmt * 0.05).toFixed(2)}m
              </text>
            </g>
          )}

          {/* Sensor nodes above surface */}
          {csNodes.map(n => {
            const col = RISK_COLOR[n.risk]
            const isSelected = selectedNode === n.id
            const nodeY = SY - 26 + n.sagY
            return (
              <g
                key={`csn-${n.id}`}
                transform={`translate(${n.svgX}, ${nodeY})`}
                style={{ transition: 'transform 0.6s ease-in-out' }}
              >
                {/* Stem to surface */}
                <line
                  x1="0" y1="0" x2="0"
                  y2={20 - n.sagY}
                  stroke={col}
                  strokeWidth="1.2"
                  opacity="0.6"
                />
                {/* Marker */}
                <circle
                  r={isSelected ? 7 : 5}
                  fill={col}
                  opacity="0.95"
                  filter={n.risk === 'HIGH' ? 'url(#cs-glow)' : undefined}
                  className={n.risk === 'HIGH' ? 'pulse-high' : undefined}
                  style={{ transition: 'r 0.12s ease' }}
                />
                {/* Label */}
                <text
                  x="0" y="-10"
                  textAnchor="middle"
                  fontSize="8"
                  fontWeight="600"
                  fontFamily="IBM Plex Mono, monospace"
                  fill={col}
                >
                  N{n.id}
                </text>
              </g>
            )
          })}

          {/* Panel labels */}
          <text x={CX + 160} y="11" textAnchor="middle" fontSize="10" fontFamily="Space Grotesk, sans-serif" fontWeight="700" fill={RISK_COLOR.LOW}>
            Panel 1
          </text>
          <text x={CX + 490} y="11" textAnchor="middle" fontSize="10" fontFamily="Space Grotesk, sans-serif" fontWeight="700" fill={RISK_COLOR.HIGH}>
            Panel 2 — HIGH RISK
          </text>

          {/* X distance axis */}
          <g fontFamily="IBM Plex Mono, monospace" fontSize="7" fill={colors.coordFill}>
            {[0, 100, 200, 300, 400, 500, 600, 700].map((d, i) => (
              <g key={d}>
                <line x1={CX + i * 96} y1="186" x2={CX + i * 96} y2="190" stroke={colors.borderPrimary} strokeWidth="1" />
                <text x={CX + i * 96} y="198" textAnchor="middle">{d}m</text>
              </g>
            ))}
            <line x1={CX} y1="188" x2={CX + CW} y2="188" stroke={colors.borderPrimary} strokeWidth="0.8" />
          </g>
        </svg>
      </div>
    </div>
  )
}
