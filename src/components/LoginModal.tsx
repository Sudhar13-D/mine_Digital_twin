import React, { useState } from 'react'
import { api, setAuthToken } from '../api/client'
import { useTheme } from '../context/ThemeContext'

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (user: any) => void
}

export default function LoginModal({ isOpen, onClose, onSuccess }: LoginModalProps) {
  const { colors } = useTheme()
  const [email, setEmail] = useState('manager@subside.ai')
  const [password, setPassword] = useState('password123')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await api.login(email, password)
      setAuthToken(res.access_token)
      onSuccess(res.user)
      onClose()
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: colors.isDark ? 'rgba(10, 8, 6, 0.75)' : 'rgba(15, 23, 42, 0.45)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        padding: '16px',
      }}
    >
      <div
        className="slide-up"
        style={{
          width: '100%',
          maxWidth: '380px',
          background: colors.bgCard,
          border: `1px solid ${colors.borderPrimary}`,
          borderRadius: '8px',
          boxShadow: colors.shadowMd,
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: `1px solid ${colors.borderPrimary}`,
            background: colors.bgCardSubtle,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <svg width="24" height="24" viewBox="0 0 32 32">
              <polygon points="16,2 29,9 29,23 16,30 3,23 3,9" fill="none" stroke={colors.accent} strokeWidth="1.6" />
              <polygon points="16,8 24,12 24,20 16,24 8,20 8,12" fill={colors.accent} fillOpacity="0.15" />
              <circle cx="16" cy="16" r="3.5" fill={colors.accent} />
            </svg>
            <div>
              <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '14px', fontWeight: 700, color: colors.textPrimary }}>
                Operator Sign In
              </p>
              <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '10px', color: colors.textMuted }}>
                SubsideAI Platform Access
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: colors.textMuted,
              fontSize: '15px',
              cursor: 'pointer',
            }}
            className="hover:opacity-80 transition-opacity"
          >
            ✕
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} style={{ padding: '20px' }}>
          {error && (
            <div
              style={{
                marginBottom: '14px',
                padding: '8px 12px',
                borderRadius: '4px',
                background: colors.isDark ? 'rgba(179,73,46,0.15)' : 'rgba(220,38,38,0.10)',
                border: `1px solid ${colors.isDark ? '#B3492E' : '#DC2626'}44`,
                color: colors.isDark ? '#B3492E' : '#DC2626',
                fontFamily: 'IBM Plex Mono, monospace',
                fontSize: '11px',
              }}
            >
              ⚠ {error}
            </div>
          )}

          <div style={{ marginBottom: '14px' }}>
            <label
              style={{
                display: 'block',
                fontFamily: 'IBM Plex Mono, monospace',
                fontSize: '10px',
                fontWeight: 600,
                color: colors.textMuted,
                marginBottom: '5px',
                letterSpacing: '0.05em',
              }}
            >
              EMAIL ADDRESS
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                background: colors.inputBg,
                border: `1px solid ${colors.inputBorder}`,
                borderRadius: '4px',
                padding: '8px 12px',
                fontFamily: 'IBM Plex Mono, monospace',
                fontSize: '12px',
                color: colors.inputText,
                outline: 'none',
              }}
            />
          </div>

          <div style={{ marginBottom: '18px' }}>
            <label
              style={{
                display: 'block',
                fontFamily: 'IBM Plex Mono, monospace',
                fontSize: '10px',
                fontWeight: 600,
                color: colors.textMuted,
                marginBottom: '5px',
                letterSpacing: '0.05em',
              }}
            >
              PASSWORD
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                background: colors.inputBg,
                border: `1px solid ${colors.inputBorder}`,
                borderRadius: '4px',
                padding: '8px 12px',
                fontFamily: 'IBM Plex Mono, monospace',
                fontSize: '12px',
                color: colors.inputText,
                outline: 'none',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '10px',
              background: loading ? (colors.isDark ? '#8A7A5A' : '#94A3B8') : colors.accent,
              color: colors.isDark ? '#1A1714' : '#FFFFFF',
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: '13px',
              fontWeight: 700,
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'default' : 'pointer',
              boxShadow: colors.shadowSm,
              transition: 'background 0.15s',
            }}
          >
            {loading ? 'Authenticating…' : 'Sign In to Dashboard'}
          </button>

          <div style={{ marginTop: '14px', textAlign: 'center' }}>
            <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '10px', color: colors.textMuted }}>
              Default: manager@subside.ai / password123
            </span>
          </div>
        </form>
      </div>
    </div>
  )
}
