import { useState, useEffect, useCallback, useRef } from 'react'
import type { SensorNode, Alert, RiskLevel } from '../types'
import { INITIAL_NODES, INITIAL_ALERTS } from '../data'
import { api } from './client'

function getWebSocketUrl(): string {
  if (import.meta.env.VITE_WS_URL) {
    return import.meta.env.VITE_WS_URL
  }
  const apiUrl = import.meta.env.VITE_API_URL
  if (apiUrl) {
    const wsProto = apiUrl.startsWith('https') ? 'wss:' : 'ws:'
    const host = apiUrl.replace(/^https?:\/\//, '').replace(/\/$/, '')
    return `${wsProto}//${host}/ws/live`
  }
  return 'ws://localhost:8000/ws/live'
}

const WS_URL = getWebSocketUrl()

export function normalizeNode(raw: any): SensorNode {
  if (!raw) return raw
  return {
    id: Number(raw.id ?? 1),
    label: String(raw.label ?? 'NODE01'),
    panel: String(raw.panel ?? 'Panel 1'),
    risk: (raw.risk as RiskLevel) || 'LOW',
    status: raw.status === 'online' ? 'online' : 'offline',
    tilt: raw.tilt != null ? Number(raw.tilt) : null,
    vibration: raw.vibration != null ? Number(raw.vibration) : null,
    ae: raw.ae != null ? Number(raw.ae) : null,
    displacement: raw.displacement != null ? Number(raw.displacement) : null,
    soilMoisture: raw.soilMoisture != null ? Number(raw.soilMoisture) : (raw.soil_moisture != null ? Number(raw.soil_moisture) : null),
    temp: raw.temp != null ? Number(raw.temp) : (raw.temperature_c != null ? Number(raw.temperature_c) : null),
    humidity: raw.humidity != null ? Number(raw.humidity) : (raw.humidity_percent != null ? Number(raw.humidity_percent) : null),
    uwb: raw.uwb != null ? Number(raw.uwb) : null,
    crack: raw.crack != null ? Number(raw.crack) : null,
    rssi: raw.rssi != null ? Number(raw.rssi) : null,
    snr: raw.snr != null ? Number(raw.snr) : null,
    lastUpdate: Number(raw.lastUpdate ?? raw.last_update ?? 0),
    gisX: Number(raw.gisX ?? raw.gis_x ?? 200),
    gisY: Number(raw.gisY ?? raw.gis_y ?? 200),
    csX: Number(raw.csX ?? raw.cs_x ?? 0.35),
    pillarId: Number(raw.pillarId ?? raw.pillar_id ?? 1),
    anomalyScore: Number(raw.anomalyScore ?? raw.anomaly_score ?? 0),
    confidence: Number(raw.confidence ?? 60),
    predictionDays: Number(raw.predictionDays ?? raw.prediction_days ?? 30),
  }
}

export function normalizeAlert(raw: any): Alert {
  if (!raw) return raw
  let nodeIds: number[] = []
  if (Array.isArray(raw.nodeIds)) {
    nodeIds = raw.nodeIds.map(Number)
  } else if (Array.isArray(raw.node_ids)) {
    nodeIds = raw.node_ids.map(Number)
  } else if (raw.nodeId || raw.node_id) {
    nodeIds = [Number(raw.nodeId || raw.node_id)]
  }

  return {
    id: String(raw.id ?? `ALT-${Date.now()}`),
    level: (raw.level as RiskLevel) || 'LOW',
    panel: String(raw.panel ?? 'Panel 1'),
    nodeIds,
    timestamp: String(raw.timestamp ?? new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })),
    status: raw.status || 'active',
    acknowledgedBy: raw.acknowledgedBy || raw.acknowledged_by,
    message: String(raw.message ?? 'Geotechnical event detected.'),
  }
}

export function useLiveMonitoring() {
  const [nodes, setNodes] = useState<SensorNode[]>(() => INITIAL_NODES.map(normalizeNode))
  const [alerts, setAlerts] = useState<Alert[]>(() => INITIAL_ALERTS.map(normalizeAlert))
  const [connected, setConnected] = useState<boolean>(false)
  const [incomingToast, setIncomingToast] = useState<{ id: string; message: string; level: RiskLevel } | null>(null)
  
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<any>(null)

  // Fetch initial REST data once
  useEffect(() => {
    let isMounted = true
    async function fetchInitial() {
      try {
        const [fetchedNodes, fetchedAlerts] = await Promise.all([
          api.getNodes(),
          api.getAlerts(),
        ])
        if (isMounted) {
          if (Array.isArray(fetchedNodes) && fetchedNodes.length > 0) {
            setNodes(fetchedNodes.map(normalizeNode))
          }
          if (Array.isArray(fetchedAlerts) && fetchedAlerts.length > 0) {
            setAlerts(fetchedAlerts.map(normalizeAlert))
          }
        }
      } catch (err) {
        // Fallback to initial mock data if backend is starting up or unreachable
        console.warn('Initial REST fetch fallback to local mock:', err)
      }
    }
    fetchInitial()
    return () => { isMounted = false }
  }, [])

  // Setup WebSocket connection
  useEffect(() => {
    let isMounted = true

    function connectWebSocket() {
      try {
        const ws = new WebSocket(WS_URL)
        wsRef.current = ws

        ws.onopen = () => {
          if (!isMounted) return
          console.log('[LiveMonitoring] WebSocket connected.')
          setConnected(true)
        }

        ws.onmessage = (event) => {
          if (!isMounted) return
          try {
            const data = JSON.parse(event.data)
            if (data.type === 'INITIAL_SNAPSHOT') {
              if (Array.isArray(data.nodes) && data.nodes.length > 0) {
                setNodes(data.nodes.map(normalizeNode))
              }
              if (Array.isArray(data.alerts) && data.alerts.length > 0) {
                setAlerts(data.alerts.map(normalizeAlert))
              }
            } else if (data.type === 'NODE_UPDATE') {
              if (data.node) {
                const normNode = normalizeNode(data.node)
                setNodes((prev) => {
                  const idx = prev.findIndex((n) => n.id === normNode.id)
                  if (idx !== -1) {
                    const next = [...prev]
                    next[idx] = normNode
                    return next
                  }
                  return [...prev, normNode]
                })
              }
              if (data.alert) {
                const normAlert = normalizeAlert(data.alert)
                setAlerts((prev) => {
                  const idx = prev.findIndex((a) => a.id === normAlert.id)
                  if (idx !== -1) {
                    const next = [...prev]
                    next[idx] = normAlert
                    return next
                  }
                  return [normAlert, ...prev]
                })
                if (normAlert.level === 'HIGH' && normAlert.status === 'active') {
                  const nodeStr = normAlert.nodeIds.length > 0
                    ? `Nodes ${normAlert.nodeIds.map((i) => `N${i}`).join(', ')}`
                    : normAlert.panel
                  setIncomingToast({
                    id: normAlert.id,
                    message: `⚠ HIGH RISK — ${normAlert.panel}, ${nodeStr} · ${normAlert.message.slice(0, 80)}`,
                    level: 'HIGH',
                  })
                }
              }
            } else if (data.type === 'ALERT_UPDATE') {
              if (data.alert) {
                const normAlert = normalizeAlert(data.alert)
                setAlerts((prev) =>
                  prev.map((a) => (a.id === normAlert.id ? normAlert : a))
                )
              }
            }
          } catch (err) {
            console.error('[LiveMonitoring] Error parsing WS message:', err)
          }
        }

        ws.onclose = () => {
          if (!isMounted) return
          setConnected(false)
          reconnectTimeoutRef.current = setTimeout(connectWebSocket, 3000)
        }

        ws.onerror = () => {
          ws.close()
        }
      } catch {
        reconnectTimeoutRef.current = setTimeout(connectWebSocket, 3000)
      }
    }

    connectWebSocket()

    return () => {
      isMounted = false
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current)
      if (wsRef.current) {
        wsRef.current.onclose = null
        wsRef.current.close()
      }
    }
  }, [])

  // Acknowledge alert function with backend persistence
  const acknowledgeAlert = useCallback(async (alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === alertId ? { ...a, status: 'acknowledged', acknowledgedBy: 'Mine Manager' } : a
      )
    )
    try {
      await api.acknowledgeAlert(alertId, 'Mine Manager')
    } catch (err) {
      console.warn('Alert ack backend sync notice:', err)
    }
  }, [])

  // Resolve alert function
  const resolveAlert = useCallback(async (alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === alertId ? { ...a, status: 'resolved' } : a
      )
    )
    try {
      await api.resolveAlert(alertId)
    } catch (err) {
      console.warn('Alert resolve backend sync notice:', err)
    }
  }, [])

  return {
    nodes,
    alerts,
    connected,
    incomingToast,
    clearToast: () => setIncomingToast(null),
    acknowledgeAlert,
    resolveAlert,
    setNodes,
  }
}
