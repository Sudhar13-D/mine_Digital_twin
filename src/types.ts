export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH'
export type NodeStatus = 'online' | 'offline'
export type AlertStatus = 'active' | 'acknowledged' | 'resolved'

export interface SensorNode {
  id: number
  label: string
  panel: string
  risk: RiskLevel
  status: NodeStatus
  tilt?: number | null
  vibration?: number | null
  ae?: number | null
  displacement?: number | null
  soilMoisture?: number | null
  temp?: number | null
  humidity?: number | null
  uwb?: number | null
  crack?: number | null
  rssi?: number | null
  snr?: number | null
  lastUpdate: number
  gisX: number
  gisY: number
  csX: number
  pillarId: number
  anomalyScore: number
  confidence: number
  predictionDays: number
}

export interface Alert {
  id: string
  level: RiskLevel
  panel: string
  nodeIds: number[]
  timestamp: string
  status: AlertStatus
  acknowledgedBy?: string
  message: string
}

export interface LayerConfig {
  heatmap: boolean
  pillars: boolean
  vectors: boolean
  grid: boolean
}
