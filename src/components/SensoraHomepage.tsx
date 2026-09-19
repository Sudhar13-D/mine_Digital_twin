import React, { useState } from 'react'
import { useTheme } from '../context/ThemeContext'
import {
  TEAM_MEMBERS,
  MENTORS,
  SENSORS,
  TECHNOLOGIES,
  FAQS,
} from '../data/sensoraData'
import {
  SensoraLogo,
  SIHEmblem,
  RoverIcon,
  MinerAlertIcon,
  SolarNodeIcon,
  BuriedSensorIcon,
  DigitalTwinIcon,
  MenuIcon,
  XIcon,
  ExternalLinkIcon,
  ChevronDownIcon,
  SunIcon,
  MoonIcon,
  SensorIcon,
  RadioWaveIcon,
  BrainCpuIcon,
  BellAlertIcon,
  GatewayIcon,
  CloudServerIcon,
  DashboardMonitorIcon,
  ShieldCheckIcon,
  TargetIcon,
  EyeVisionIcon,
  ActivityWaveIcon,
  MapPinIcon,
  LayersIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  AlertTriangleIcon,
  ZapIcon,
} from './icons'
import SensoraHeroGraphic from './SensoraHeroGraphic'

interface SensoraHomepageProps {
  onNavigateToDashboard: () => void
}

export default function SensoraHomepage({ onNavigateToDashboard }: SensoraHomepageProps) {
  const { theme, colors, toggleTheme } = useTheme()
  const isDark = colors.isDark

  // Mobile menu state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // FAQ interactive state
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  // Active interactive flow step in About section
  const [activeFlowStep, setActiveFlowStep] = useState<number>(0)

  // Active sensor category tab
  const [activeSensorIdx, setActiveSensorIdx] = useState<number>(0)

  // Three-stage workflow active tab
  const [activeStage, setActiveStage] = useState<number>(0)

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false)
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // Quick Feature Cards Data
  const quickFeatures = [
    {
      title: 'Multi-Sensor Monitoring',
      desc: 'Combines ground movement, vibration, acoustic activity, and environmental readings to observe changing mine conditions.',
      icon: <SensorIcon className="text-cyan-500" size={26} />,
      badge: 'Surface & Buried Arrays',
      accent: 'border-cyan-500/30 hover:border-cyan-500',
    },
    {
      title: 'LoRa Mesh Communication',
      desc: 'Designed to transmit sensor readings through a gateway-based wireless network, with adaptive communication for abnormal events.',
      icon: <RadioWaveIcon className="text-sky-500" size={26} />,
      badge: 'Sub-GHz SX1278 Mesh',
      accent: 'border-sky-500/30 hover:border-sky-500',
    },
    {
      title: 'AI-Based Anomaly Detection',
      desc: 'Combines sensor readings and AI/ML-based analysis to identify unusual patterns and support subsidence risk prediction.',
      icon: <BrainCpuIcon className="text-purple-500" size={26} />,
      badge: 'LSTM & Sensor Fusion',
      accent: 'border-purple-500/30 hover:border-purple-500',
    },
    {
      title: 'Early Warning & Visualization',
      desc: 'Displays location-specific risk information, sensor readings, and alerts to support operator review and timely safety decisions.',
      icon: <BellAlertIcon className="text-orange-500" size={26} />,
      badge: 'Digital Twin & Alerts',
      accent: 'border-orange-500/30 hover:border-orange-500',
    },
  ]

  // About Process Flow Steps
  const aboutProcessFlow = [
    {
      title: 'Surface & Buried Nodes',
      sub: 'Multi-Sensor Sensing',
      desc: 'Surface stations with buried boreholes monitor ground tilt, vibration, and moisture.',
      icon: <SolarNodeIcon size={20} />,
      status: 'Proposed / Tested',
    },
    {
      title: 'LoRa Communication',
      sub: 'SX1278 Mesh Network',
      desc: 'Sub-GHz radio waves penetrate strata without costly underground physical cables.',
      icon: <RadioWaveIcon size={20} />,
      status: 'Sub-GHz Verified',
    },
    {
      title: 'Gateway',
      sub: 'Raspberry Pi 4B',
      desc: 'Edge node handles local buffering and message relay to surface networks.',
      icon: <GatewayIcon size={20} />,
      status: 'Edge Node Live',
    },
    {
      title: 'Cloud & AI/ML',
      sub: 'LSTM Autoencoder',
      desc: 'Extracts baseline patterns, normalizes drift, and predicts subsidence anomalies.',
      icon: <BrainCpuIcon size={20} />,
      status: 'Architecture Ready',
    },
    {
      title: 'Digital Twin/GIS',
      sub: 'Interactive Dashboard',
      desc: 'Presents spatial risk zones, panel boundaries, and 3D stratigraphic models.',
      icon: <DigitalTwinIcon size={20} />,
      status: 'Dashboard Live',
    },
    {
      title: 'Rover Verification',
      sub: 'Camera-Based Robot',
      desc: 'Dispatched to inspect suspicious zones and relay live visual confirmation.',
      icon: <RoverIcon size={20} />,
      status: 'Proposed Feature',
    },
    {
      title: 'Miner Alerts',
      sub: 'Local Audio/Visual Horn',
      desc: 'Underground beacons sound immediate evacuation warnings to nearby workers.',
      icon: <MinerAlertIcon size={20} />,
      status: 'Local Safety Feature',
    },
  ]

  // How It Works 7 Steps
  const howItWorksSteps = [
    {
      num: '1',
      title: 'SENSE',
      highlight: 'Surface & Buried Multi-Sensor Arrays',
      desc: 'Distributed sensor nodes monitor ground movement, vibration, acoustic emissions, moisture, temperature, and related environmental conditions. The system uses surface-mounted nodes with buried sensors.',
      badge: 'Hardware Verified',
      tags: ['Inclinometer', 'Geophone', 'FDR Moisture', 'PT100 Temp', 'Piezo AE'],
    },
    {
      num: '2',
      title: 'TRANSMIT',
      highlight: 'LoRa Sub-GHz Wireless Mesh',
      desc: 'ESP32-based sensor nodes process readings and communicate through the SX1278 LoRa module. The proposed mesh communication architecture supports data transfer between nodes and the gateway. Abnormal events receive higher communication priority.',
      badge: 'Subsurface Verified',
      tags: ['868 MHz Band', 'Chirp Spread Spectrum', 'Adaptive Event Priority'],
    },
    {
      num: '3',
      title: 'COLLECT',
      highlight: 'Raspberry Pi 4B Edge Gateway',
      desc: 'The Raspberry Pi 4B gateway receives sensor information and supports local data handling and onward communication. The proposed architecture includes buffering to help handle connectivity interruptions.',
      badge: 'Edge Node Live',
      tags: ['Mosquitto MQTT', 'Local Ring Buffering', 'Cellular/IP Uplink'],
    },
    {
      num: '4',
      title: 'ANALYZE',
      highlight: 'AI/ML Anomaly Prediction Engine',
      desc: 'The backend processes incoming sensor data. The proposed AI/ML approach includes LSTM Autoencoder for anomaly detection, sensor fusion combining multiple streams, threshold scoring, and edge-based Z-score statistical drift detection.',
      badge: 'Algorithmic Pipeline',
      tags: ['LSTM Autoencoder', 'Sensor Fusion', 'Z-Score Drift', 'Threshold Scoring'],
    },
    {
      num: '5',
      title: 'VISUALIZE',
      highlight: 'Digital Twin & GIS Spatial Dashboard',
      desc: 'The dashboard is designed to display sensor readings, historical trends, mine and sensor locations, location-specific risk zones, Digital Twin visualization, abnormal reading indicators, and rover verification status.',
      badge: 'Dashboard Live',
      tags: ['Leaflet GIS', '3D Strata Cross-Section', 'Live Telemetry Table'],
    },
    {
      num: '6',
      title: 'VERIFY',
      highlight: 'Camera-Equipped Verification Rover',
      desc: 'A camera-equipped verification rover can be directed toward suspicious locations. The rover uses its camera to help inspect the area and provide visual information for operator review.',
      badge: 'Proposed Verification',
      tags: ['Remote Teleoperation', 'Visual Confirmation', 'Risk Validation'],
    },
    {
      num: '7',
      title: 'ALERT',
      highlight: 'Immediate Underground & Remote Warnings',
      desc: 'Underground sensor nodes are designed to issue immediate local alerts when configured dangerous ground-movement conditions are detected. The monitoring system can also support remote notifications and operator review.',
      badge: 'Operational Safety',
      tags: ['Instant Local Strobe/Horn', 'Operator Notification', 'Evacuation Decision'],
    },
  ]

  // Three Stages
  const threeStages = [
    {
      stage: 'STAGE 1',
      name: 'MONITOR & PREDICT',
      subtitle: 'Continuous Subterranean Observation',
      desc: 'Surface sensor nodes, buried multi-sensor nodes, LoRa communication, central gateway, sensor fusion, AI/ML analysis, and Digital Twin/GIS dashboard combine to continuously observe mine conditions, identify unusual sensor patterns, and visualize where subsidence risk may be increasing.',
      items: [
        'Surface & buried sensor nodes tracking tilt, vibration, and moisture',
        'LoRa mesh relaying packets to central RPi 4B gateway',
        'LSTM Autoencoder and Z-score models predicting risk drift',
        'Spatial Digital Twin highlighting developing risk areas',
      ],
      icon: <BrainCpuIcon size={28} className="text-cyan-400" />,
      color: 'border-cyan-500 bg-cyan-500/10 text-cyan-400',
    },
    {
      stage: 'STAGE 2',
      name: 'VERIFY',
      subtitle: 'Targeted Physical Inspection',
      desc: 'When the Digital Twin identifies a suspicious location, a camera-equipped rover can be directed toward the area. The rover captures visual evidence of ground cracking or pillar yielding and transmits information back to the operator for physical verification.',
      items: [
        'Suspicious location flagged with geographic coordinates',
        'Inspection rover dispatched along safe gallery paths',
        'High-resolution camera footage and obstacle feedback',
        'Operator review confirming whether physical evacuation is required',
      ],
      icon: <RoverIcon size={28} className="text-amber-400" />,
      color: 'border-amber-500 bg-amber-500/10 text-amber-400',
    },
    {
      stage: 'STAGE 3',
      name: 'PROTECT',
      subtitle: 'Immediate Local & Remote Alerts',
      desc: 'When underground sensor nodes detect sudden dangerous movement or structural yield, they immediately trigger local audible horns and flashing strobe lights to warn nearby miners, while broadcasting urgent notifications to mine management.',
      items: [
        'Sub-second local trigger on dangerous tilt/vibration spike',
        'Audible siren and visual beacon directly inside active gallery',
        'Nearby miners alerted to evacuate immediately',
        'Regulatory audit report automatically logged for safety compliance',
      ],
      icon: <MinerAlertIcon size={28} className="text-red-400" />,
      color: 'border-red-500 bg-red-500/10 text-red-400',
    },
  ]

  // Impact Cards
  const impacts = [
    {
      title: 'SAFETY',
      tagline: 'Mineworker Protection',
      desc: 'Reduced exposure to hazardous ground conditions through earlier identification of abnormal behavior and immediate local warning beacons in active galleries.',
      accent: 'border-cyan-500/30 text-cyan-500',
    },
    {
      title: 'ECONOMIC',
      tagline: 'Equipment & Infrastructure Loss Reduction',
      desc: 'Potential reduction in losses from machinery entrapment, structural roadway collapse, and longwall de-pillaring operational disruption.',
      accent: 'border-emerald-500/30 text-emerald-500',
    },
    {
      title: 'OPERATIONAL',
      tagline: 'Targeted Maintenance & Faster Decisions',
      desc: 'Targeted inspections supported by rover verification and faster safety and operational decisions based on continuous quantitative telemetry.',
      accent: 'border-sky-500/30 text-sky-500',
    },
    {
      title: 'COMMUNITY',
      tagline: 'Surface Strata Awareness',
      desc: 'Improved awareness and preparedness for surface settlements, railway lines, and neighboring habitations through access to relevant risk information.',
      accent: 'border-purple-500/30 text-purple-500',
    },
    {
      title: 'ENVIRONMENTAL',
      tagline: 'Data-Driven Oversight',
      desc: 'Support for data-driven intervention, hydrological subsidence tracking, and post-mining environmental rehabilitation oversight.',
      accent: 'border-amber-500/30 text-amber-500',
    },
  ]

  return (
    <div className={`min-h-screen font-sans transition-colors duration-200 ${isDark ? 'bg-[#0B0F17] text-[#E2E8F0]' : 'bg-[#F8FAFC] text-[#0F172A]'}`}>
      
      {/* =========================================================================
          4. NAVIGATION BAR (STICKY, LAVENDER/OFF-WHITE ACCENTS, MOBILE HAMBURGER)
          ========================================================================= */}
      <header
        className={`sticky top-0 z-50 transition-all duration-200 border-b backdrop-blur-md ${
          isDark
            ? 'bg-[#0F172A]/90 border-slate-800 text-slate-100 shadow-md'
            : 'bg-[#F8FAFC]/95 border-purple-200/60 text-slate-900 shadow-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          {/* Left: SensOra Logo & Tagline */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/15 via-blue-600/10 to-purple-600/20 border border-cyan-500/30 shadow-sm">
              <SensoraLogo size={28} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-cyan-600 via-sky-600 to-blue-600 dark:from-cyan-400 dark:via-sky-300 dark:to-blue-400 bg-clip-text text-transparent">
                  SensOra
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase bg-cyan-100 dark:bg-cyan-950/60 text-cyan-800 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-800">
                  RTECH 007
                </span>
              </div>
              <p className={`text-[11px] font-medium hidden md:block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Safer Mines, Stronger Tomorrows
              </p>
            </div>
          </div>

          {/* Center Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium">
            <button
              onClick={() => scrollToSection('about')}
              className={`transition-colors hover:text-cyan-500 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}
            >
              About
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className={`transition-colors hover:text-cyan-500 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection('three-stage')}
              className={`transition-colors hover:text-cyan-500 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}
            >
              Workflow
            </button>
            <button
              onClick={() => scrollToSection('technology')}
              className={`transition-colors hover:text-cyan-500 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}
            >
              Technology
            </button>
            <button
              onClick={() => scrollToSection('sensors')}
              className={`transition-colors hover:text-cyan-500 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}
            >
              Sensors
            </button>
            <button
              onClick={() => scrollToSection('team')}
              className={`transition-colors hover:text-cyan-500 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}
            >
              Team
            </button>
            <button
              onClick={() => scrollToSection('faq')}
              className={`transition-colors hover:text-cyan-500 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}
            >
              FAQ
            </button>
          </nav>

          {/* Right: Badges, Theme Toggle & Monitor Button */}
          <div className="flex items-center gap-3">
            {/* SIH 2026 Badge */}
            <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200">
              <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
              <span>SIH 2026 • 139029</span>
            </div>

            {/* Light / Dark Theme Toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle Light/Dark Theme"
              className={`p-2 rounded-lg border transition-all ${
                isDark
                  ? 'bg-slate-800 border-slate-700 text-amber-400 hover:bg-slate-700'
                  : 'bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100'
              }`}
            >
              {isDark ? <SunIcon size={18} /> : <MoonIcon size={18} />}
            </button>

            {/* Monitor Button */}
            <button
              onClick={onNavigateToDashboard}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg font-semibold text-sm text-white bg-gradient-to-r from-cyan-600 via-sky-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 shadow-md shadow-cyan-600/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              <span>Monitor</span>
              <ExternalLinkIcon size={15} />
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Open Mobile Menu"
            >
              {mobileMenuOpen ? <XIcon size={24} /> : <MenuIcon size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden px-4 pt-3 pb-6 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
            <div className="grid grid-cols-2 gap-2 text-sm font-medium pt-2">
              <button onClick={() => scrollToSection('about')} className="text-left px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                About
              </button>
              <button onClick={() => scrollToSection('how-it-works')} className="text-left px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                How It Works
              </button>
              <button onClick={() => scrollToSection('three-stage')} className="text-left px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                3-Stage Workflow
              </button>
              <button onClick={() => scrollToSection('technology')} className="text-left px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                Technology
              </button>
              <button onClick={() => scrollToSection('sensors')} className="text-left px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                Sensors
              </button>
              <button onClick={() => scrollToSection('digital-twin')} className="text-left px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                Digital Twin
              </button>
              <button onClick={() => scrollToSection('team')} className="text-left px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                Team
              </button>
              <button onClick={() => scrollToSection('faq')} className="text-left px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                FAQ
              </button>
            </div>
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs font-mono text-slate-500">Team: RTECH 007 (139029)</span>
              <button
                onClick={onNavigateToDashboard}
                className="px-4 py-2 rounded-lg bg-cyan-600 text-white text-xs font-bold"
              >
                Launch Dashboard ↗
              </button>
            </div>
          </div>
        )}
      </header>

      {/* =========================================================================
          5. HERO SECTION (DARK NAVY GRADIENT, COAL MINE PHOTO, 8-TIER GRAPHIC)
          ========================================================================= */}
      <section className="relative min-h-[660px] lg:min-h-[740px] flex items-center justify-center overflow-hidden bg-[#0A0E17] text-white">
        {/* Real Underground Coal Mine Photography Background */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-700"
          style={{ backgroundImage: `url('/assets/coal_mine_hero.jpg')` }}
        >
          {/* Dark Navy / Charcoal Overlays for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#070B14]/95 via-[#0A0E17]/90 to-[#0F172A]/85"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0E17] via-transparent to-[#070B14]/70"></div>
        </div>

        {/* Ambient Cyan & Electric Blue Flares */}
        <div className="absolute top-1/4 left-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none"></div>

        {/* Hero Content Container */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Heading, Subheading, Narrative */}
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-semibold bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 backdrop-blur-sm">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                <span>SMART INDIA HACKATHON 2026 • RTECH 007</span>
              </div>

              {/* Main Heading & Subheading */}
              <div className="space-y-2">
                <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-none">
                  SensOra
                </h1>
                <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-200 bg-clip-text text-transparent">
                  Smarter Monitoring. Safer Mining.
                </h2>
              </div>

              {/* Description */}
              <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
                An AI-enabled, low-cost mine subsidence monitoring, prediction and early warning system designed to observe ground conditions, detect abnormal behavior, identify increasing subsidence risk, and support safer decisions in underground coal mines.
              </p>

              {/* Primary & Secondary Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  onClick={() => scrollToSection('how-it-works')}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-semibold text-sm text-slate-900 bg-white hover:bg-slate-100 shadow-lg shadow-white/10 transition-all transform hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Explore Our Solution ↓</span>
                </button>

                <button
                  onClick={onNavigateToDashboard}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-cyan-600 via-sky-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 shadow-lg shadow-cyan-600/30 transition-all transform hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Monitor Dashboard ↗</span>
                </button>
              </div>

              {/* Supporting Quotes */}
              <div className="pt-2 space-y-1">
                <p className="text-xs sm:text-sm font-medium tracking-wide text-cyan-300/90 font-mono">
                  “From Data to Safety, From Insight to Impact.”
                </p>
                <p className="text-xs italic text-slate-400 font-serif">
                  “When the ground begins to whisper, we must listen before it screams.”
                </p>
              </div>
            </div>

            {/* Right Column: 8-Tier Hero Architectural Graphic */}
            <div className="lg:col-span-6">
              <SensoraHeroGraphic />
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          6. QUICK FEATURE CARDS
          ========================================================================= */}
      <section className="relative -mt-8 sm:-mt-12 z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {quickFeatures.map((feat, idx) => (
            <div
              key={idx}
              className={`p-6 rounded-2xl border transition-all duration-200 transform hover:-translate-y-1 shadow-lg ${feat.accent} ${
                isDark
                  ? 'bg-slate-900/95 backdrop-blur-md text-slate-200 shadow-black/40'
                  : 'bg-white text-slate-800 shadow-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800">
                  {feat.icon}
                </div>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                  {feat.badge}
                </span>
              </div>
              <h3 className="font-bold text-base mb-2 text-slate-900 dark:text-white">
                {feat.title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {feat.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          7. ABOUT SENSORA & VISUAL PROCESS FLOW
          ========================================================================= */}
      <section id="about" className="py-20 sm:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-xs font-mono font-bold tracking-widest text-cyan-600 dark:text-cyan-400 uppercase mb-3">
            ABOUT OUR PROJECT
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
            Making Mine Conditions Visible
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
            SensOra combines distributed sensing, wireless communication, sensor fusion, AI/ML analysis, Digital Twin/GIS visualization, and rover-based verification to support continuous observation of mine conditions and early identification of abnormal ground behavior.
          </p>
        </div>

        {/* Core System Concept Card */}
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-10 shadow-xl mb-12">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
            Core System Concept
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-slate-600 dark:text-slate-300">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
              <span className="font-bold text-cyan-600 dark:text-cyan-400 block mb-1">Surface & Buried Arrays</span>
              Our system places smart sensor nodes on the surface with buried borehole sensors to continuously monitor subtle changes in ground tilt, vibration, and moisture.
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
              <span className="font-bold text-purple-600 dark:text-purple-400 block mb-1">Sensor Fusion & AI/ML</span>
              Multiple sensor readings are combined using multi-sensor fusion and AI/ML models to identify early signs of subsidence and predict where risk may be increasing.
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
              <span className="font-bold text-amber-600 dark:text-amber-400 block mb-1">Verification & Immediate Alerts</span>
              A rover travels to suspicious locations for camera verification. Simultaneously, underground nodes immediately alert nearby miners if sudden dangerous movement occurs.
            </div>
          </div>

          {/* Visual Process Flow Stepper */}
          <div className="mt-10 pt-8 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono font-bold uppercase text-slate-500">
                Visual Process Flow (Click stage to inspect)
              </span>
              <span className="text-xs text-cyan-600 dark:text-cyan-400 font-mono">
                End-to-End Pipeline
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
              {aboutProcessFlow.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveFlowStep(idx)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    activeFlowStep === idx
                      ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-950/40 ring-1 ring-cyan-500'
                      : 'border-slate-200 dark:border-slate-800 hover:border-cyan-300 bg-slate-50/50 dark:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono font-bold text-cyan-600 dark:text-cyan-400">0{idx + 1}</span>
                    <div className={activeFlowStep === idx ? 'text-cyan-600' : 'text-slate-400'}>{s.icon}</div>
                  </div>
                  <div className="font-bold text-xs text-slate-900 dark:text-white truncate">{s.title}</div>
                  <div className="text-[10px] text-slate-500 truncate">{s.sub}</div>
                </button>
              ))}
            </div>

            {/* Selected Process Flow Detail */}
            <div className="mt-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400 font-mono">
                  {aboutProcessFlow[activeFlowStep].title} — {aboutProcessFlow[activeFlowStep].sub}
                </span>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                  {aboutProcessFlow[activeFlowStep].desc}
                </p>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 whitespace-nowrap">
                {aboutProcessFlow[activeFlowStep].status}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          8. MISSION AND VISION
          ========================================================================= */}
      <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Mission */}
          <div className="p-8 sm:p-10 rounded-3xl border border-cyan-200 dark:border-slate-800 bg-gradient-to-br from-white via-cyan-50/20 to-sky-50/20 dark:from-slate-900 dark:to-slate-800/80 shadow-xl relative overflow-hidden">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-2xl bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                <TargetIcon size={28} />
              </div>
              <div>
                <span className="text-[11px] font-mono uppercase font-bold text-cyan-600 dark:text-cyan-400">
                  OUR PURPOSE
                </span>
                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                  Our Mission
                </h3>
              </div>
            </div>
            <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              “To develop an affordable, intelligent, and scalable monitoring system that combines multi-sensor data, AI/ML analysis, and early warning mechanisms to identify abnormal ground behavior and support timely safety decisions in underground mines.”
            </p>
          </div>

          {/* Vision */}
          <div className="p-8 sm:p-10 rounded-3xl border border-purple-200 dark:border-slate-800 bg-gradient-to-br from-white via-purple-50/20 to-indigo-50/20 dark:from-slate-900 dark:to-slate-800/80 shadow-xl relative overflow-hidden">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-2xl bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                <EyeVisionIcon size={28} />
              </div>
              <div>
                <span className="text-[11px] font-mono uppercase font-bold text-purple-600 dark:text-purple-400">
                  OUR HORIZON
                </span>
                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                  Our Vision
                </h3>
              </div>
            </div>
            <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              “To contribute to safer mining operations through continuous monitoring, accessible technology, location-specific risk awareness, and data-driven understanding of subsidence risks.”
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          9. HOW IT WORKS (7 NUMBERED STEPS)
          ========================================================================= */}
      <section id="how-it-works" className="py-20 sm:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-xs font-mono font-bold tracking-widest text-cyan-600 dark:text-cyan-400 uppercase mb-3">
            DETAILED ARCHITECTURAL WORKFLOW
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
            How SensOra Operates
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400">
            A continuous 7-step sequence spanning subsurface sensing, edge buffering, predictive neural scoring, rover verification, and instant local miner warnings.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {howItWorksSteps.map((step, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md flex flex-col justify-between hover:border-cyan-500 transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-600 to-blue-600 text-white font-bold text-sm shadow-md">
                    {step.num}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded font-semibold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                    {step.badge}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                  {step.title}
                </h3>
                <h4 className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 font-mono mb-3">
                  {step.highlight}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                  {step.desc}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-1.5">
                {step.tags.map((t, tIdx) => (
                  <span key={tIdx} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          10. THREE-STAGE SYSTEM WORKFLOW ("FROM PREDICTION TO PROTECTION")
          ========================================================================= */}
      <section id="three-stage" className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="inline-block text-xs font-mono font-bold tracking-widest text-cyan-600 dark:text-cyan-400 uppercase mb-3">
            PPT CORE INNOVATION
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
            From Prediction to Protection
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400">
            A three-tier operational progression guaranteeing that ground risk detection leads directly to physical inspection and immediate subterranean worker safety.
          </p>
        </div>

        {/* 3 Interactive Stage Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {threeStages.map((stg, idx) => (
            <div
              key={idx}
              className={`p-8 rounded-3xl border transition-all duration-200 shadow-xl flex flex-col justify-between ${
                stg.color
              } ${isDark ? 'bg-slate-900/80' : 'bg-white'}`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-slate-800/20 border border-current">
                    {stg.stage}
                  </span>
                  <div>{stg.icon}</div>
                </div>
                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-1">
                  {stg.name}
                </h3>
                <h4 className="text-xs font-mono font-semibold mb-4 opacity-90">
                  {stg.subtitle}
                </h4>
                <p className="text-sm leading-relaxed mb-6 opacity-85 text-slate-700 dark:text-slate-300">
                  {stg.desc}
                </p>
                <div className="space-y-2 border-t border-current/20 pt-4 text-xs font-medium">
                  {stg.items.map((it, iIdx) => (
                    <div key={iIdx} className="flex items-start gap-2">
                      <span className="text-current font-bold">✓</span>
                      <span className="text-slate-700 dark:text-slate-300">{it}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Infographic Arrow Flow */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-mono font-semibold text-slate-700 dark:text-slate-300">
            <span>MONITOR & PREDICT</span>
            <span className="text-cyan-500">───►</span>
            <span>VERIFY (Rover)</span>
            <span className="text-amber-500">───►</span>
            <span>PROTECT (Miner Alerts)</span>
          </div>
        </div>
      </section>

      {/* =========================================================================
          11. TECHNOLOGY BEHIND SENSORA (HARDWARE, SOFTWARE, AI)
          ========================================================================= */}
      <section id="technology" className="py-20 sm:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-xs font-mono font-bold tracking-widest text-cyan-600 dark:text-cyan-400 uppercase mb-3">
            PROVEN & PROPOSED STACK
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
            Technology Behind SensOra
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400">
            Resilient sub-GHz communication, low-power microcontrollers, predictive neural modeling, and GIS visualization.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {TECHNOLOGIES.map((tech, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-semibold text-cyan-600 dark:text-cyan-400">
                    {tech.category}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                    {tech.status}
                  </span>
                </div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2">
                  {tech.name}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {tech.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          12. SENSOR ARCHITECTURE (7 SPECIFIC SENSORS + INTERCONNECT)
          ========================================================================= */}
      <section id="sensors" className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="inline-block text-xs font-mono font-bold tracking-widest text-cyan-600 dark:text-cyan-400 uppercase mb-3">
            SUBTERRANEAN SENSOR ARRAYS
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
            Sensor Architecture
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400">
            Multi-sensor probe configuration designed to sample angular movement, fracture acoustic emission, seismic vibration, and ground soil saturation.
          </p>
        </div>

        {/* 7 Specific Sensor Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-10">
          {SENSORS.map((s, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:border-cyan-500 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-semibold">
                    {s.tag}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">{s.status}</span>
                </div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white mb-1">
                  {s.name}
                </h3>
                <h4 className="text-xs font-semibold text-slate-500 font-mono mb-2">
                  Target: {s.target}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {s.function}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Multi-Sensor Bus Architecture Banner */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-[#0F172A] border border-cyan-500/30 text-white text-center">
          <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 block mb-2 font-bold">
            Hardware Signal Interconnect Flow
          </span>
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs sm:text-sm font-mono">
            <span className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-cyan-300">MULTI-SENSOR INPUT</span>
            <span className="text-cyan-400">──►</span>
            <span className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-sky-300">ESP32 MICROCONTROLLER</span>
            <span className="text-cyan-400">──►</span>
            <span className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-blue-300">SX1278 LoRa</span>
            <span className="text-cyan-400">──►</span>
            <span className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-purple-300">GATEWAY (RPi 4B)</span>
            <span className="text-cyan-400">──►</span>
            <span className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-amber-300">CLOUD / AI</span>
            <span className="text-cyan-400">──►</span>
            <span className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-emerald-300">DASHBOARD</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-3 max-w-2xl mx-auto">
            Note: Final sensor deployment arrangements and explosion-proof underground enclosures are subject to engineering validation under DGMS guidelines.
          </p>
        </div>
      </section>

      {/* =========================================================================
          13. DIGITAL TWIN & GIS
          ========================================================================= */}
      <section id="digital-twin" className="py-20 sm:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="inline-block text-xs font-mono font-bold tracking-widest text-cyan-600 dark:text-cyan-400 uppercase mb-3">
            SPATIAL VISIBILITY
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
            See the Mine. Understand the Risk.
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400">
            The proposed Digital Twin/GIS interface combines sensor locations, mine geography, and changing monitoring information to help users identify where abnormal conditions are developing.
          </p>
        </div>

        {/* Illustrative Mine Map & Cross-section Card */}
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-slate-900 dark:text-white">
                  Illustrative GIS Digital Twin Preview
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                  SIMULATED PREVIEW
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Shows spatial coal panel boundaries, safety pillars, sensor markers, and rover coordinates.
              </p>
            </div>
            <button
              onClick={onNavigateToDashboard}
              className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <span>Explore Live Dashboard</span>
              <ExternalLinkIcon size={14} />
            </button>
          </div>

          {/* Interactive Simulation Display Canvas */}
          <div className="relative aspect-[16/9] w-full rounded-2xl bg-slate-950 border border-slate-800 p-4 overflow-hidden">
            {/* Grid */}
            <div 
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{
                backgroundImage: `linear-gradient(to right, #0284c7 1px, transparent 1px), linear-gradient(to bottom, #0284c7 1px, transparent 1px)`,
                backgroundSize: '32px 32px'
              }}
            />

            {/* SVG Visual elements */}
            <svg className="w-full h-full" viewBox="0 0 800 450" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Panel Boundary 1 (Active) */}
              <rect x="80" y="80" width="300" height="260" rx="4" fill="#0284C7" fillOpacity="0.05" stroke="#0284C7" strokeWidth="2" strokeDasharray="6 4" />
              <text x="95" y="110" fill="#38BDF8" fontSize="13" fontFamily="monospace" fontWeight="bold">PANEL 1 (Depillared Area)</text>
              <text x="95" y="130" fill="#94A3B8" fontSize="10" fontFamily="monospace">Seam Depth: -108m | Status: Active</text>

              {/* Pillars inside Panel 1 */}
              <rect x="120" y="160" width="45" height="45" rx="3" fill="#1E293B" stroke="#0284C7" strokeWidth="1" />
              <text x="128" y="188" fill="#E2E8F0" fontSize="10" fontFamily="monospace">P1</text>

              <rect x="190" y="160" width="45" height="45" rx="3" fill="#1E293B" stroke="#0284C7" strokeWidth="1" />
              <text x="198" y="188" fill="#E2E8F0" fontSize="10" fontFamily="monospace">P2</text>

              {/* High-Risk Yielding Pillar Area */}
              <rect x="260" y="160" width="45" height="45" rx="3" fill="#450A0A" stroke="#EF4444" strokeWidth="2" />
              <text x="268" y="188" fill="#FCA5A5" fontSize="10" fontFamily="monospace">P3</text>
              <circle cx="282" cy="182" r="16" stroke="#EF4444" strokeWidth="1.5" strokeDasharray="3 3" className="animate-ping" style={{ transformOrigin: '282px 182px' }} />

              {/* Suspicious Highlight Area */}
              <circle cx="282" cy="182" r="45" fill="#EF4444" fillOpacity="0.1" stroke="#EF4444" strokeWidth="1" strokeDasharray="4 4" />
              <text x="240" y="240" fill="#F87171" fontSize="10" fontFamily="monospace" fontWeight="bold">SUSPICIOUS ZONE</text>

              {/* Rover Marker Moving Towards Suspicious Zone */}
              <g transform="translate(190, 260)">
                <rect width="60" height="30" rx="4" fill="#F59E0B" fillOpacity="0.3" stroke="#F59E0B" strokeWidth="1.5" />
                <circle cx="15" cy="30" r="4" fill="#F59E0B" />
                <circle cx="45" cy="30" r="4" fill="#F59E0B" />
                <text x="8" y="18" fill="#FCD34D" fontSize="9" fontFamily="monospace" fontWeight="bold">ROVER-01</text>
                {/* Path line */}
                <line x1="60" y1="15" x2="85" y2="-55" stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="2 2" />
              </g>

              {/* Panel Boundary 2 (Adjacent) */}
              <rect x="420" y="80" width="300" height="260" rx="4" fill="#334155" fillOpacity="0.05" stroke="#475569" strokeWidth="1.5" strokeDasharray="4 4" />
              <text x="435" y="110" fill="#94A3B8" fontSize="12" fontFamily="monospace">PANEL 2 (Planned Extraction)</text>

              {/* Gateway Marker in Drift */}
              <g transform="translate(385, 370)">
                <circle cx="15" cy="15" r="12" fill="#0284C7" fillOpacity="0.4" stroke="#38BDF8" strokeWidth="2" />
                <circle cx="15" cy="15" r="4" fill="#38BDF8" />
                <text x="35" y="20" fill="#7DD3FC" fontSize="11" fontFamily="monospace" fontWeight="bold">CENTRAL GATEWAY (RPi 4B)</text>
              </g>
            </svg>

            {/* Map Legend Floating Box */}
            <div className="absolute bottom-4 right-4 p-3 rounded-xl bg-slate-900/90 border border-slate-800 backdrop-blur-md text-[11px] font-mono space-y-1">
              <div className="font-bold text-slate-300 text-xs mb-1">GIS Map Legend</div>
              <div className="flex items-center gap-2 text-emerald-400">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Stable Strata (LOW)
              </div>
              <div className="flex items-center gap-2 text-amber-400">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Rover Inspection Route
              </div>
              <div className="flex items-center gap-2 text-red-400">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span> Suspicious Area (HIGH)
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          14. ROVER VERIFICATION SECTION
          ========================================================================= */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl border border-amber-300/60 dark:border-slate-800 bg-gradient-to-br from-amber-50/30 via-white to-orange-50/20 dark:from-slate-900 dark:to-slate-800/90 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center gap-2">
                <RoverIcon size={28} className="text-amber-500" />
                <span className="text-xs font-mono font-bold tracking-widest text-amber-600 dark:text-amber-400 uppercase">
                  VERIFICATION ROBOTICS
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
                Verify Suspicious Areas with Rover-Based Inspection
              </h2>
              <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                The Digital Twin/GIS identifies a suspicious location. A camera-equipped rover can then be directed toward the location to capture visual information and support physical verification.
              </p>
              
              {/* Visual 5-Stage Workflow */}
              <div className="pt-4 flex flex-wrap items-center gap-2 text-xs font-mono">
                <span className="px-3 py-1 rounded-lg bg-white dark:bg-slate-800 border border-amber-300 dark:border-slate-700 font-bold text-slate-800 dark:text-slate-200">
                  1. Risk Location Identified
                </span>
                <span className="text-amber-500 font-bold">──►</span>
                <span className="px-3 py-1 rounded-lg bg-white dark:bg-slate-800 border border-amber-300 dark:border-slate-700 font-bold text-slate-800 dark:text-slate-200">
                  2. Rover Inspection
                </span>
                <span className="text-amber-500 font-bold">──►</span>
                <span className="px-3 py-1 rounded-lg bg-white dark:bg-slate-800 border border-amber-300 dark:border-slate-700 font-bold text-slate-800 dark:text-slate-200">
                  3. Camera Image Capture
                </span>
                <span className="text-amber-500 font-bold">──►</span>
                <span className="px-3 py-1 rounded-lg bg-white dark:bg-slate-800 border border-amber-300 dark:border-slate-700 font-bold text-slate-800 dark:text-slate-200">
                  4. Visual Information Returned
                </span>
                <span className="text-amber-500 font-bold">──►</span>
                <span className="px-3 py-1 rounded-lg bg-white dark:bg-slate-800 border border-amber-300 dark:border-slate-700 font-bold text-slate-800 dark:text-slate-200">
                  5. Operator Review
                </span>
              </div>
            </div>

            <div className="lg:col-span-4 p-6 rounded-2xl bg-white dark:bg-slate-800 border border-amber-200 dark:border-slate-700 shadow-md text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/15 text-amber-500 flex items-center justify-center mx-auto">
                <RoverIcon size={32} />
              </div>
              <h4 className="font-bold text-base text-slate-900 dark:text-white">Proposed Ground Rover</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Equipped with articulated camera mast, obstacle lighting, and RF communication module to relay physical feedback.
              </p>
              <span className="inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
                PROPOSED VALIDATION TOOL
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          15. ADAPTIVE COMMUNICATION SECTION
          ========================================================================= */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl border border-sky-300/60 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="inline-block text-xs font-mono font-bold tracking-widest text-sky-600 dark:text-sky-400 uppercase mb-2">
              INTELLIGENT BANDWIDTH & POWER MANAGEMENT
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-3">
              Communicate Smarter. Prioritize What Matters.
            </h2>
            <p className="text-base text-slate-600 dark:text-slate-400">
              The project's proposed adaptive data transfer concept conserves battery power during steady conditions while instantly scaling bandwidth during critical events.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="text-xs font-mono font-bold text-emerald-500 uppercase block mb-2">Normal Conditions</span>
              <h4 className="font-bold text-base mb-1">Routine Reporting</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Nodes remain in ultra-low power sleep states, transmitting heartbeats and slow sensor averages to conserve battery longevity.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="text-xs font-mono font-bold text-amber-500 uppercase block mb-2">Increasing Deviations</span>
              <h4 className="font-bold text-base mb-1">Higher Frequency</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                When baseline drift or minor vibrations are detected, sampling rates automatically increase to observe evolving ground dynamics.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="text-xs font-mono font-bold text-red-500 uppercase block mb-2">Significant Abnormal Readings</span>
              <h4 className="font-bold text-base mb-1">Prioritized Event Transmission</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Immediate preemption of regular traffic, triggering prioritized packet delivery to the gateway and local audible sirens.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          16. SMART INDIA HACKATHON 2026 SECTION
          ========================================================================= */}
      <section id="sih-2026" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl border border-cyan-300 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Hackathon Identity */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center gap-3">
                <SIHEmblem size={32} />
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-100 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-800">
                  NATIONAL INNOVATION CHALLENGE
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
                Smart India Hackathon 2026
              </h2>
              <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                SensOra is being developed for Smart India Hackathon 2026 under Problem Statement SIH26025, focusing on AI-enabled, low-cost mine subsidence monitoring, prediction, and early warning for underground coal mines in India.
              </p>

              {/* Official Project Metas */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs font-mono">
                <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span className="text-slate-500 block text-[10px]">TEAM NAME</span>
                  <span className="font-bold text-slate-900 dark:text-white">RTECH 007</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span className="text-slate-500 block text-[10px]">TEAM ID</span>
                  <span className="font-bold text-slate-900 dark:text-white">139029</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span className="text-slate-500 block text-[10px]">PROBLEM ID</span>
                  <span className="font-bold text-slate-900 dark:text-white">SIH26025</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span className="text-slate-500 block text-[10px]">THEME / CATEGORY</span>
                  <span className="font-bold text-slate-900 dark:text-white">Smart Auto / HW</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => scrollToSection('about')}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white shadow-md shadow-cyan-500/20 transition-all cursor-pointer"
                >
                  Explore Our Project
                </button>
              </div>
            </div>

            {/* Right: National Tri-color & Innovation Badge Card */}
            <div className="lg:col-span-4 p-6 rounded-2xl bg-gradient-to-br from-slate-50 to-cyan-50/50 dark:from-slate-900 dark:to-slate-800 border border-cyan-200 dark:border-slate-700 text-center space-y-3">
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-600 to-blue-700 flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-cyan-600/30">
                  SIH
                </div>
              </div>
              <div className="font-bold text-base text-slate-900 dark:text-white">
                Team RTECH 007
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Developing indigenous, low-cost subsurface safety technology for Indian mineral & coal strata.
              </p>
              <div className="text-[11px] font-mono text-cyan-600 dark:text-cyan-400 font-semibold">
                Ministry of Mines & Coal Initiative
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          17. OUR TEAM (EXACT 6 MEMBERS)
          ========================================================================= */}
      <section id="team" className="py-20 sm:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-xs font-mono font-bold tracking-widest text-cyan-600 dark:text-cyan-400 uppercase mb-3">
            THE INNOVATORS
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
            The Minds Behind SensOra
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400">
            A multidisciplinary team collaborating across hardware, AI/ML, embedded systems, software, CAD, and research to develop a mine subsidence monitoring solution.
          </p>
        </div>

        {/* 6 Team Profile Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {TEAM_MEMBERS.map((member, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:shadow-xl transition-all flex flex-col items-center text-center group"
            >
              {/* Initials Avatar */}
              <div
                className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${member.color} flex items-center justify-center text-white font-bold text-lg shadow-md mb-4 group-hover:scale-105 transition-transform`}
              >
                {member.initials}
              </div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white mb-1">
                {member.name}
              </h3>
              <h4 className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 mb-2 font-mono">
                {member.role}
              </h4>
              <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                {member.domain}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          18. OUR MENTORS (EXACT 2 MENTORS)
          ========================================================================= */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-block text-xs font-mono font-bold tracking-widest text-purple-600 dark:text-purple-400 uppercase mb-2">
            ACADEMIC & INDUSTRY GUIDANCE
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight mb-2">
            Guided by Experience
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Expert academic direction from Rathinam Technical Campus supporting hardware prototyping, design validation, and national hackathon preparation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {MENTORS.map((m, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl border border-purple-200 dark:border-slate-800 bg-gradient-to-br from-white via-purple-50/10 to-indigo-50/10 dark:from-slate-900 dark:to-slate-800/90 shadow-md flex items-center gap-5"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-700 text-white font-bold text-lg flex items-center justify-center shrink-0 shadow-md">
                {m.initials}
              </div>
              <div>
                <span className="text-[10px] font-mono text-purple-600 dark:text-purple-400 uppercase font-bold">
                  PROJECT MENTOR
                </span>
                <h3 className="font-bold text-base text-slate-900 dark:text-white mt-0.5">
                  {m.name}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                  {m.designation}
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-400">
                  {m.institution}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          19. FEASIBILITY, VIABILITY & CHALLENGES
          ========================================================================= */}
      <section className="py-20 sm:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-xs font-mono font-bold tracking-widest text-cyan-600 dark:text-cyan-400 uppercase mb-3">
            ENGINEERING VALIDATION
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
            Feasibility, Viability & Challenges
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400">
            Rigorous analysis of engineering practicality, operational viability, and proactive mitigation of subsurface challenges.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* FEASIBILITY */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md">
            <span className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400 uppercase block mb-3">
              1. FEASIBILITY
            </span>
            <ul className="space-y-3 text-xs text-slate-700 dark:text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-cyan-500 font-bold">✓</span>
                Uses readily available ESP32, multi-sensor, and LoRa hardware.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-500 font-bold">✓</span>
                Relies on low-cost, off-the-shelf hardware components.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-500 font-bold">✓</span>
                Surface-mounted nodes can reduce the need for hazardous underground intervention.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-500 font-bold">✓</span>
                Combines multi-sensor fusion and anomaly detection.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-500 font-bold">✓</span>
                Uses data buffering and redundant nodes to address connectivity gaps.
              </li>
            </ul>
          </div>

          {/* VIABILITY */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md">
            <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase block mb-3">
              2. VIABILITY
            </span>
            <ul className="space-y-3 text-xs text-slate-700 dark:text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">✓</span>
                Designed to integrate with existing mine monitoring workflows.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">✓</span>
                Focuses on reducing potential accident, downtime, and response costs.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">✓</span>
                Supports expansion from pilot installations to larger mine operations.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">✓</span>
                Provides continuous data for site-specific prediction.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">✓</span>
                Facilitates automated alerts to support faster safety decisions.
              </li>
            </ul>
          </div>

          {/* CHALLENGES & MITIGATIONS */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md">
            <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400 uppercase block mb-3">
              3. CHALLENGES & MITIGATIONS
            </span>
            <ul className="space-y-3 text-xs text-slate-700 dark:text-slate-300">
              <li>
                <span className="font-bold text-slate-900 dark:text-white block">Connectivity gaps:</span>
                Redundant mesh nodes and local flash memory data buffering.
              </li>
              <li>
                <span className="font-bold text-slate-900 dark:text-white block">Limited AI training data:</span>
                Unsupervised anomaly learning and field simulation validation.
              </li>
              <li>
                <span className="font-bold text-slate-900 dark:text-white block">False alarms:</span>
                Multi-sensor fusion voting and dynamic baseline learning.
              </li>
              <li>
                <span className="font-bold text-slate-900 dark:text-white block">Power interruptions:</span>
                Solar harvesting on surface and LiFePO4 battery backups.
              </li>
              <li>
                <span className="font-bold text-slate-900 dark:text-white block">Harsh conditions:</span>
                Rugged, IP67 waterproof, and flame-retardant enclosures.
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* =========================================================================
          20. IMPACT & BENEFITS (5 CARDS)
          ========================================================================= */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="inline-block text-xs font-mono font-bold tracking-widest text-cyan-600 dark:text-cyan-400 uppercase mb-3">
            BROADER IMPLICATIONS
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
            Technology for People. Safety for Generations.
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400">
            Anticipated socioeconomic, human safety, and environmental benefits for Indian mining operations.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {impacts.map((imp, idx) => (
            <div
              key={idx}
              className={`p-5 rounded-2xl border transition-all bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between ${imp.accent}`}
            >
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider block mb-1">
                  {imp.title}
                </span>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-2">
                  {imp.tagline}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {imp.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          21. FAQ SECTION (8 ACCORDION ITEMS)
          ========================================================================= */}
      <section id="faq" className="py-20 sm:py-28 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block text-xs font-mono font-bold tracking-widest text-cyan-600 dark:text-cyan-400 uppercase mb-3">
            FREQUENTLY ASKED QUESTIONS
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
            Questions & Honest Insights
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-400">
            Clear technical clarification regarding our hardware, algorithms, and real developmental status.
          </p>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx
            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden transition-all"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 font-bold text-base text-slate-900 dark:text-white hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <span className={`p-1 rounded-lg transition-transform duration-200 ${isOpen ? 'rotate-180 text-cyan-500' : 'text-slate-400'}`}>
                    <ChevronDownIcon size={18} />
                  </span>
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/80">
                    {faq.a}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* =========================================================================
          22. FOOTER
          ========================================================================= */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#080C14] py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-slate-100 dark:border-slate-800/90">
            {/* Left: SensOra Logo & Tagline */}
            <div className="md:col-span-5 space-y-3">
              <div className="flex items-center gap-3">
                <SensoraLogo size={32} />
                <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
                  SensOra
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Safer Mines, Stronger Tomorrows
              </p>
              <p className="text-xs text-slate-500 italic max-w-sm">
                “When the ground begins to whisper, we must listen before it screams.”
              </p>
            </div>

            {/* Center: Quick Links */}
            <div className="md:col-span-3 space-y-2">
              <span className="text-xs font-mono font-bold uppercase text-slate-400 block mb-1">
                Navigation
              </span>
              <div className="flex flex-col space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                <button onClick={() => scrollToSection('about')} className="text-left hover:text-cyan-500">About SensOra</button>
                <button onClick={() => scrollToSection('how-it-works')} className="text-left hover:text-cyan-500">How It Works</button>
                <button onClick={() => scrollToSection('three-stage')} className="text-left hover:text-cyan-500">3-Stage Workflow</button>
                <button onClick={() => scrollToSection('technology')} className="text-left hover:text-cyan-500">Technology</button>
                <button onClick={() => scrollToSection('sensors')} className="text-left hover:text-cyan-500">Sensor Architecture</button>
                <button onClick={() => scrollToSection('team')} className="text-left hover:text-cyan-500">Team RTECH 007</button>
                <button onClick={() => scrollToSection('faq')} className="text-left hover:text-cyan-500">FAQ</button>
                <button onClick={onNavigateToDashboard} className="text-left text-cyan-600 font-bold hover:underline">Monitor Dashboard ↗</button>
              </div>
            </div>

            {/* Right: SIH2026 details */}
            <div className="md:col-span-4 space-y-2">
              <span className="text-xs font-mono font-bold uppercase text-slate-400 block mb-1">
                Hackathon Submission
              </span>
              <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1 font-mono">
                <p>Smart India Hackathon 2026</p>
                <p>Team: <span className="font-bold text-slate-900 dark:text-white">RTECH 007</span></p>
                <p>Team ID: <span className="font-bold text-slate-900 dark:text-white">139029</span></p>
                <p>Problem Statement: <span className="font-bold text-slate-900 dark:text-white">SIH26025</span></p>
                <p>Theme: Smart Automation | Category: Hardware</p>
              </div>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
            <div>
              <span>© 2026 SensOra. All rights reserved.</span>
            </div>
            <div className="font-mono text-[11px] text-cyan-600 dark:text-cyan-400">
              “Technology for People | Safety for Generations”
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
