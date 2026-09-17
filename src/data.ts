import type { SensorNode, Alert } from './types'

export const PANELS = ['Panel 1', 'Panel 2', 'Panel 3']

export const INITIAL_NODES: SensorNode[] = [
  {
    id: 1,
    label: 'NODE01',
    panel: 'Panel 1',
    risk: 'LOW',
    status: 'offline', // Flips to online automatically upon first MQTT reading
    tilt: null,
    vibration: null,
    ae: null,           // No AE hardware sensor -> NULL
    displacement: null, // No displacement hardware sensor -> NULL
    soilMoisture: null,
    temp: null,
    humidity: null,
    uwb: null,          // NULL
    crack: null,        // NULL
    rssi: null,
    snr: null,
    lastUpdate: 0,
    gisX: 200,          // Placeholder coordinate
    gisY: 200,          // Placeholder coordinate
    csX: 0.35,          // Placeholder cross-section position
    pillarId: 1,
    anomalyScore: 0.0,
    confidence: 60,
    predictionDays: 30,
  },
]

export const INITIAL_ALERTS: Alert[] = []
