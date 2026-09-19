// SensOra — SIH 2026 Official Project & Team Data
// Team: RTECH 007 | Problem Statement: SIH26025 | Team ID: 139029

export interface TeamMember {
  name: string
  role: string
  initials: string
  domain: string
  color: string
}

export interface Mentor {
  name: string
  designation: string
  institution: string
  initials: string
}

export interface SensorItem {
  name: string
  function: string
  target: string
  tag: string
  status: 'Prototype Verified' | 'Hardware Specified'
}

export interface TechItem {
  name: string
  category: 'Hardware' | 'Communication' | 'AI & Analytics' | 'Cloud & Backend' | 'Visualization'
  role: string
  accent: string
  status: 'Implemented' | 'Architecture Ready' | 'Proposed'
}

export interface FaqItem {
  q: string
  a: string
}

// Exact 6 Team Members
export const TEAM_MEMBERS: TeamMember[] = [
  {
    name: 'NELOPHER A',
    role: 'Hardware Engineer',
    initials: 'NA',
    domain: 'Power, PCB & Sensor Circuits',
    color: 'from-amber-500 to-orange-600',
  },
  {
    name: 'SUDHARSAN D',
    role: 'AI ML Developer',
    initials: 'SD',
    domain: 'Anomaly Detection & Sensor Fusion',
    color: 'from-orange-500 to-red-600',
  },
  {
    name: 'NAVEEN V',
    role: 'Embedded Engineer',
    initials: 'NV',
    domain: 'ESP32 Firmware & LoRa Mesh',
    color: 'from-cyan-500 to-blue-600',
  },
  {
    name: 'ALDRIN C',
    role: 'Software Developer',
    initials: 'AC',
    domain: 'Full-Stack & Gateway Services',
    color: 'from-blue-500 to-indigo-600',
  },
  {
    name: 'NARAINDRA J',
    role: 'CAD designer',
    initials: 'NJ',
    domain: 'Rugged Enclosure & Rover Chassis',
    color: 'from-purple-500 to-pink-600',
  },
  {
    name: 'LARSHA SREETHI JERSIKA A',
    role: 'Research & Development Engineer',
    initials: 'LJ',
    domain: 'Geotechnical Standards & Testing',
    color: 'from-emerald-500 to-teal-600',
  },
]

// Exact 2 Mentors
export const MENTORS: Mentor[] = [
  {
    name: 'Er Gajendran Parthasarathi',
    designation: 'Head – School of Design and Innovation',
    institution: 'Rathinam Technical Campus',
    initials: 'GP',
  },
  {
    name: 'Muthuswamy K',
    designation: 'Technical Competitions Head',
    institution: 'Rathinam Technical Campus',
    initials: 'MK',
  },
]

// Sensors
export const SENSORS: SensorItem[] = [
  {
    name: 'Inclinometer',
    function: 'Monitors changes in angular tilt and angular movement across strata axes.',
    target: 'Ground & Pillar Tilt (X/Y)',
    tag: 'Angular Drift',
    status: 'Prototype Verified',
  },
  {
    name: 'LVDT',
    function: 'Measures sub-millimeter linear displacement and shear along joint fractures.',
    target: 'Linear Displacement',
    tag: 'Joint Movement',
    status: 'Hardware Specified',
  },
  {
    name: 'Geophone',
    function: 'Detects micro-seismic vibrations and ground velocity spikes during strata shifts.',
    target: 'Ground Vibration',
    tag: 'Dynamic Seismic',
    status: 'Hardware Specified',
  },
  {
    name: 'Piezoelectric Acoustic Emission Sensor',
    function: 'Detects high-frequency acoustic micro-cracks associated with rock stress release.',
    target: 'Acoustic Emission',
    tag: 'Micro-fracture',
    status: 'Hardware Specified',
  },
  {
    name: 'FDR Soil Moisture Sensor',
    function: 'Monitors dielectric permittivity and soil moisture changes indicating water ingress.',
    target: 'Strata Moisture',
    tag: 'Soil Hydrodynamics',
    status: 'Prototype Verified',
  },
  {
    name: 'PT100 RTD Probe',
    function: 'Measures subsurface ambient temperature to compensate for thermal expansion drift.',
    target: 'Subsurface Temp',
    tag: 'Thermal Calibration',
    status: 'Prototype Verified',
  },
  {
    name: 'DS3231 RTC Module',
    function: 'Provides battery-backed precision timekeeping for microsecond telemetry timestamps.',
    target: 'Time Synchronization',
    tag: 'Clock Integrity',
    status: 'Prototype Verified',
  },
]

// Technology Stack
export const TECHNOLOGIES: TechItem[] = [
  {
    name: 'ESP32',
    category: 'Hardware',
    role: 'Sensor node microcontroller, ADC sampling, I2C IMU interrupts, and adaptive power control.',
    accent: '#EA580C',
    status: 'Implemented',
  },
  {
    name: 'SX1278 LoRa',
    category: 'Communication',
    role: 'Sub-GHz 868MHz wireless transceivers providing long-range penetration through underground strata.',
    accent: '#0284C7',
    status: 'Implemented',
  },
  {
    name: 'Raspberry Pi 4B',
    category: 'Hardware',
    role: 'Subsurface intake gallery gateway, local message caching, and cellular/Ethernet uplink aggregation.',
    accent: '#DC2626',
    status: 'Implemented',
  },
  {
    name: 'Arduino',
    category: 'Hardware',
    role: 'Dedicated secondary controller for gateway-side analog watchdog and hardware watchdog reset.',
    accent: '#0D9488',
    status: 'Architecture Ready',
  },
  {
    name: 'Multi-Sensor Architecture',
    category: 'Hardware',
    role: 'Surface-mounted stations paired with buried probe arrays for holistic 3D strata monitoring.',
    accent: '#D97706',
    status: 'Implemented',
  },
  {
    name: 'MQTT / Mosquitto',
    category: 'Communication',
    role: 'Lightweight asynchronous publish/subscribe broker routing live telemetry with QoS buffering.',
    accent: '#059669',
    status: 'Implemented',
  },
  {
    name: 'Zoho Catalyst',
    category: 'Cloud & Backend',
    role: 'Proposed cloud serverless backend for secure persistence, audit reporting, and multi-user access.',
    accent: '#F59E0B',
    status: 'Proposed',
  },
  {
    name: 'TensorFlow / TFLite',
    category: 'AI & Analytics',
    role: 'LSTM Autoencoder for multivariate anomaly detection and edge-ready statistical risk scoring.',
    accent: '#EA580C',
    status: 'Architecture Ready',
  },
  {
    name: 'Leaflet',
    category: 'Visualization',
    role: 'GIS-based geospatial map rendering active coal panel boundaries, pillar grids, and node markers.',
    accent: '#10B981',
    status: 'Implemented',
  },
  {
    name: 'Plotly',
    category: 'AI & Analytics',
    role: 'High-density multi-axis telemetry graphs depicting tilt rates, vibration FFT, and risk curves.',
    accent: '#6366F1',
    status: 'Implemented',
  },
  {
    name: 'Three.js',
    category: 'Visualization',
    role: 'Interactive 3D Digital Twin illustrating geological strata layers, goaf voids, and coal seams.',
    accent: '#8B5CF6',
    status: 'Implemented',
  },
  {
    name: 'React 19',
    category: 'Visualization',
    role: 'High-performance interactive monitoring dashboard frontend with sub-second WebSocket updates.',
    accent: '#0284C7',
    status: 'Implemented',
  },
]

// FAQs
export const FAQS: FaqItem[] = [
  {
    q: 'What is SensOra?',
    a: 'SensOra is a proposed AI-enabled, low-cost mine subsidence monitoring, prediction, and early warning system developed by team RTECH 007 for Smart India Hackathon 2026 (Problem Statement SIH26025). It is engineered for underground coal mines in India, combining surface and buried sensor nodes, LoRa mesh communication, AI anomaly detection, Digital Twin GIS visualization, a verification rover, and immediate underground miner alerts.',
  },
  {
    q: 'What is mine subsidence?',
    a: 'Mine subsidence is the downward movement or collapse of overlying geological strata and ground surface resulting from underground mineral extraction (such as board-and-pillar extraction or longwall de-pillaring). Without continuous monitoring, sudden subsidence can cause catastrophic roof falls, surface cratering, structural collapse, and endanger miner lives.',
  },
  {
    q: 'How do the sensor nodes communicate?',
    a: 'The proposed architecture uses ESP32-based sensor nodes coupled with SX1278 LoRa transceivers operating in the sub-GHz spectrum (868 MHz). LoRa Chirp Spread Spectrum modulation penetrates rock strata and curves through winding underground galleries far more reliably than high-frequency Wi-Fi or cables. A proposed multi-hop mesh relays telemetry to a central Raspberry Pi 4B gateway.',
  },
  {
    q: 'What does the AI model do?',
    a: 'The proposed AI/ML system employs an LSTM Autoencoder combined with multi-sensor fusion, baseline Z-score drift detection, and dynamic threshold scoring. It learns normal background strata behavior and flags abnormal multivariate deviations (such as simultaneous tilt acceleration and micro-seismic vibrations) to predict increasing subsidence risk before physical structural failure occurs.',
  },
  {
    q: 'How are abnormal readings presented?',
    a: 'The SensOra dashboard presents live telemetry, historical trends, location-specific risk zones, 2D/3D stratigraphic Digital Twin models, and GIS mine maps. Configured abnormal conditions trigger instant color-coded visual alerts on operator screens, automated compliance audit records, and trigger local audio-visual warning beacons directly in the affected underground gallery.',
  },
  {
    q: 'Does SensOra replace mine safety inspections?',
    a: 'No. SensOra is engineered strictly to support continuous monitoring, real-time risk visibility, and informed decision-making in compliance with DGMS (Directorate General of Mines Safety) regulations. It is designed to empower safety managers and overmen, but does not replace mandatory physical inspections, statutory overman rounds, or certified geotechnical evaluations.',
  },
  {
    q: 'Is the system already deployed in an underground mine?',
    a: 'No. SensOra is currently an advanced prototype developed for Smart India Hackathon 2026. The real hardware ingestion pipeline (ESP32 node NODE01 with tilt, vibration, soil moisture, and temperature) and monitoring dashboard are functioning in our test environment, while full-scale underground mine deployment is planned for subsequent industrial trials under mining regulatory guidelines.',
  },
  {
    q: 'Is the monitoring dashboard connected to real sensors?',
    a: 'The monitoring dashboard features an operational real-time backend supporting live telemetry ingestion from our hardware test node (NODE01). For demonstration and multi-panel visualization purposes, simulated panel markers and additional illustrative nodes are clearly labeled as DEMO / SIMULATED to ensure transparent technical evaluation.',
  },
]
