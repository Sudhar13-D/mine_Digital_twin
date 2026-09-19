import React from 'react'
import {
  SolarNodeIcon,
  BuriedSensorIcon,
  RadioWaveIcon,
  GatewayIcon,
  BrainCpuIcon,
  DigitalTwinIcon,
  RoverIcon,
  MinerAlertIcon,
} from './icons'

export default function SensoraHeroGraphic() {
  return (
    <div className="relative w-full max-w-2xl mx-auto lg:max-w-none">
      {/* Outer ambient glow */}
      <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500/20 via-blue-600/15 to-purple-600/20 rounded-2xl blur-xl opacity-75"></div>

      {/* Main Glassmorphism Display Container */}
      <div className="relative rounded-2xl bg-slate-950/90 backdrop-blur-md border border-slate-700/70 shadow-2xl p-4 sm:p-5 overflow-hidden">
        {/* Top Header status */}
        <div className="flex items-center justify-between border-b border-slate-800/90 pb-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
            </span>
            <span className="text-xs font-mono text-cyan-400 font-semibold tracking-wider uppercase">
              SensOra System Architecture
            </span>
          </div>
          <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-sky-400 font-medium">
              8-Tier Hardware & AI Loop
            </span>
          </div>
        </div>

        {/* Technical Vector Diagram */}
        <div className="relative aspect-[16/11] w-full rounded-xl bg-slate-950/80 border border-slate-800/80 p-2 sm:p-3 overflow-hidden">
          {/* Subtle Grid */}
          <div 
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage: `linear-gradient(to right, #38bdf8 1px, transparent 1px), linear-gradient(to bottom, #38bdf8 1px, transparent 1px)`,
              backgroundSize: '24px 24px'
            }}
          />

          <svg className="w-full h-full" viewBox="0 0 600 400" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="strataFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1E293B" stopOpacity="0.5" />
                <stop offset="40%" stopColor="#0F172A" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#020617" stopOpacity="0.95" />
              </linearGradient>
              <linearGradient id="loraWaveGrad" x1="0" y1="1" x2="1" y2="0">
                <stop offset="0%" stopColor="#0EA5E9" />
                <stop offset="100%" stopColor="#38BDF8" />
              </linearGradient>
              <linearGradient id="alertBeam" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#EF4444" />
                <stop offset="100%" stopColor="#F97316" />
              </linearGradient>
            </defs>

            {/* Geological Strata Cutaway */}
            <rect x="15" y="60" width="570" height="325" rx="8" fill="url(#strataFill)" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />
            
            {/* Depth Markers */}
            <text x="25" y="80" fill="#94A3B8" fontSize="10" fontFamily="monospace">0m Surface Level (Ground Surface)</text>
            <text x="25" y="190" fill="#64748B" fontSize="9" fontFamily="monospace">-45m Overburden Sandstone & Shale</text>
            <text x="25" y="300" fill="#0EA5E9" fontSize="9" fontFamily="monospace" fontWeight="bold">-108m Active Coal Seam Gallery & Pillars</text>

            {/* Geological Layer Divider Lines */}
            <line x1="20" y1="88" x2="580" y2="88" stroke="#0284C7" strokeWidth="1.5" strokeOpacity="0.6" />
            <line x1="20" y1="198" x2="580" y2="198" stroke="#475569" strokeWidth="1" strokeOpacity="0.4" strokeDasharray="4 4" />
            <line x1="20" y1="285" x2="580" y2="285" stroke="#EA580C" strokeWidth="1.2" strokeOpacity="0.5" />

            {/* 1. SURFACE-MOUNTED SOLAR SENSOR NODE */}
            <g transform="translate(40, 20)">
              <rect width="105" height="52" rx="6" fill="#0F172A" stroke="#F59E0B" strokeWidth="1.5" />
              <polygon points="12,14 38,14 32,8 18,8" fill="#F59E0B" fillOpacity="0.4" stroke="#F59E0B" strokeWidth="1" />
              <text x="44" y="16" fill="#FCD34D" fontSize="9" fontFamily="sans-serif" fontWeight="bold">1. Surface Node</text>
              <text x="12" y="30" fill="#E2E8F0" fontSize="8" fontFamily="monospace">Solar + ESP32</text>
              <text x="12" y="42" fill="#94A3B8" fontSize="7" fontFamily="monospace">Tilt + GPS + LoRa</text>
            </g>

            {/* 2. BURIED SENSORS MONITORING GEOLOGICAL CONDITIONS */}
            <g transform="translate(60, 110)">
              {/* Vertical borehole rod */}
              <line x1="25" y1="-22" x2="25" y2="70" stroke="#0EA5E9" strokeWidth="2.5" strokeDasharray="3 2" />
              {/* Buried probe enclosure */}
              <rect x="0" y="20" width="115" height="50" rx="5" fill="#020617" stroke="#0EA5E9" strokeWidth="1.5" />
              <text x="8" y="35" fill="#38BDF8" fontSize="8" fontFamily="sans-serif" fontWeight="bold">2. Buried Sensors</text>
              <text x="8" y="48" fill="#CBD5E1" fontSize="7" fontFamily="monospace">LVDT + Geophone +</text>
              <text x="8" y="58" fill="#94A3B8" fontSize="7" fontFamily="monospace">FDR Soil + PT100 RTD</text>
              {/* Probe sensor rings */}
              <circle cx="25" cy="4" r="3" fill="#38BDF8" />
              <circle cx="25" cy="-12" r="3" fill="#38BDF8" />
            </g>

            {/* 3. WIRELESS LoRa COMMUNICATION (Wave Arcs) */}
            <path
              d="M145 45 C 190 45, 230 75, 260 110"
              stroke="url(#loraWaveGrad)"
              strokeWidth="2.2"
              strokeDasharray="4 3"
              className="animate-pulse"
            />
            <path
              d="M175 145 C 210 145, 240 135, 265 125"
              stroke="#0EA5E9"
              strokeWidth="1.5"
              strokeDasharray="2 3"
            />
            {/* Wireless badge label */}
            <rect x="180" y="70" width="70" height="20" rx="4" fill="#0369A1" fillOpacity="0.3" stroke="#0284C7" strokeWidth="0.8" />
            <text x="188" y="83" fill="#7DD3FC" fontSize="7" fontFamily="monospace" fontWeight="bold">3. LoRa Mesh</text>

            {/* 4. CENTRAL GATEWAY (Raspberry Pi 4B) in Intake Drift */}
            <g transform="translate(255, 100)">
              <rect width="100" height="48" rx="6" fill="#0F172A" stroke="#0284C7" strokeWidth="1.8" />
              <circle cx="15" cy="18" r="3" fill="#10B981" />
              <text x="24" y="20" fill="#F8FAFC" fontSize="9" fontFamily="sans-serif" fontWeight="bold">4. Gateway</text>
              <text x="12" y="33" fill="#7DD3FC" fontSize="8" fontFamily="monospace">Raspberry Pi 4B</text>
              <text x="12" y="43" fill="#94A3B8" fontSize="7" fontFamily="monospace">Mosquitto MQTT + Buffer</text>
            </g>

            {/* Uplink line from Gateway to Cloud/AI */}
            <line x1="355" y1="124" x2="420" y2="124" stroke="#38BDF8" strokeWidth="2" strokeDasharray="3 3" />
            <polygon points="420,121 427,124 420,127" fill="#38BDF8" />

            {/* 5. CLOUD & AI ANALYSIS (LSTM Autoencoder + Fusion) */}
            <g transform="translate(425, 95)">
              <rect width="140" height="55" rx="6" fill="#0F172A" stroke="#8B5CF6" strokeWidth="1.5" />
              <text x="10" y="18" fill="#C084FC" fontSize="9" fontFamily="sans-serif" fontWeight="bold">5. Cloud & AI/ML</text>
              <text x="10" y="32" fill="#E2E8F0" fontSize="8" fontFamily="monospace">LSTM Autoencoder</text>
              <text x="10" y="44" fill="#94A3B8" fontSize="7" fontFamily="monospace">Sensor Fusion + Z-Score</text>
            </g>

            {/* Downward link to Digital Twin Dashboard */}
            <line x1="495" y1="150" x2="495" y2="195" stroke="#A855F7" strokeWidth="2" strokeDasharray="3 3" />
            <polygon points="492,195 495,202 498,195" fill="#A855F7" />

            {/* 6. DIGITAL TWIN / GIS DASHBOARD PREVIEW */}
            <g transform="translate(415, 205)">
              <rect width="155" height="85" rx="6" fill="#020617" stroke="#0284C7" strokeWidth="1.7" />
              <rect x="0" y="0" width="155" height="18" rx="6" fill="#0F172A" />
              <circle cx="8" cy="9" r="2" fill="#EF4444" />
              <circle cx="15" cy="9" r="2" fill="#F59E0B" />
              <circle cx="22" cy="9" r="2" fill="#10B981" />
              <text x="32" y="12" fill="#94A3B8" fontSize="7.5" fontFamily="monospace" fontWeight="bold">6. Digital Twin / GIS</text>

              {/* Mini Map & Strata cross-section inside */}
              <polyline points="10,48 40,46 70,52 100,45 130,47 145,46" stroke="#0EA5E9" strokeWidth="1.5" fill="none" />
              <rect x="10" y="60" width="40" height="15" rx="2" fill="#10B981" fillOpacity="0.2" stroke="#10B981" strokeWidth="0.8" />
              <text x="14" y="71" fill="#10B981" fontSize="7" fontFamily="monospace" fontWeight="bold">Risk: LOW</text>

              <rect x="55" y="60" width="45" height="15" rx="2" fill="#F97316" fillOpacity="0.2" stroke="#F97316" strokeWidth="0.8" />
              <text x="59" y="71" fill="#FB923C" fontSize="7" fontFamily="monospace" fontWeight="bold">Anom: 0.00</text>

              <rect x="105" y="60" width="42" height="15" rx="2" fill="#0284C7" fillOpacity="0.2" stroke="#0284C7" strokeWidth="0.8" />
              <text x="109" y="71" fill="#38BDF8" fontSize="7" fontFamily="monospace" fontWeight="bold">Pillar: P1</text>
            </g>

            {/* Dispatch link from Dashboard to Rover */}
            <path
              d="M415 260 C 370 260, 350 280, 310 295"
              stroke="#F59E0B"
              strokeWidth="1.8"
              strokeDasharray="4 3"
            />
            <polygon points="310,292 303,298 312,301" fill="#F59E0B" />

            {/* 7. VERIFICATION ROVER IN COAL GALLERY */}
            <g transform="translate(195, 295)">
              <rect width="115" height="58" rx="6" fill="#0F172A" stroke="#F59E0B" strokeWidth="1.7" />
              <text x="10" y="18" fill="#FBBF24" fontSize="8.5" fontFamily="sans-serif" fontWeight="bold">7. Verification Rover</text>
              <text x="10" y="32" fill="#E2E8F0" fontSize="7.5" fontFamily="monospace">Camera Visual Inspection</text>
              <text x="10" y="44" fill="#94A3B8" fontSize="7" fontFamily="monospace">Physical Verification</text>
              <circle cx="100" cy="18" r="4" fill="#F59E0B" />
            </g>

            {/* Emergency local warning link from Rover/Pillars to Miner Alert */}
            <path
              d="M195 325 C 160 325, 140 330, 125 330"
              stroke="url(#alertBeam)"
              strokeWidth="2"
              strokeDasharray="3 3"
              className="animate-pulse"
            />

            {/* 8. UNDERGROUND MINER ALERT DEVICE */}
            <g transform="translate(20, 305)">
              <rect width="105" height="55" rx="6" fill="#450A0A" stroke="#EF4444" strokeWidth="1.75" />
              <text x="8" y="18" fill="#FCA5A5" fontSize="8.5" fontFamily="sans-serif" fontWeight="bold">8. Miner Alert</text>
              <text x="8" y="32" fill="#FEE2E2" fontSize="7.5" fontFamily="monospace">Instant Local Horn/LED</text>
              <text x="8" y="44" fill="#F87171" fontSize="7" fontFamily="monospace">Audible & Strobe Alert</text>
              <circle cx="92" cy="16" r="4" fill="#EF4444" className="animate-ping" style={{ transformOrigin: '92px 16px' }} />
              <circle cx="92" cy="16" r="3" fill="#EF4444" />
            </g>

            {/* Subterranean Rock Pillars */}
            <g opacity="0.6">
              <rect x="330" y="315" width="40" height="60" rx="3" fill="#1E293B" stroke="#475569" strokeWidth="1" />
              <text x="335" y="345" fill="#94A3B8" fontSize="8" fontFamily="monospace">Pillar A</text>
              <rect x="380" y="315" width="40" height="60" rx="3" fill="#1E293B" stroke="#475569" strokeWidth="1" />
              <text x="385" y="345" fill="#94A3B8" fontSize="8" fontFamily="monospace">Pillar B</text>
            </g>
          </svg>
        </div>

        {/* Bottom 4 Key Architectural Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 pt-3 border-t border-slate-800/90 text-center">
          <div className="bg-slate-900/70 rounded-lg p-2 border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase font-mono">Sensors</div>
            <div className="text-xs font-semibold text-cyan-400 mt-0.5">Surface + Buried</div>
          </div>
          <div className="bg-slate-900/70 rounded-lg p-2 border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase font-mono">Telemetry</div>
            <div className="text-xs font-semibold text-sky-400 mt-0.5">LoRa + RPi Gateway</div>
          </div>
          <div className="bg-slate-900/70 rounded-lg p-2 border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase font-mono">Verification</div>
            <div className="text-xs font-semibold text-amber-400 mt-0.5">Camera Rover</div>
          </div>
          <div className="bg-slate-900/70 rounded-lg p-2 border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase font-mono">Protection</div>
            <div className="text-xs font-semibold text-red-400 mt-0.5">Immediate Miner Alerts</div>
          </div>
        </div>
      </div>
    </div>
  )
}
