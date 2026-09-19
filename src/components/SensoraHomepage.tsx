import React, { useState } from 'react'
import { useTheme } from '../context/ThemeContext'
import {
  SensoraLogo,
  SIHEmblem,
  ExternalLinkIcon,
  ChevronRightIcon,
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
} from './icons'
import SensoraHeroGraphic from './SensoraHeroGraphic'

interface SensoraHomepageProps {
  onNavigateToDashboard: () => void
}

export default function SensoraHomepage({ onNavigateToDashboard }: SensoraHomepageProps) {
  const { theme, colors, toggleTheme } = useTheme()
  const isDark = colors.isDark

  // FAQ interactive state
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  // Active interactive flow step in About section
  const [activeFlowStep, setActiveFlowStep] = useState<number>(0)

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // Quick Feature Cards Data
  const quickFeatures = [
    {
      title: 'Multi-Sensor Monitoring',
      desc: 'Tracks ground movement, vibration, acoustic activity, and environmental conditions.',
      icon: <SensorIcon className="text-orange-500" size={26} />,
      badge: 'Hardware Telemetry',
      accent: 'border-orange-500/30 hover:border-orange-500',
    },
    {
      title: 'LoRa Mesh Communication',
      desc: 'Designed for long-range sensor data transmission with gateway-based collection.',
      icon: <RadioWaveIcon className="text-sky-500" size={26} />,
      badge: 'Sub-GHz SX1278',
      accent: 'border-sky-500/30 hover:border-sky-500',
    },
    {
      title: 'AI-Based Anomaly Detection',
      desc: 'Analyzes sensor patterns to identify unusual behavior and support risk assessment.',
      icon: <BrainCpuIcon className="text-emerald-500" size={26} />,
      badge: 'LSTM & ML Scoring',
      accent: 'border-emerald-500/30 hover:border-emerald-500',
    },
    {
      title: 'Early Warning & Visualization',
      desc: 'Presents risk levels, sensor readings, and location-specific information for operator review.',
      icon: <BellAlertIcon className="text-amber-500" size={26} />,
      badge: 'Real-Time Alerting',
      accent: 'border-amber-500/30 hover:border-amber-500',
    },
  ]

  // About Visual Flow Data
  const flowSteps = [
    {
      step: '01',
      title: 'Sensor Nodes',
      sub: 'ESP32 + Strata Sensors',
      desc: 'Low-power microcontroller nodes installed across active mine panels and rock pillars, sampling tilt angles, vibration, and environmental factors.',
      icon: <SensorIcon size={24} />,
      status: 'Implemented (NODE01)',
      statusColor: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
    },
    {
      step: '02',
      title: 'LoRa Link',
      sub: 'SX1278 Transceivers',
      desc: 'Sub-GHz wireless packet broadcast that penetrates dense geological strata and curved coal gallery tunnels without line-of-sight cables.',
      icon: <RadioWaveIcon size={24} />,
      status: 'Implemented',
      statusColor: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
    },
    {
      step: '03',
      title: 'Gateway',
      sub: 'Raspberry Pi 4B',
      desc: 'Intake drift aggregator running an edge Mosquitto MQTT broker, caching telemetry packets and routing to surface IP networks.',
      icon: <GatewayIcon size={24} />,
      status: 'Implemented',
      statusColor: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
    },
    {
      step: '04',
      title: 'Cloud & AI',
      sub: 'FastAPI + Anomaly Model',
      desc: 'Backend processing pipeline running baseline feature extraction, dynamic scaling, and planned neural anomaly scoring.',
      icon: <BrainCpuIcon size={24} />,
      status: 'Backend Live & Model Ready',
      statusColor: 'text-orange-500 bg-orange-500/10 border-orange-500/20',
    },
    {
      step: '05',
      title: 'Dashboard',
      sub: 'React + Digital Twin',
      desc: 'Operator interface displaying GIS panels, 2D/3D strata cross-sections, live telemetry tables, and exportable regulatory audit reports.',
      icon: <DashboardMonitorIcon size={24} />,
      status: 'Fully Operational',
      statusColor: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
    },
    {
      step: '06',
      title: 'Alerts',
      sub: 'Instant Notification',
      desc: 'Multi-tier warnings (Low, Medium, High) broadcast to WebSocket subscribers and safety personnel for immediate response.',
      icon: <BellAlertIcon size={24} />,
      status: 'Integrated',
      statusColor: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    },
  ]

  // How It Works Steps
  const howItWorksSteps = [
    {
      num: '1',
      title: 'SENSE',
      highlight: 'Ground Movement & Environment',
      desc: 'Distributed sensor nodes collect ground movement, vibration, acoustic activity, and environmental readings.',
      badge: 'Hardware Verified',
      isImplemented: true,
      tags: ['Tilt X/Y MPU6050', 'Piezo Vibration', 'Soil ADC', 'Temp & Humidity'],
    },
    {
      num: '2',
      title: 'TRANSMIT',
      highlight: 'Sub-GHz LoRa Wireless',
      desc: 'ESP32-based nodes send data through SX1278 LoRa communication to the gateway.',
      badge: 'Subsurface Verified',
      isImplemented: true,
      tags: ['868 MHz Band', 'Long Range Chirp', 'Low Power Sleep Mode'],
    },
    {
      num: '3',
      title: 'COLLECT',
      highlight: 'Edge Aggregation & Buffering',
      desc: 'The Raspberry Pi 4B gateway receives readings and supports local data handling and onward communication.',
      badge: 'Edge Node Live',
      isImplemented: true,
      tags: ['Mosquitto MQTT', 'Local Store & Forward', 'IP Network Uplink'],
    },
    {
      num: '4',
      title: 'ANALYZE',
      highlight: 'Intelligent Pattern Anomaly',
      desc: 'The backend processes incoming data. The planned AI model uses anomaly detection to identify unusual patterns.',
      badge: 'Algorithmic Pipeline',
      isImplemented: true,
      tags: ['Feature Normalization', 'Dynamic Baseline', 'LSTM Anomaly Detection (Planned)'],
    },
    {
      num: '5',
      title: 'VISUALIZE',
      highlight: 'Interactive 2D/3D Digital Twin',
      desc: 'The dashboard displays sensor readings, trends, risk indicators, and mine locations.',
      badge: 'Dashboard Live',
      isImplemented: true,
      tags: ['GIS Panel Boundaries', 'Strata Cross-Section', 'Live Telemetry Table'],
    },
    {
      num: '6',
      title: 'ALERT',
      highlight: 'Operator Warning & Action',
      desc: 'When configured conditions are met, the system can issue notifications to support operator review and response.',
      badge: 'Operational Safety',
      isImplemented: true,
      tags: ['Audible/Visual Warnings', 'Safety Thresholds', 'PDF Incident Export'],
    },
  ]

  // Technology Stack Data
  const technologies = [
    {
      name: 'ESP32',
      category: 'Embedded Controller',
      desc: 'Ultra-low power microcontroller managing sensor ADC sampling, I2C IMU interrupts, and battery power conservation.',
      accent: '#EA580C',
    },
    {
      name: 'SX1278 LoRa',
      category: 'Wireless Transceiver',
      desc: 'Sub-GHz radio frequency modulation offering high penetration through underground rock strata and long gallery drifts.',
      accent: '#0284C7',
    },
    {
      name: 'Raspberry Pi 4B',
      category: 'Gateway & Edge Aggregator',
      desc: 'Robust underground intake drift node orchestrating MQTT subscriptions, data buffering, and uplink telemetry forwarding.',
      accent: '#DC2626',
    },
    {
      name: 'MQTT / Mosquitto',
      category: 'Messaging Protocol',
      desc: 'Lightweight publish/subscribe messaging infrastructure delivering sensor telemetry with minimal packet overhead.',
      accent: '#059669',
    },
    {
      name: 'Zoho Catalyst',
      category: 'Cloud Backend & Data Services',
      desc: 'Scalable cloud serverless architecture facilitating secure multi-tenant data storage and serverless integration.',
      accent: '#F59E0B',
    },
    {
      name: 'TensorFlow / TFLite',
      category: 'AI & Edge Inference',
      desc: 'Predictive neural networks and lightweight edge models trained for multivariate subsidence anomaly identification.',
      accent: '#EA580C',
    },
    {
      name: 'Leaflet',
      category: 'GIS Geospatial Mapping',
      desc: 'Interactive coordinate mapping of underground panel boundaries, retreat lines, and physical node coordinates.',
      accent: '#10B981',
    },
    {
      name: 'Plotly',
      category: 'Sensor Analytics & Trends',
      desc: 'High-density multi-axis telemetry graphs depicting tilt variance, strata micro-strain, and environmental metrics.',
      accent: '#6366F1',
    },
    {
      name: 'Three.js',
      category: '3D Digital Twin Visualization',
      desc: 'Interactive 3D structural modeling of geological strata layers, void goaf areas, and safety pillars.',
      accent: '#8B5CF6',
    },
    {
      name: 'React 19',
      category: 'Executive Dashboard UI',
      desc: 'High-performance reactive frontend featuring real-time WebSocket ingestion, live tables, and instant audit reporting.',
      accent: '#0284C7',
    },
  ]

  // Team Members Data
  const teamMembers = [
    {
      name: 'Sudharsan D.',
      role: 'Team Lead & System Design',
      initials: 'SD',
      tag: 'Leadership & Architecture',
      color: 'from-orange-500 to-amber-600',
    },
    {
      name: 'Chandru P',
      role: 'Hardware Integration',
      initials: 'CP',
      tag: 'Circuits & Embedded',
      color: 'from-sky-500 to-blue-600',
    },
    {
      name: 'Prabu Kumar S.P',
      role: 'AI & Software',
      initials: 'PK',
      tag: 'Machine Learning',
      color: 'from-purple-500 to-indigo-600',
    },
    {
      name: 'Saranya D',
      role: 'Sensor & Data Analysis',
      initials: 'SD',
      tag: 'Telemetry Analytics',
      color: 'from-emerald-500 to-teal-600',
    },
    {
      name: 'Larsha Sreethi Jersika',
      role: 'Web & Dashboard',
      initials: 'LJ',
      tag: 'Frontend Engineering',
      color: 'from-pink-500 to-rose-600',
    },
    {
      name: 'Adithyan',
      role: 'Rover & Navigation',
      initials: 'AD',
      tag: 'Robotics & Field Telemetry',
      color: 'from-cyan-500 to-teal-600',
    },
    {
      name: 'Periya Samy',
      role: 'Documentation & Presentation',
      initials: 'PS',
      tag: 'Technical Writing',
      color: 'from-amber-500 to-orange-600',
    },
    {
      name: 'Manjula',
      role: 'Research & Coordination',
      initials: 'MJ',
      tag: 'Geological Research',
      color: 'from-indigo-500 to-blue-600',
    },
  ]

  // FAQ Data
  const faqs = [
    {
      q: 'What is SENSORA?',
      a: 'SENSORA is an AI-enabled, low-cost mine subsidence monitoring and early warning system developed for Smart India Hackathon 2026. It combines battery-efficient subsurface wireless sensor nodes, LoRa telemetry, edge gateway processing, and an interactive digital twin dashboard to detect abnormal strata behavior in underground coal mines.',
    },
    {
      q: 'What is mine subsidence?',
      a: 'Mine subsidence is the gradual or sudden caving in and sinking of the earth’s surface or overlying strata caused by underground mining activities (such as longwall extraction or board-and-pillar extraction). Without early detection, subsidence can cause roof collapses, damage to surface infrastructure, and jeopardize mineworker safety.',
    },
    {
      q: 'How do the sensor nodes communicate in underground coal mines?',
      a: 'Underground coal mines present heavy RF attenuation and long galleries. SENSORA utilizes SX1278 LoRa transceivers operating in the sub-GHz spectrum (868 MHz). LoRa’s chirped spread spectrum (CSS) modulation penetrates rock strata and diffracts around gallery corners far more effectively than Wi-Fi or Bluetooth, enabling reliable transmission to the intake drift gateway without laying expensive cables.',
    },
    {
      q: 'What does the AI model do?',
      a: 'The AI engine processes continuous streams of multi-sensor telemetry (tilt magnitude, vibration frequency, moisture levels, and temperature). It normalizes the data against historical baseline strata behavior and runs anomaly detection algorithms (such as LSTM autoencoders and Isolation Forests) to detect sudden deviations that indicate impending pillar yielding or roof fracturing.',
    },
    {
      q: 'How are abnormal readings presented to mine operators?',
      a: 'The SENSORA dashboard provides visual color-coded risk indicators (LOW in green, MEDIUM in amber, HIGH in red). Operators can view real-time values on an interactive GIS map, examine 2D/3D stratigraphic cross-sections of geological layers, track rate-of-change trend curves, and generate PDF compliance audit reports in one click.',
    },
    {
      q: 'Does SENSORA replace mine safety inspections?',
      a: 'No. SENSORA is engineered as an advanced decision-support and continuous monitoring tool designed to complement and empower mine safety managers and DGMS (Directorate General of Mines Safety) guidelines. It does not replace statutory physical inspections, certified overman rounds, or regulatory geotechnical evaluations.',
    },
  ]

  return (
    <div className={`min-h-screen font-sans ${isDark ? 'bg-[#12100E] text-[#EDE6DA]' : 'bg-[#FFFBF7] text-[#0F172A]'}`}>
      {/* =========================================================================
          1. TOP NAVIGATION BAR
          ========================================================================= */}
      <header
        className={`sticky top-0 z-50 transition-colors duration-200 border-b ${
          isDark
            ? 'bg-[#1C1914]/90 backdrop-blur-md border-[#2E2820]'
            : 'bg-white/90 backdrop-blur-md border-[#FED7AA]/60 shadow-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          {/* Left: Logo & Tagline */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500/10 to-amber-500/20 border border-orange-500/30 shadow-sm">
              <SensoraLogo size={28} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 bg-clip-text text-transparent">
                  SENSORA
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-400 border border-orange-300 dark:border-orange-800">
                  SIH 2026
                </span>
              </div>
              <p className={`text-[11px] font-medium hidden md:block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Safer Mines, Stronger Tomorrows
              </p>
            </div>
          </div>

          {/* Center Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium">
            <button
              onClick={() => scrollToSection('about')}
              className={`transition-colors hover:text-orange-600 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}
            >
              About
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className={`transition-colors hover:text-orange-600 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection('technology')}
              className={`transition-colors hover:text-orange-600 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}
            >
              Technology
            </button>
            <button
              onClick={() => scrollToSection('sih-2026')}
              className={`transition-colors hover:text-orange-600 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}
            >
              SIH 2026
            </button>
            <button
              onClick={() => scrollToSection('team')}
              className={`transition-colors hover:text-orange-600 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}
            >
              Team
            </button>
            <button
              onClick={() => scrollToSection('faq')}
              className={`transition-colors hover:text-orange-600 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}
            >
              FAQ
            </button>
          </nav>

          {/* Right: Badges, Theme Toggle & Monitor Button */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* SIH 2026 Badge Pill */}
            <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
              <span>Smart India Hackathon</span>
            </div>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle Light/Dark Theme"
              className={`p-2 rounded-lg border transition-all ${
                isDark
                  ? 'bg-slate-800/80 border-slate-700 text-amber-400 hover:bg-slate-700'
                  : 'bg-orange-50 border-orange-200 text-orange-600 hover:bg-orange-100'
              }`}
            >
              {isDark ? <SunIcon size={18} /> : <MoonIcon size={18} />}
            </button>

            {/* Prominent Monitor Button */}
            <button
              onClick={onNavigateToDashboard}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg font-semibold text-sm text-white bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 shadow-md shadow-orange-500/25 hover:shadow-orange-500/40 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              <span>Monitor</span>
              <ExternalLinkIcon size={15} />
            </button>
          </div>
        </div>
      </header>

      {/* =========================================================================
          2. HERO SECTION
          ========================================================================= */}
      <section className="relative min-h-[640px] lg:min-h-[720px] flex items-center justify-center overflow-hidden bg-slate-950 text-white">
        {/* Background Image with Dark Navy Gradient Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-700"
          style={{
            backgroundImage: `url('/assets/coal_mine_hero.jpg')`,
          }}
        >
          {/* Dark Navy / Charcoal Overlays for maximum text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/85 to-slate-900/80"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/60"></div>
        </div>

        {/* Ambient Orange & Cyan Light Flares */}
        <div className="absolute top-1/4 left-10 w-96 h-96 bg-orange-600/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-sky-600/15 rounded-full blur-3xl pointer-events-none"></div>

        {/* Hero Content Container */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Heading & Narrative */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Status Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-semibold bg-orange-500/15 text-orange-400 border border-orange-500/30 backdrop-blur-sm">
                <span className="w-2 h-2 rounded-full bg-orange-400 animate-ping"></span>
                <span>SMART INDIA HACKATHON 2026 • TEAM SENSORA</span>
              </div>

              {/* Main Heading */}
              <div className="space-y-2">
                <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-none">
                  SENSORA
                </h1>
                <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-200 bg-clip-text text-transparent">
                  Smarter Monitoring. Safer Mining.
                </h2>
              </div>

              {/* Supporting Text */}
              <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
                An AI-enabled, low-cost mine subsidence monitoring and early warning system designed to monitor ground conditions, detect abnormal behavior, and support safer decisions in underground coal mines.
              </p>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  onClick={() => scrollToSection('how-it-works')}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-semibold text-sm text-slate-900 bg-white hover:bg-orange-50 shadow-lg shadow-white/10 transition-all transform hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Explore Our Solution</span>
                  <ChevronDownIcon size={16} />
                </button>

                <button
                  onClick={onNavigateToDashboard}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 shadow-lg shadow-orange-600/30 transition-all transform hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Monitor Dashboard</span>
                  <ExternalLinkIcon size={16} />
                </button>
              </div>

              {/* Motto Under Buttons */}
              <div className="pt-2">
                <p className="text-xs sm:text-sm font-medium tracking-wide text-orange-300/90 font-mono">
                  “From Data to Safety, From Insight to Impact.”
                </p>
              </div>
            </div>

            {/* Right Column: Visual Architectural Diagram Illustration */}
            <div className="lg:col-span-5">
              <SensoraHeroGraphic />
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. QUICK FEATURE CARDS
          ========================================================================= */}
      <section className="relative -mt-8 sm:-mt-12 z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {quickFeatures.map((feat, idx) => (
            <div
              key={idx}
              className={`p-6 rounded-2xl border transition-all duration-200 transform hover:-translate-y-1 shadow-lg ${feat.accent} ${
                isDark
                  ? 'bg-[#1C1914]/95 backdrop-blur-md text-slate-200 shadow-black/40'
                  : 'bg-white text-slate-800 shadow-orange-500/5'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/80">
                  {feat.icon}
                </div>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20">
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
          4. ABOUT SENSORA & VISUAL FLOW
          ========================================================================= */}
      <section id="about" className="py-20 sm:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-xs font-mono font-bold tracking-widest text-orange-600 dark:text-orange-400 uppercase mb-3">
            ABOUT OUR PROJECT
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
            Making Mine Conditions Visible
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
            SENSORA combines distributed sensing, wireless communication, AI-based analysis, and a monitoring dashboard to support continuous observation of mine conditions and early identification of abnormal behavior.
          </p>
        </div>

        {/* Interactive Visual Flow */}
        <div className="rounded-3xl border border-orange-200 dark:border-slate-800 bg-white dark:bg-[#1C1914] p-6 sm:p-10 shadow-xl shadow-orange-500/5">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                End-to-End System Pipeline
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Continuous data movement from subterranean strata to decision-support alerts
              </p>
            </div>
            <span className="hidden sm:inline-flex text-xs font-mono text-orange-600 dark:text-orange-400 font-semibold">
              Click step to view telemetry role
            </span>
          </div>

          {/* Flow Stepper Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {flowSteps.map((s, idx) => (
              <button
                key={idx}
                onClick={() => setActiveFlowStep(idx)}
                className={`text-left p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
                  activeFlowStep === idx
                    ? 'border-orange-500 bg-orange-50/70 dark:bg-orange-950/40 shadow-md ring-1 ring-orange-500'
                    : 'border-slate-200 dark:border-slate-800 hover:border-orange-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-bold text-orange-600 dark:text-orange-400">
                    {s.step}
                  </span>
                  <div className={`p-1.5 rounded-lg ${activeFlowStep === idx ? 'text-orange-600' : 'text-slate-400'}`}>
                    {s.icon}
                  </div>
                </div>
                <div className="font-bold text-xs text-slate-900 dark:text-white truncate">
                  {s.title}
                </div>
                <div className="text-[10px] text-slate-500 truncate">
                  {s.sub}
                </div>
              </button>
            ))}
          </div>

          {/* Active Flow Detail Callout */}
          <div className="mt-8 p-6 rounded-2xl bg-orange-50/50 dark:bg-slate-900/80 border border-orange-200 dark:border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-orange-600 dark:text-orange-400 uppercase">
                  Step {flowSteps[activeFlowStep].step} — {flowSteps[activeFlowStep].title} ({flowSteps[activeFlowStep].sub})
                </span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-semibold ${flowSteps[activeFlowStep].statusColor}`}>
                  {flowSteps[activeFlowStep].status}
                </span>
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-300 max-w-3xl">
                {flowSteps[activeFlowStep].desc}
              </p>
            </div>
            <button
              onClick={onNavigateToDashboard}
              className="shrink-0 px-4 py-2 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <span>View in Dashboard</span>
              <ArrowRightIcon size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. MISSION & VISION
          ========================================================================= */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Mission Card */}
          <div className="p-8 sm:p-10 rounded-3xl border border-orange-200 dark:border-slate-800 bg-gradient-to-br from-white via-orange-50/30 to-amber-50/20 dark:from-[#1C1914] dark:to-[#242018] shadow-xl shadow-orange-500/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-orange-500/10 rounded-full blur-2xl pointer-events-none"></div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-2xl bg-orange-500/15 text-orange-600 dark:text-orange-400 border border-orange-500/20">
                <TargetIcon size={28} />
              </div>
              <div>
                <span className="text-[11px] font-mono uppercase font-bold text-orange-600 dark:text-orange-400">
                  OUR PURPOSE
                </span>
                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                  Our Mission
                </h3>
              </div>
            </div>
            <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed mb-6 font-medium">
              “To develop an affordable, intelligent, and scalable monitoring system that helps identify abnormal ground behavior and supports timely safety decisions in underground mines.”
            </p>
            <div className="flex flex-wrap gap-2 text-xs font-mono">
              <span className="px-2.5 py-1 rounded-md bg-white dark:bg-slate-800 border border-orange-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-medium">
                ✓ Low-Cost Architecture
              </span>
              <span className="px-2.5 py-1 rounded-md bg-white dark:bg-slate-800 border border-orange-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-medium">
                ✓ DGMS Alignment
              </span>
              <span className="px-2.5 py-1 rounded-md bg-white dark:bg-slate-800 border border-orange-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-medium">
                ✓ Zero Fatalities Goal
              </span>
            </div>
          </div>

          {/* Vision Card */}
          <div className="p-8 sm:p-10 rounded-3xl border border-sky-200 dark:border-slate-800 bg-gradient-to-br from-white via-sky-50/30 to-blue-50/20 dark:from-[#1C1914] dark:to-[#1E2530] shadow-xl shadow-sky-500/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-sky-500/10 rounded-full blur-2xl pointer-events-none"></div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-2xl bg-sky-500/15 text-sky-600 dark:text-sky-400 border border-sky-500/20">
                <EyeVisionIcon size={28} />
              </div>
              <div>
                <span className="text-[11px] font-mono uppercase font-bold text-sky-600 dark:text-sky-400">
                  OUR HORIZON
                </span>
                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                  Our Vision
                </h3>
              </div>
            </div>
            <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed mb-6 font-medium">
              “To contribute to safer mining operations through continuous monitoring, accessible technology, and data-driven awareness of subsidence risks.”
            </p>
            <div className="flex flex-wrap gap-2 text-xs font-mono">
              <span className="px-2.5 py-1 rounded-md bg-white dark:bg-slate-800 border border-sky-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-medium">
                ✓ Indian Coal Seams
              </span>
              <span className="px-2.5 py-1 rounded-md bg-white dark:bg-slate-800 border border-sky-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-medium">
                ✓ Strata Digital Twin
              </span>
              <span className="px-2.5 py-1 rounded-md bg-white dark:bg-slate-800 border border-sky-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-medium">
                ✓ Proactive Evacuation
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          6. HOW IT WORKS
          ========================================================================= */}
      <section id="how-it-works" className="py-20 sm:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-xs font-mono font-bold tracking-widest text-orange-600 dark:text-orange-400 uppercase mb-3">
            TECHNICAL WORKFLOW
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
            How SENSORA Works
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400">
            A 6-step operational cycle from rock pillar instrumentation to actionable operator warnings.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {howItWorksSteps.map((step, idx) => (
            <div
              key={idx}
              className="p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1C1914] shadow-lg shadow-orange-500/5 flex flex-col justify-between hover:border-orange-400 dark:hover:border-orange-500/50 transition-all duration-200"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-orange-500 text-white font-black text-sm shadow-md shadow-orange-500/30">
                    {step.num}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    {step.badge}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                  {step.title}
                </h3>
                <h4 className="text-xs font-semibold text-orange-600 dark:text-orange-400 font-mono mb-3">
                  {step.highlight}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                  {step.desc}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap gap-1.5">
                {step.tags.map((tag, tIdx) => (
                  <span
                    key={tIdx}
                    className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          7. TECHNOLOGY SECTION
          ========================================================================= */}
      <section id="technology" className="py-20 sm:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-xs font-mono font-bold tracking-widest text-orange-600 dark:text-orange-400 uppercase mb-3">
            ROBUST MINING-GRADE STACK
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
            Technology Behind SENSORA
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400">
            Engineered with proven hardware, resilient sub-GHz telemetry, and high-performance full-stack web technologies.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {technologies.map((tech, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1C1914] hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono font-bold text-orange-600 dark:text-orange-400">
                    0{idx + 1}
                  </span>
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: tech.accent }}></span>
                </div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white mb-1">
                  {tech.name}
                </h3>
                <h4 className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 font-mono mb-2">
                  {tech.category}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {tech.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          8. SMART INDIA HACKATHON SECTION
          ========================================================================= */}
      <section id="sih-2026" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl border border-orange-300 dark:border-slate-800 bg-white dark:bg-[#1C1914] shadow-2xl shadow-orange-500/10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Hackathon Identity */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center gap-3">
                <SIHEmblem size={32} />
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300 border border-orange-300 dark:border-orange-800">
                  NATIONAL INNOVATION CHALLENGE
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
                Smart India Hackathon 2026
              </h2>
              <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                SENSORA is being developed as a solution for Smart India Hackathon 2026, with a focus on AI-enabled, low-cost mine subsidence monitoring and early warning for underground coal mines in India.
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
                  <span className="text-orange-500 font-bold">Team:</span>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono">
                    TEAM SENSORA
                  </span>
                </div>
                <button
                  onClick={() => scrollToSection('technology')}
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-orange-600 hover:bg-orange-500 text-white shadow-md shadow-orange-500/20 transition-all cursor-pointer"
                >
                  Explore Our Project
                </button>
              </div>
            </div>

            {/* Right: National Tri-color & Innovation Badge Card */}
            <div className="lg:col-span-4 p-6 rounded-2xl bg-gradient-to-br from-slate-50 to-orange-50/50 dark:from-slate-900 dark:to-slate-800/80 border border-orange-200 dark:border-slate-700 text-center space-y-3">
              <div className="flex justify-center">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-orange-500/30">
                  SIH
                </div>
              </div>
              <div className="font-bold text-base text-slate-900 dark:text-white">
                Student Innovation Initiative
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Fostering self-reliant mining safety hardware and edge AI monitoring for Indian mineral seams.
              </p>
              <div className="text-[11px] font-mono text-orange-600 dark:text-orange-400 font-semibold">
                Ministry of Mines & Coal Context
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          9. OUR TEAM
          ========================================================================= */}
      <section id="team" className="py-20 sm:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-xs font-mono font-bold tracking-widest text-orange-600 dark:text-orange-400 uppercase mb-3">
            COLLABORATIVE EXCELLENCE
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
            The Minds Behind SENSORA
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400">
            A team collaborating across software, hardware, AI, research, and design to develop a mine monitoring solution.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamMembers.map((member, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1C1914] hover:shadow-xl transition-all duration-200 flex flex-col items-center text-center group"
            >
              {/* Stylized Avatar Placeholder with Initials */}
              <div
                className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${member.color} flex items-center justify-center text-white font-bold text-lg shadow-md mb-4 group-hover:scale-105 transition-transform duration-200`}
              >
                {member.initials}
              </div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white mb-1">
                {member.name}
              </h3>
              <h4 className="text-xs font-semibold text-orange-600 dark:text-orange-400 mb-3">
                {member.role}
              </h4>
              <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                {member.tag}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          10. FAQ SECTION
          ========================================================================= */}
      <section id="faq" className="py-20 sm:py-28 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block text-xs font-mono font-bold tracking-widest text-orange-600 dark:text-orange-400 uppercase mb-3">
            FREQUENTLY ASKED QUESTIONS
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
            Everything You Need to Know
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-400">
            Clear insights into SENSORA’s engineering, subsurface communication, and safety governance.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx
            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1C1914] overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 font-bold text-base text-slate-900 dark:text-white hover:text-orange-600 dark:hover:text-orange-400 transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <span className={`p-1 rounded-lg transition-transform duration-200 ${isOpen ? 'rotate-180 text-orange-600' : 'text-slate-400'}`}>
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
          11. CALL TO ACTION & FOOTER
          ========================================================================= */}
      <section className="py-16 bg-gradient-to-b from-transparent to-orange-500/10 dark:to-orange-950/20 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Experience the SENSORA Live Digital Twin
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Explore live sensor node telemetry, GIS panel coordinates, real-time alert logs, and cross-sectional strata models.
          </p>
          <div className="pt-2">
            <button
              onClick={onNavigateToDashboard}
              className="px-8 py-4 rounded-xl font-bold text-base text-white bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 shadow-xl shadow-orange-500/30 transition-all transform hover:-translate-y-0.5 cursor-pointer inline-flex items-center gap-2"
            >
              <span>Launch Monitoring Dashboard</span>
              <ExternalLinkIcon size={18} />
            </button>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#15120F] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-100 dark:border-slate-800">
            {/* Logo & Tagline */}
            <div className="flex items-center gap-3">
              <SensoraLogo size={32} />
              <div>
                <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white">
                  SENSORA
                </span>
                <p className="text-xs text-slate-500">
                  Safer Mines, Stronger Tomorrows
                </p>
              </div>
            </div>

            {/* Quick Links */}
            <div className="flex flex-wrap justify-center gap-6 text-xs font-semibold text-slate-600 dark:text-slate-400">
              <button onClick={() => scrollToSection('about')} className="hover:text-orange-600 transition-colors">
                About
              </button>
              <button onClick={() => scrollToSection('how-it-works')} className="hover:text-orange-600 transition-colors">
                How It Works
              </button>
              <button onClick={() => scrollToSection('technology')} className="hover:text-orange-600 transition-colors">
                Technology
              </button>
              <button onClick={() => scrollToSection('team')} className="hover:text-orange-600 transition-colors">
                Team
              </button>
              <button onClick={() => scrollToSection('faq')} className="hover:text-orange-600 transition-colors">
                FAQ
              </button>
              <button onClick={onNavigateToDashboard} className="text-orange-600 font-bold hover:underline">
                Dashboard ↗
              </button>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
            <div>
              <span>© 2026 SENSORA. Smart India Hackathon 2026.</span>
            </div>
            <div className="font-mono text-[11px] text-orange-600 dark:text-orange-400">
              “Technology for People | Safety for Generations”
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
