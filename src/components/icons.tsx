import React from 'react'

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number
  color?: string
  className?: string
}

// SensOra Official Logo: Mountain peak, subterranean strata, and intelligent sensor pulse
export function SensoraLogo({ size = 32, className = '', color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="sensoraGrad" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0284C7" />
          <stop offset="0.5" stopColor="#0EA5E9" />
          <stop offset="1" stopColor="#38BDF8" />
        </linearGradient>
        <linearGradient id="sensoraPulse" x1="18" y1="20" x2="30" y2="34" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F97316" />
          <stop offset="1" stopColor="#EA580C" />
        </linearGradient>
      </defs>
      {/* Outer Hexagon / Mine Cross-section */}
      <path
        d="M24 4L42 14V34L24 44L6 34V14L24 4Z"
        stroke="url(#sensoraGrad)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="rgba(2, 132, 199, 0.08)"
      />
      {/* Mountain & Strata peak */}
      <path
        d="M13 32L24 16L35 32"
        stroke="url(#sensoraGrad)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Geological horizontal strata lines */}
      <line x1="16" y1="28" x2="32" y2="28" stroke="url(#sensoraGrad)" strokeWidth="1.75" strokeDasharray="2 2" />
      <line x1="18" y1="33" x2="30" y2="33" stroke="url(#sensoraGrad)" strokeWidth="1.75" />
      <line x1="20" y1="37" x2="28" y2="37" stroke="url(#sensoraGrad)" strokeWidth="1.75" strokeDasharray="1.5 1.5" />
      {/* Central Sensor Pulse */}
      <circle cx="24" cy="24" r="3.5" fill="url(#sensoraPulse)" />
      <circle cx="24" cy="24" r="6.5" stroke="#F97316" strokeWidth="1.2" strokeOpacity="0.7" strokeDasharray="2 2" />
    </svg>
  )
}

// SIH Tricolor Emblem
export function SIHEmblem({ size = 28, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="6" fill="#0F172A" />
      <rect x="5" y="6" width="22" height="4" rx="1" fill="#FF9933" />
      <rect x="5" y="14" width="22" height="4" rx="1" fill="#FFFFFF" />
      <rect x="5" y="22" width="22" height="4" rx="1" fill="#138808" />
      <circle cx="16" cy="16" r="2.5" stroke="#000080" strokeWidth="0.8" fill="#FFFFFF" />
    </svg>
  )
}

// Verification Rover Icon (Tracked vehicle with articulated camera mast)
export function RoverIcon({ size = 24, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {/* Rover chassis */}
      <rect x="4" y="11" width="16" height="6" rx="2" />
      {/* Continuous treads / wheels */}
      <circle cx="6.5" cy="19" r="2.5" />
      <circle cx="12" cy="19" r="2.5" />
      <circle cx="17.5" cy="19" r="2.5" />
      <line x1="4" y1="19" x2="20" y2="19" />
      {/* Articulated Camera Mast */}
      <line x1="12" y1="11" x2="12" y2="5" />
      <circle cx="12" cy="4" r="2" />
      <line x1="14" y1="4" x2="17" y2="4" strokeWidth="1.5" />
    </svg>
  )
}

// Underground Miner Alert Device Icon (Helmet / Beacon warning)
export function MinerAlertIcon({ size = 24, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {/* Miner Helmet Shape */}
      <path d="M4 14a8 8 0 0 1 16 0" />
      <path d="M2 14h20v2a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-2z" />
      {/* Mounted Cap Lamp / Strobe Beacon */}
      <rect x="10" y="8" width="4" height="4" rx="1" fill="currentColor" fillOpacity="0.2" />
      <line x1="12" y1="8" x2="12" y2="4" />
      <line x1="9" y1="3" x2="15" y2="3" />
      {/* Audible Alert Soundwaves */}
      <path d="M19 6a4 4 0 0 1 0 8" strokeDasharray="2 2" />
      <path d="M5 6a4 4 0 0 0 0 8" strokeDasharray="2 2" />
    </svg>
  )
}

// Surface Solar Node Icon
export function SolarNodeIcon({ size = 24, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {/* Solar Panel Tilting */}
      <polygon points="3 8 21 8 18 3 6 3 3 8" />
      <line x1="12" y1="3" x2="12" y2="8" />
      <line x1="7.5" y1="5.5" x2="16.5" y2="5.5" />
      {/* Mast and Electronics enclosure */}
      <line x1="12" y1="8" x2="12" y2="15" />
      <rect x="9" y="15" width="6" height="5" rx="1" />
      <line x1="12" y1="20" x2="12" y2="23" />
      <line x1="8" y1="23" x2="16" y2="23" />
    </svg>
  )
}

// Buried Subsurface Sensor Probe Icon
export function BuriedSensorIcon({ size = 24, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {/* Ground Surface Line */}
      <line x1="2" y1="5" x2="22" y2="5" strokeWidth="2.5" />
      <line x1="4" y1="8" x2="8" y2="8" strokeDasharray="2 2" />
      <line x1="16" y1="8" x2="20" y2="8" strokeDasharray="2 2" />
      {/* Vertical Borehole Probe */}
      <line x1="12" y1="5" x2="12" y2="16" strokeWidth="2" />
      <polygon points="9 16 15 16 12 21 9 16" fill="currentColor" fillOpacity="0.2" />
      {/* Sensor Rings on Probe */}
      <circle cx="12" cy="10" r="1.5" fill="currentColor" />
      <circle cx="12" cy="14" r="1.5" fill="currentColor" />
    </svg>
  )
}

// Digital Twin Icon
export function DigitalTwinIcon({ size = 24, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
      <circle cx="12" cy="12" r="2" fill="currentColor" />
    </svg>
  )
}

// Navigation & Hamburger
export function MenuIcon({ size = 24, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  )
}

export function XIcon({ size = 24, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

export function ExternalLinkIcon({ size = 16, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  )
}

export function ChevronRightIcon({ size = 18, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="9 18 15 12 9 6" />
    </svg>
  )
}

export function ChevronDownIcon({ size = 18, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

export function SunIcon({ size = 18, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  )
}

export function MoonIcon({ size = 18, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}

export function SensorIcon({ size = 22, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="4" y="4" width="16" height="16" rx="3" />
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v2M12 20v2M2 12h2M20 12h2" />
    </svg>
  )
}

export function RadioWaveIcon({ size = 22, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M4.93 4.93a10 10 0 0 1 14.14 0" />
      <path d="M7.76 7.76a6 6 0 0 1 8.48 0" />
      <circle cx="12" cy="12" r="2" />
      <path d="M12 14v7" />
    </svg>
  )
}

export function BrainCpuIcon({ size = 22, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <rect x="9" y="9" width="6" height="6" />
      <path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3" />
    </svg>
  )
}

export function BellAlertIcon({ size = 22, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  )
}

export function GatewayIcon({ size = 22, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <line x1="6" y1="12" x2="6.01" y2="12" strokeWidth="3" />
      <line x1="10" y1="12" x2="10.01" y2="12" strokeWidth="3" />
      <line x1="14" y1="12" x2="14.01" y2="12" strokeWidth="3" />
      <line x1="18" y1="12" x2="18.01" y2="12" strokeWidth="3" />
    </svg>
  )
}

export function CloudServerIcon({ size = 22, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
    </svg>
  )
}

export function DashboardMonitorIcon({ size = 22, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
      <line x1="6" y1="8" x2="10" y2="8" />
      <line x1="6" y1="12" x2="14" y2="12" />
    </svg>
  )
}

export function ShieldCheckIcon({ size = 22, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  )
}

export function TargetIcon({ size = 22, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  )
}

export function EyeVisionIcon({ size = 22, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

export function ActivityWaveIcon({ size = 22, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  )
}

export function MapPinIcon({ size = 22, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

export function LayersIcon({ size = 22, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  )
}

export function CheckCircleIcon({ size = 18, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  )
}

export function ArrowRightIcon({ size = 18, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  )
}

export function AlertTriangleIcon({ size = 22, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  )
}

export function ZapIcon({ size = 22, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  )
}
