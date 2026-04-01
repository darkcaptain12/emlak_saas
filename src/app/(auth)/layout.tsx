import type { ReactNode } from 'react'

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: 'linear-gradient(135deg, #1e6b9a 0%, #2c8ac4 40%, #4aabde 60%, #1e6b9a 100%)',
        fontFamily: '"Tahoma", "MS Sans Serif", Arial, sans-serif',
      }}
    >
      {/* Tiled desktop feel */}
      <div className="w-full max-w-sm">
        {/* Logo area */}
        <div className="flex items-center gap-2 mb-3 px-1">
          <div
            style={{
              width: 32,
              height: 32,
              background: 'linear-gradient(135deg, #ffcc00, #ff9900)',
              border: '2px outset #ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 18,
            }}
          >
            🏠
          </div>
          <span style={{ color: '#ffffff', fontWeight: 'bold', fontSize: 18, textShadow: '1px 1px 2px #000' }}>
            EmlakCRM
          </span>
        </div>

        {children}

        {/* Taskbar */}
        <div
          className="mt-4 px-2 py-1 flex items-center gap-2"
          style={{
            background: 'linear-gradient(to bottom, #c0c0c0 0%, #ababab 50%, #c0c0c0 100%)',
            border: '2px outset #ffffff',
            borderBottom: '2px inset #808080',
          }}
        >
          <div
            style={{
              background: 'linear-gradient(to right, #2b6bba, #57a0e0)',
              color: '#fff',
              fontWeight: 'bold',
              fontSize: 11,
              padding: '2px 8px',
              border: '2px outset #7ab3e0',
              cursor: 'default',
              letterSpacing: 0.5,
            }}
          >
            ▶ Start
          </div>
          <div style={{ flex: 1 }} />
          <div
            style={{
              fontSize: 10,
              color: '#333',
              background: '#d4d0c8',
              border: '1px inset #808080',
              padding: '1px 6px',
            }}
          >
            {new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
    </div>
  )
}
