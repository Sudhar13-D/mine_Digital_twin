import type { SensorNode, Alert } from '../types'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export function getAuthToken(): string | null {
  return localStorage.getItem('subsideai_token')
}

export function setAuthToken(token: string | null) {
  if (token) {
    localStorage.setItem('subsideai_token', token)
  } else {
    localStorage.removeItem('subsideai_token')
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken()
  const headers = new Headers(options.headers || {})
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json')
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    let errorMsg = `HTTP Error ${response.status}: ${response.statusText}`
    try {
      const errorJson = await response.json()
      if (errorJson.detail) errorMsg = errorJson.detail
    } catch {
      // ignore
    }
    throw new Error(errorMsg)
  }

  if (response.headers.get('content-type')?.includes('application/json')) {
    return response.json()
  }
  return response.blob() as unknown as T
}

export const api = {
  // Auth
  async login(email: string, password: string) {
    return request<{ access_token: string; token_type: string; user: any }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
  },
  async getMe() {
    return request<any>('/api/auth/me')
  },
  async logout() {
    return request('/api/auth/logout', { method: 'POST' })
  },

  // Nodes
  async getNodes(panel?: string): Promise<SensorNode[]> {
    const query = panel && panel !== 'All' ? `?panel=${encodeURIComponent(panel)}` : ''
    return request<SensorNode[]>(`/api/nodes${query}`)
  },
  async getNode(id: number): Promise<SensorNode> {
    return request<SensorNode>(`/api/nodes/${id}`)
  },
  async getNodeHistory(id: number, limit = 50) {
    return request<any[]>(`/api/nodes/${id}/history?limit=${limit}`)
  },
  async createNode(data: { label: string; panel: string; gisX?: number; gisY?: number; csX?: number; pillarId?: number }) {
    return request<SensorNode>('/api/nodes', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  // Alerts
  async getAlerts(panel?: string): Promise<Alert[]> {
    const query = panel && panel !== 'All' ? `?panel=${encodeURIComponent(panel)}` : ''
    return request<Alert[]>(`/api/alerts${query}`)
  },
  async acknowledgeAlert(id: string, acknowledgedBy = 'Mine Manager'): Promise<Alert> {
    return request<Alert>(`/api/alerts/${encodeURIComponent(id)}/acknowledge`, {
      method: 'POST',
      body: JSON.stringify({ acknowledgedBy }),
    })
  },
  async resolveAlert(id: string): Promise<Alert> {
    return request<Alert>(`/api/alerts/${encodeURIComponent(id)}/resolve`, {
      method: 'POST',
    })
  },

  // Panels & Pillars
  async getPanels() {
    return request<any[]>('/api/panels')
  },
  async getPillars() {
    return request<any[]>('/api/pillars')
  },

  // Reports
  async getRecentReports() {
    return request<any[]>('/api/reports/recent')
  },
  async generateReport(payload: { reportType: string; panel: string; dateFrom: string; dateTo: string; format: 'PDF' | 'CSV' | 'Excel' }): Promise<Blob> {
    const response = await fetch(`${API_BASE_URL}/api/reports/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(getAuthToken() ? { Authorization: `Bearer ${getAuthToken()}` } : {}),
      },
      body: JSON.stringify(payload),
    })
    if (!response.ok) {
      throw new Error(`Report generation failed: ${response.statusText}`)
    }
    return response.blob()
  },

  // Settings
  async getSettings(): Promise<Record<string, any>> {
    return request<Record<string, any>>('/api/settings')
  },
  async updateSettings(key: string, value: any, category = 'general') {
    return request('/api/settings/update', {
      method: 'POST',
      body: JSON.stringify({ key, value, category }),
    })
  },
}
