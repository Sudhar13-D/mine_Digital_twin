import React from 'react'

export default function SensoraHeroGraphic() {
  return (
    <div className="relative w-full max-w-xl mx-auto lg:max-w-none">
      {/* Outer ambient glow */}
      <div className="absolute -inset-2 bg-gradient-to-r from-orange-500/20 via-amber-500/10 to-cyan-500/20 rounded-2xl blur-xl opacity-70"></div>

      {/* Main Glassmorphism Display Container */}
      <div className="relative rounded-2xl bg-slate-900/85 backdrop-blur-md border border-slate-700/60 shadow-2xl p-4 sm:p-6 overflow-hidden">
        {/* Top Header bar with status badge */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-mono text-emerald-400 font-semibold uppercase tracking-wider">
              Telemetry Mesh Active
            </span>
          </div>
          <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
            <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-orange-400 font-medium">
              NODE01 (Real Hardware)
            </span>
            <span className="hidden sm:inline text-slate-500">LoRa 868MHz</span>
          </div>
        </div>

        {/* Interactive Architecture SVG Diagram */}
        <div className="relative aspect-[16/10] w-full rounded-xl bg-slate-950/70 border border-slate-800/80 p-2 sm:p-3 overflow-hidden">
          {/* Subtle Grid Background */}
          <div 
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage: `linear-gradient(to right, #334155 1px, transparent 1px), linear-gradient(to bottom, #334155 1px, transparent 1px)`,
              backgroundSize: '24px 24px'
            }}
          />

          <svg className="w-full h-full" viewBox="0 0 520 320" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="strataGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#334155" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#1E293B" stopOpacity="0.8" />
              </linearGradient>
              <linearGradient id="beamGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#EA580C" />
                <stop offset="100%" stopColor="#0284C7" />
              </linearGradient>
              <linearGradient id="orangeGlow" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#F97316" />
                <stop offset="100%" stopColor="#EA580C" />
              </linearGradient>
            </defs>

            {/* Geological Strata Layers Background (Surface to -120m Coal Seam) */}
            <rect x="15" y="25" width="490" height="280" rx="8" fill="url(#strataGrad)" stroke="#475569" strokeWidth="1" strokeDasharray="3 3" />
            
            {/* Depth indicators */}
            <text x="25" y="45" fill="#94A3B8" fontSize="10" fontFamily="monospace">0m Surface Level</text>
            <text x="25" y="145" fill="#64748B" fontSize="9" fontFamily="monospace">-65m Sandstone Layer</text>
            <text x="25" y="245" fill="#F97316" fontSize="9" fontFamily="monospace" fontWeight="bold">-108m Coal Seam (Active Panel 1)</text>

            {/* Strata division lines */}
            <line x1="25" y1="52" x2="495" y2="52" stroke="#64748B" strokeWidth="1" strokeOpacity="0.3" />
            <line x1="25" y1="152" x2="495" y2="152" stroke="#64748B" strokeWidth="1" strokeOpacity="0.3" strokeDasharray="4 4" />
            <line x1="25" y1="230" x2="495" y2="230" stroke="#F97316" strokeWidth="1.2" strokeOpacity="0.4" />

            {/* Mine Pillars Representation */}
            <g opacity="0.85">
              {/* Pillar 1 */}
              <rect x="55" y="235" width="45" height="55" rx="3" fill="#1E293B" stroke="#F97316" strokeWidth="1.5" />
              <text x="63" y="265" fill="#CBD5E1" fontSize="9" fontFamily="monospace">Pillar 1</text>
              <circle cx="77" cy="245" r="4" fill="#10B981" />

              {/* Pillar 2 (With NODE01 Real Hardware mounted) */}
              <rect x="145" y="235" width="45" height="55" rx="3" fill="#1E293B" stroke="#EA580C" strokeWidth="2" />
              <text x="153" y="265" fill="#CBD5E1" fontSize="9" fontFamily="monospace">Pillar 2</text>
              {/* Pulsing ring around NODE01 */}
              <circle cx="167" cy="242" r="10" stroke="#F97316" strokeWidth="1.5" strokeOpacity="0.5" className="animate-ping" style={{ transformOrigin: '167px 242px' }} />
              <circle cx="167" cy="242" r="5" fill="#EA580C" />
              <text x="140" y="303" fill="#F97316" fontSize="9" fontFamily="monospace" fontWeight="bold">NODE01 (ESP32)</text>

              {/* Pillar 3 */}
              <rect x="235" y="235" width="45" height="55" rx="3" fill="#1E293B" stroke="#64748B" strokeWidth="1" />
              <text x="243" y="265" fill="#94A3B8" fontSize="9" fontFamily="monospace">Pillar 3</text>

              {/* Pillar 4 */}
              <rect x="325" y="235" width="45" height="55" rx="3" fill="#1E293B" stroke="#64748B" strokeWidth="1" />
              <text x="333" y="265" fill="#94A3B8" fontSize="9" fontFamily="monospace">Pillar 4</text>
            </g>

            {/* Wireless LoRa Signal Arcs from NODE01 to Gateway */}
            <path
              d="M167 232 C 180 180, 260 120, 310 90"
              stroke="url(#beamGrad)"
              strokeWidth="2"
              strokeDasharray="4 4"
              className="animate-pulse"
            />
            {/* Secondary wave */}
            <path
              d="M172 230 C 188 175, 268 115, 315 88"
              stroke="#38BDF8"
              strokeWidth="1.2"
              strokeOpacity="0.6"
              strokeDasharray="2 3"
            />

            {/* Subsurface LoRa Gateway (Raspberry Pi 4B) in Upper Gallery */}
            <g transform="translate(295, 60)">
              <rect width="80" height="42" rx="6" fill="#0F172A" stroke="#0284C7" strokeWidth="1.75" />
              <rect x="4" y="4" width="72" height="34" rx="4" fill="#0369A1" fillOpacity="0.15" />
              {/* Status LED */}
              <circle cx="15" cy="15" r="3" fill="#10B981" />
              <text x="24" y="18" fill="#F8FAFC" fontSize="9" fontFamily="sans-serif" fontWeight="bold">Gateway</text>
              <text x="14" y="31" fill="#7DD3FC" fontSize="8" fontFamily="monospace">RPi 4B + MQTT</text>
            </g>

            {/* Uplink to Surface Dashboard / Cloud AI */}
            <line x1="375" y1="81" x2="425" y2="81" stroke="#38BDF8" strokeWidth="2" strokeDasharray="3 3" />
            <polygon points="425,78 433,81 425,84" fill="#38BDF8" />

            {/* Cloud & AI Anomaly Engine Box */}
            <g transform="translate(390, 120)">
              <rect width="105" height="52" rx="6" fill="#0F172A" stroke="#EA580C" strokeWidth="1.5" />
              <text x="10" y="18" fill="#FB923C" fontSize="9" fontFamily="sans-serif" fontWeight="bold">Cloud & AI Engine</text>
              <text x="10" y="32" fill="#E2E8F0" fontSize="8" fontFamily="monospace">LSTM Anomaly 0.00</text>
              <text x="10" y="44" fill="#94A3B8" fontSize="8" fontFamily="monospace">Risk: LOW (Stable)</text>
            </g>

            {/* Connected Monitoring Dashboard Preview Card */}
            <g transform="translate(365, 195)">
              <rect width="135" height="85" rx="6" fill="#020617" stroke="#38BDF8" strokeWidth="1.5" />
              <rect x="0" y="0" width="135" height="18" rx="6" fill="#0F172A" />
              <circle cx="8" cy="9" r="2.5" fill="#EF4444" />
              <circle cx="16" cy="9" r="2.5" fill="#F59E0B" />
              <circle cx="24" cy="9" r="2.5" fill="#10B981" />
              <text x="35" y="12" fill="#94A3B8" fontSize="8" fontFamily="monospace">SENSORA Live UI</text>

              {/* Mini Cross-section line inside dashboard */}
              <polyline points="10,48 35,46 60,50 85,45 110,47 125,46" stroke="#F97316" strokeWidth="1.5" fill="none" />
              <rect x="10" y="60" width="32" height="14" rx="2" fill="#10B981" fillOpacity="0.2" stroke="#10B981" strokeWidth="0.8" />
              <text x="14" y="70" fill="#10B981" fontSize="7" fontFamily="monospace" fontWeight="bold">TILT 0.0°</text>

              <rect x="48" y="60" width="38" height="14" rx="2" fill="#0284C7" fillOpacity="0.2" stroke="#0284C7" strokeWidth="0.8" />
              <text x="52" y="70" fill="#38BDF8" fontSize="7" fontFamily="monospace" fontWeight="bold">SOIL 100%</text>

              <rect x="92" y="60" width="33" height="14" rx="2" fill="#F59E0B" fillOpacity="0.2" stroke="#F59E0B" strokeWidth="0.8" />
              <text x="96" y="70" fill="#FBBF24" fontSize="7" fontFamily="monospace" fontWeight="bold">30.9°C</text>
            </g>
          </svg>
        </div>

        {/* Bottom Feature Micro-Chips */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-800/80 text-center">
          <div className="bg-slate-800/60 rounded-lg p-2 border border-slate-700/50">
            <div className="text-[10px] text-slate-400 uppercase font-mono">Telemetry Link</div>
            <div className="text-xs font-semibold text-orange-400 mt-0.5">Sub-GHz LoRa</div>
          </div>
          <div className="bg-slate-800/60 rounded-lg p-2 border border-slate-700/50">
            <div className="text-[10px] text-slate-400 uppercase font-mono">Edge Aggregator</div>
            <div className="text-xs font-semibold text-sky-400 mt-0.5">RPi 4B + MQTT</div>
          </div>
          <div className="bg-slate-800/60 rounded-lg p-2 border border-slate-700/50">
            <div className="text-[10px] text-slate-400 uppercase font-mono">Anomaly Engine</div>
            <div className="text-xs font-semibold text-emerald-400 mt-0.5">AI Risk Scoring</div>
          </div>
        </div>
      </div>
    </div>
  )
}
