'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('E-posta veya şifre hatalı.')
      setLoading(false)
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div
      style={{
        fontFamily: '"Tahoma", "MS Sans Serif", Arial, sans-serif',
        fontSize: 11,
      }}
    >
      {/* Window chrome */}
      <div
        style={{
          border: '2px outset #ffffff',
          borderBottom: '2px inset #404040',
          background: '#d4d0c8',
          boxShadow: '2px 2px 8px rgba(0,0,0,0.5)',
        }}
      >
        {/* Title bar */}
        <div
          style={{
            background: 'linear-gradient(to right, #0a246a, #3a6ea5)',
            padding: '3px 4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            userSelect: 'none',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 13 }}>🏠</span>
            <span style={{ color: '#fff', fontWeight: 'bold', fontSize: 11 }}>
              EmlakCRM — Giriş Yap
            </span>
          </div>
          {/* Window control buttons */}
          <div style={{ display: 'flex', gap: 2 }}>
            {['_', '□', '✕'].map((icon, i) => (
              <div
                key={i}
                style={{
                  width: 16,
                  height: 14,
                  background: '#d4d0c8',
                  border: '1px outset #ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 9,
                  fontWeight: 'bold',
                  cursor: 'default',
                  color: '#000',
                }}
              >
                {icon}
              </div>
            ))}
          </div>
        </div>

        {/* Menu bar */}
        <div
          style={{
            background: '#d4d0c8',
            padding: '2px 4px',
            display: 'flex',
            gap: 0,
            borderBottom: '1px solid #808080',
          }}
        >
          {['Dosya', 'Düzenle', 'Görünüm', 'Yardım'].map((item) => (
            <span
              key={item}
              style={{
                padding: '1px 8px',
                fontSize: 11,
                cursor: 'default',
                color: '#000',
              }}
            >
              {item}
            </span>
          ))}
        </div>

        {/* Window body */}
        <div style={{ padding: 16 }}>
          {/* Inner sunken panel */}
          <div
            style={{
              border: '2px inset #808080',
              background: '#ffffff',
              padding: 16,
              marginBottom: 12,
            }}
          >
            <div
              style={{
                fontSize: 13,
                fontWeight: 'bold',
                color: '#0a246a',
                marginBottom: 12,
                paddingBottom: 6,
                borderBottom: '1px solid #808080',
              }}
            >
              Lütfen hesap bilgilerinizi girin
            </div>

            {error && (
              <div
                style={{
                  background: '#fff0f0',
                  border: '2px inset #ff0000',
                  padding: '4px 8px',
                  color: '#cc0000',
                  fontSize: 11,
                  marginBottom: 10,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <span style={{ fontSize: 14 }}>⚠</span>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* E-posta */}
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
                <label
                  htmlFor="email"
                  style={{
                    width: 80,
                    fontSize: 11,
                    color: '#000',
                    flexShrink: 0,
                  }}
                >
                  E-posta:
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ornek@gmail.com"
                  required
                  style={{
                    flex: 1,
                    border: '2px inset #808080',
                    background: '#ffffff',
                    padding: '2px 4px',
                    fontSize: 11,
                    fontFamily: 'Tahoma, Arial, sans-serif',
                    outline: 'none',
                    color: '#000',
                  }}
                />
              </div>

              {/* Şifre */}
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 14 }}>
                <label
                  htmlFor="password"
                  style={{
                    width: 80,
                    fontSize: 11,
                    color: '#000',
                    flexShrink: 0,
                  }}
                >
                  Şifre:
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  style={{
                    flex: 1,
                    border: '2px inset #808080',
                    background: '#ffffff',
                    padding: '2px 4px',
                    fontSize: 11,
                    fontFamily: 'Tahoma, Arial, sans-serif',
                    outline: 'none',
                    color: '#000',
                  }}
                />
              </div>

              {/* Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6 }}>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    background: loading ? '#a0a0a0' : '#d4d0c8',
                    border: loading ? '2px inset #808080' : '2px outset #ffffff',
                    padding: '3px 20px',
                    fontSize: 11,
                    fontFamily: 'Tahoma, Arial, sans-serif',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    color: '#000',
                    minWidth: 80,
                    fontWeight: 'bold',
                  }}
                >
                  {loading ? 'Bekleniyor...' : 'Tamam'}
                </button>
                <button
                  type="button"
                  onClick={() => { setEmail(''); setPassword(''); setError(null) }}
                  style={{
                    background: '#d4d0c8',
                    border: '2px outset #ffffff',
                    padding: '3px 20px',
                    fontSize: 11,
                    fontFamily: 'Tahoma, Arial, sans-serif',
                    cursor: 'pointer',
                    color: '#000',
                    minWidth: 80,
                  }}
                >
                  İptal
                </button>
              </div>
            </form>
          </div>

          {/* Register link as a hyperlink in XP style */}
          <div style={{ fontSize: 11, color: '#333', textAlign: 'center' }}>
            Hesabınız yok mu?{' '}
            <Link
              href="/register"
              style={{
                color: '#0000cc',
                textDecoration: 'underline',
                cursor: 'pointer',
              }}
            >
              Üye olun
            </Link>
          </div>
        </div>

        {/* Status bar */}
        <div
          style={{
            background: '#d4d0c8',
            borderTop: '1px solid #808080',
            padding: '2px 8px',
            display: 'flex',
            gap: 8,
          }}
        >
          <div
            style={{
              flex: 1,
              border: '1px inset #808080',
              padding: '1px 4px',
              fontSize: 10,
              color: '#000',
            }}
          >
            Hazır
          </div>
          <div
            style={{
              border: '1px inset #808080',
              padding: '1px 4px',
              fontSize: 10,
              color: '#000',
              whiteSpace: 'nowrap',
            }}
          >
            EmlakCRM v1.0
          </div>
        </div>
      </div>
    </div>
  )
}
